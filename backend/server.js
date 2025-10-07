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

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const port = process.env.PORT || 5000;

app.use(cors());

// Increase payload size limit to handle large story progress objects
// The default is 100kb, which is too small for long stories.
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const uri = process.env.MONGO_URI;  // or your MongoDB connection string
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- User Model ---
const userStatsSchema = new mongoose.Schema({
  storiesCompleted: { type: Number, default: 0 },
  safeChoicesStreak: { type: Number, default: 0 },
  perfectStories: { type: Number, default: 0 },
  achievements: [String],
  lastLoginDate: { type: Date, default: Date.now },
  loginStreak: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  stats: { type: userStatsSchema, default: () => ({}) }
});

const User = mongoose.model('User', userSchema);

// --- Story Model ---
const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  character: { type: Object }, // Add character field
  initialInterests: [String],
  fullStory: [{
    story: String,
    choices: [{ text: String, safe: Boolean, points: Number }],
    imageUrl: String, // Add imageUrl field
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
const characterSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  trait: String,
  image: String
});
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
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'User with this email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if input is email or username
    const isEmail = emailOrUsername.includes('@');
    const user = await User.findOne(
      isEmail ? { email: emailOrUsername } : { username: emailOrUsername }
    );
    
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
      user: { id: user._id, username: user.username, email: user.email }
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

const extractScenario = (storyText) => {
  // Take first 2 sentences or 150 characters for image prompt
  const sentences = storyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.slice(0, 2).join('. ').substring(0, 150);
};

// Helper function to extract scenario from story text for image generation
const generateStoryImage = async (character, storyText, interests) => {
  // Using a faster, more reliable model to prevent timeouts on the free tier.
  const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!HUGGINGFACE_API_KEY) {
    console.error('Hugging Face API key is not set.');
    return null;
  }

  try {
    const scenario = extractScenario(storyText);
    const imagePrompt = `Beautiful, high-quality digital painting of a background scene for a children's story about ${character.name}. Scene: ${scenario}. Style: cinematic, vibrant, colorful, high detail, enchanting, friendly cartoon, animated, safe and age-appropriate. Setting involves: ${interests.join(', ')}. Do not show any people or characters, only the background scenery. No text, words, or watermarks in the image.`;
    
    console.log('Generating image with prompt:', imagePrompt);

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        inputs: imagePrompt,
        parameters: { width: 1024, height: 576 } // Request a 16:9 widescreen image
      }),
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Hugging Face API error! status: ${response.status}, body: ${errorBody}`);
    }

    const imageBlob = await response.blob();
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    return `data:${imageBlob.type};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
};

// --- Story Generation Route ---
app.post('/api/generate-story', async (req, res) => {
  const { interests, character, decisions } = req.body;
  
  try {
    let prompt;
    if (decisions && decisions.length > 0) {
      const previousContext = decisions.map(d => `Story: ${d.story}\nMy Choice: ${d.decision.text}`).join('\n\n');
      prompt = `Continue this safe, age-appropriate adventure for a 10-14 year old with ${character.name} (${character.trait}) as their guide. The story is about ${interests.join(', ')}. 
Previous story:
${previousContext}
Continue the adventure in ${character.name}'s storytelling voice (${character.trait === 'Courage' ? 'brave and encouraging' : character.trait === 'Wisdom' ? 'thoughtful and protective' : character.trait === 'Creativity' ? 'inventive and curious' : 'calm and observant'}). 
End with a clear safety-related decision point with exactly 3 choices. Format as JSON with "story" and "choices" properties. Each choice needs "text", "safe" (boolean), and "points" (number: safe=+10, neutral=0, unsafe=-5).`;
    } else {
      prompt = `Create the beginning of a safe, age-appropriate adventure for a 10-14 year old with ${character.name} (${character.trait}) as their guide. The adventure is about ${interests.join(', ')}.
Write in ${character.name}'s voice (${character.trait === 'Courage' ? 'brave and encouraging' : character.trait === 'Wisdom' ? 'thoughtful and protective' : character.trait === 'Creativity' ? 'inventive and curious' : 'calm and observant'}).
The adventure should end with a clear safety-related decision point with exactly 3 choices. Format as JSON with "story" and "choices" properties. Each choice needs "text", "safe" (boolean), and "points" (number: safe=+10, neutral=0, unsafe=-5).`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const storyData = JSON.parse(completion.choices[0].message.content);
    
    // Generate image for the story
    const imageUrl = await generateStoryImage(character, storyData.story, interests);
    
    res.json({ ...storyData, imageUrl });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story. Please try again.' });
  }
});

// --- Chatbot Route ---
app.post('/api/chat', auth, async (req, res) => {
  const { messages } = req.body; // Expecting an array of messages { role: 'user' | 'assistant', content: '...' }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages are required and should be a non-empty array.' });
  }

  try {
    // The system message helps set the personality and instructions for the chatbot.
    const systemMessage = {
      role: 'system',
      content: "You are SafeQuest Bot, a friendly and helpful assistant for the SafeQuest application. You should be supportive, encouraging, and always keep your responses age-appropriate for 10-14 year olds. Do not give safety advice that should come from a parent or guardian, but you can talk about the safety themes in the stories in a general way. Keep your answers concise."
    };

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Using Groq's LLaMA model for chat responses
      messages: [systemMessage, ...messages],
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('Error calling Groq API for chat:', error);
    res.status(500).json({ error: 'Failed to get a response from the chatbot. Please try again.' });
  }
});
// --- Save Story Route ---
app.post('/api/stories', auth, async (req, res) => {
  try {
    const { initialInterests, fullStory, finalScore, isComplete, character } = req.body;
    const newStory = new Story({
      userId: req.user.id,
      initialInterests,
      character: { // Save character details with the story
        id: character.id,
        name: character.name,
        description: character.description,
        trait: character.trait,
      },
      // Keep the imageUrl only for the very last step of the story
      fullStory: fullStory.map((step, index) => {
        if (index < fullStory.length - 1) {
          const { imageUrl, ...rest } = step; // Destructure to remove imageUrl
          return rest;
        }
        return step; // Keep the last step as is
      }),
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

    // Only perform image stripping if a new scene has been added.
    // This prevents incorrectly removing the image when continuing a story.
    const stepsWithImages = fullStory.filter(step => step.imageUrl).length;
    if (stepsWithImages > 1) {
      story.fullStory = fullStory.map((step, index) => {
        if (index < fullStory.length - 1) {
          const { imageUrl, ...rest } = step; // Destructure to remove imageUrl
          return rest;
        }
        return step; // Keep the last step as is
      });
    } else {
      story.fullStory = fullStory;
    }
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

// --- Achievement Routes ---

// Get user stats and achievements
app.get('/api/achievements/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user stats after story completion
app.post('/api/achievements/update-stats', auth, async (req, res) => {
  try {
    const { safeChoices, totalChoices, isComplete } = req.body;
    const user = await User.findById(req.user.id);

    // Update stats
    if (isComplete) {
      user.stats.storiesCompleted += 1;
    }

    if (safeChoices === totalChoices) {
      user.stats.perfectStories += 1;
      user.stats.safeChoicesStreak += 1;
    } else {
      user.stats.safeChoicesStreak = 0;
    }

    // Check for new achievements
    const achievements = new Set(user.stats.achievements || []);

    // First story achievement
    if (user.stats.storiesCompleted === 1) {
      achievements.add('FIRST_STORY');
    }

    // Safety streak achievement
    if (user.stats.safeChoicesStreak >= 5) {
      achievements.add('SAFETY_STREAK');
    }

    // Perfect story achievement
    if (user.stats.perfectStories >= 1) {
      achievements.add('PERFECT_SCORE');
    }

    // Story master achievement
    if (user.stats.storiesCompleted >= 5) {
      achievements.add('STORY_MASTER');
    }

    user.stats.achievements = [...achievements];
    await user.save();

    res.json(user.stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
