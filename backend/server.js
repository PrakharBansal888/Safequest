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

// --- Comment Sub-Schema ---
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// --- BlogPost Model ---
const blogPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

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
      prompt = `Continue this safe, age-appropriate adventure for a 10-14 year old interested in ${interests.join(', ')}. Here's what happened so far:\n${previousContext}\n\nNow, continue the adventure. It should end with a new clear safety-related decision point with exactly 3 choices. Format the output as a JSON object with "story" and "choices" properties. The "choices" property should be an array of objects, each with "text", "safe" (boolean), and "points" (number, where safe choices are positive, unsafe are negative).`;
    } else {
      // This is a new story
      prompt = `Create the beginning of a safe, age-appropriate adventure for a 10-14 year old interested in ${interests.join(', ')}. The adventure should end with a clear safety-related decision point with exactly 3 choices. Format the output as a JSON object with "story" and "choices" properties. The "choices" property should be an array of objects, each with "text", "safe" (boolean), and "points" (number, where safe choices are positive, unsafe are negative).`;
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

// --- BlogPost Routes ---

// Get all blog posts for the logged-in user
app.get('/api/blogposts', auth, async (req, res) => {
  try {
    // Use aggregation to sort by number of likes
    const posts = await BlogPost.aggregate([
      {
        $project: {
          title: 1,
          content: 1,
          userId: 1,
          createdAt: 1,
          likes: 1,
          comments: 1,
          likesCount: { $size: { $ifNull: ["$likes", []] } } // Add a field for the number of likes, handling null/missing arrays
        }
      },
      { $sort: { likesCount: -1 } } // Sort by the new field in descending order
    ]);
    res.json(posts); // This now returns all posts, sorted by popularity
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

// Get blog posts for ONLY the logged-in user
app.get('/api/blogposts/me', auth, async (req, res) => {
  try {
    const posts = await BlogPost.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user blog posts.' });
  }
});

// Create a new blog post
app.post('/api/blogposts', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required.' });
    }
    const newPost = new BlogPost({
      userId: req.user.id,
      title,
      content
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

// Get a single blog post by ID
app.get('/api/blogposts/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found or user not authorized.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
});

// Update a blog post by ID
app.put('/api/blogposts/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await BlogPost.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found or user not authorized.' });
    }
    if (title) post.title = title;
    if (content) post.content = content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

// Delete a blog post by ID
app.delete('/api/blogposts/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found or user not authorized.' });
    }
    res.json({ msg: 'Blog post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

// @route   PUT api/blogposts/:id/like
// @desc    Like or unlike a blog post
// @access  Private
app.put('/api/blogposts/:id/like', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found.' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.equals(req.user.id))) {
      // If yes, remove the like (unlike)
      post.likes = post.likes.filter(
        like => !like.equals(req.user.id)
      );
    } else {
      // If no, add the like
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/blogposts/:id/comment
// @desc    Add a comment to a blog post
// @access  Private
app.post('/api/blogposts/:id/comment', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email');
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found.' });
    }

    const newComment = {
      text: req.body.text,
      userId: req.user.id,
      userEmail: user.email
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
