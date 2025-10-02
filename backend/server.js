const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = mongoose.Types;
require('dotenv').config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is your Groq API key
  baseURL: 'https://api.groq.com/openai/v1',
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;  // or your MongoDB connection string
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- User Model ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// --- Story Model ---
const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  initialInterests: [String],
  fullStory: [{
    story: String,
    choices: [{ text: String, safe: Boolean, points: Number }],
    decision: {
      text: String,
      safe: Boolean,
      points: Number
    },
    feedback: String
  }],
  finalScore: Number,
  isComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.model('Story', storySchema);

app.get('/', (req, res) => {
  res.send('SafeQuest Backend is running!');
});

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// --- Auth Routes ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: savedUser._id, email: savedUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET api/auth/user
// @desc    Get user data from token
// @access  Private
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- Story Generation Route ---
app.post('/api/generate-story', async (req, res) => {
  const { interests, decisions } = req.body;
  
  // This is the real implementation using the OpenAI API
  try {
    let prompt;
    if (decisions && decisions.length > 0) {
      // This is a continuing story
      const previousContext = decisions.map(d => `Story: ${d.story}\nChoice: ${d.decision.text}`).join('\n\n');
      prompt = `Continue this safe, age-appropriate story for a 10-14 year old interested in ${interests.join(', ')}. Here's what happened so far:\n${previousContext}\n\nNow, continue the story. It should end with a new clear safety-related decision point with exactly 3 choices. Format the output as a JSON object with "story" and "choices" properties. The "choices" property should be an array of objects, each with "text", "safe" (boolean), and "points" (number, where safe choices are positive, unsafe are negative).`;
    } else {
      // This is a new story
      prompt = `Create the beginning of a safe, age-appropriate story for a 10-14 year old interested in ${interests.join(', ')}. The story should end with a clear safety-related decision point with exactly 3 choices. Format the output as a JSON object with "story" and "choices" properties. The "choices" property should be an array of objects, each with "text", "safe" (boolean), and "points" (number, where safe choices are positive, unsafe are negative).`;
    }
  
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Adjusted model name for Groq
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" } // Ensures the output is valid JSON
    });
    
    const storyData = JSON.parse(completion.choices[0].message.content);
    res.json(storyData);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to generate story. Please try again.' });
  }
});

// --- Save Story Route ---
app.post('/api/stories', auth, async (req, res) => {
  try {
    const { initialInterests, fullStory, finalScore, isComplete } = req.body;
    const newStory = new Story({
      userId: req.user.id,
      initialInterests,
      fullStory,
      finalScore,
      isComplete
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save story.' });
  }
});

// --- Get User's Stories Route ---
app.get('/api/stories', auth, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
});

// --- Update Story Route ---
app.put('/api/stories/:id', auth, async (req, res) => {
  try {
    const { fullStory, finalScore, isComplete } = req.body;
    const story = await Story.findOne({ _id: new ObjectId(req.params.id), userId: req.user.id });

    if (!story) {
      return res.status(404).json({ msg: 'Story not found or user not authorized.' });
    }

    story.fullStory = fullStory;
    story.finalScore = finalScore;
    story.isComplete = isComplete;

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update story.' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});