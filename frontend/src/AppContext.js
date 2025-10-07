import React, { createContext, useState, useEffect, useContext } from 'react';
import { Shield, Sparkles, Lightbulb, Leaf } from 'lucide-react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Stages: welcome, login, signup, dashboard, interests, characterSelection, loading, story, feedback, end, profile, blog, create-blog, view-blog
  const [stage, setStage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Story state
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [currentStory, setCurrentStory] = useState('');
  const [currentChoices, setCurrentChoices] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [score, setScore] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);

  // Blog state
  const [myBlogPosts, setMyBlogPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [newComment, setNewComment] = useState('');

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // UI State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const interests = [
    { 
      id: 'space', 
      name: 'Space Adventure', 
      emoji: '🚀', 
      color: 'from-purple-500 to-blue-500',
      description: 'Explore the cosmos with rockets, planets, and stellar adventures',
      videoUrl: '/assets/videos/space-adventure.mp4',
      fallbackImage: '/assets/images/space-fallback.jpg'
    },
    { 
      id: 'animals', 
      name: 'Animal Friends', 
      emoji: '🐾', 
      color: 'from-green-500 to-emerald-500',
      description: 'Meet friendly animals in peaceful meadows and forests',
      videoUrl: '/assets/videos/animal-friends.mp4',
      fallbackImage: '/assets/images/animals-fallback.jpg'
    },
    { 
      id: 'sports', 
      name: 'Sports Hero', 
      emoji: '⚽', 
      color: 'from-orange-500 to-red-500',
      description: 'Experience the thrill of sports and teamwork',
      videoUrl: '/assets/videos/sports-hero.mp4',
      fallbackImage: '/assets/images/sports-fallback.jpg'
    },
    { 
      id: 'tech', 
      name: 'Tech Wizard', 
      emoji: '💻', 
      color: 'from-cyan-500 to-blue-500',
      description: 'Dive into the digital world of coding and innovation',
      videoUrl: '/assets/videos/tech-wizard.mp4',
      fallbackImage: '/assets/images/tech-fallback.jpg'
    },
    { 
      id: 'art', 
      name: 'Creative Artist', 
      emoji: '🎨', 
      color: 'from-pink-500 to-purple-500',
      description: 'Unleash creativity with colors, brushes, and imagination',
      videoUrl: '/assets/videos/creative-artist.mp4',
      fallbackImage: '/assets/images/art-fallback.jpg'
    },
    { 
      id: 'nature', 
      name: 'Nature Explorer', 
      emoji: '🌿', 
      color: 'from-green-600 to-teal-500',
      description: 'Discover the wonders of forests, wildlife, and natural beauty',
      videoUrl: '/assets/videos/nature-explorer.mp4',
      fallbackImage: '/assets/images/nature-fallback.jpg'
    },
  ];

  const characters = [
    { id: 'luna', name: 'Luna the Explorer', description: 'Brave and curious, always ready for adventure!', trait: 'Courage', avatar: '/mages/luna.png', icon: Sparkles, emoji: '🌟', color: 'from-purple-500 to-pink-500' },
    { id: 'max', name: 'Max the Guardian', description: 'Wise and protective, thinks before acting!', trait: 'Wisdom', avatar: '/mages/max.png', icon: Shield, emoji: '🛡️', color: 'from-blue-500 to-cyan-500' },
    { id: 'zara', name: 'Zara the Inventor', description: 'Creative problem-solver with amazing ideas!', trait: 'Creativity', avatar: '/mages/zara.png', icon: Lightbulb, emoji: '💡', color: 'from-orange-500 to-yellow-500' },
    { id: 'rio', name: 'Rio the Nature Guide', description: 'Calm and observant, connected to nature!', trait: 'Harmony', avatar: '/mages/rio.png', icon: Leaf, emoji: '🌿', color: 'from-green-500 to-emerald-500' },
  ];

  // Achievement and stats state
  const [userStats, setUserStats] = useState({
    storiesCompleted: 0,
    safeChoicesStreak: 0,
    perfectStories: 0,
    achievements: []
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setUsername('');
    setEmail('');
    setEmailOrUsername('');
    setPassword('');
    setConfirmPassword('');
    setStage('welcome');
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/user', {
            headers: { 'x-auth-token': token }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            fetchUserStories(token, false);
            fetchUserStats(token);
            fetchUserBlogPosts(token, false);
            setStage('dashboard');
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Could not load user", error);
          handleLogout();
        }
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'x-auth-token': token,
  });

  const generateStory = async (interests, decisions = []) => {
    setIsImageLoading(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, character: selectedCharacter, decisions })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to generate story:", error);
      setStage('dashboard');
      alert('Sorry, we could not generate a story. Please try again.');
      return null;
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleAuth = async (authType) => {
    setError('');
    if (authType === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const requestBody = authType === 'signup' 
        ? { username, email, password, confirmPassword }
        : { emailOrUsername, password };

      const response = await fetch(`/api/auth/${authType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Authentication failed');
      }
      const userToken = data.token;
      localStorage.setItem('token', data.token);
      setToken(userToken);
      setUser(data.user);
      fetchUserStats(userToken);
      setStage('dashboard');
      setUsername('');
      setEmail('');
      setEmailOrUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserStats = async (userToken) => {
    if (!userToken) return;
    try {
      const response = await fetch('/api/achievements/stats', {
        headers: { 'x-auth-token': userToken },
      });
      if (!response.ok) throw new Error('Could not fetch stats');
      const stats = await response.json();
      setUserStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserStories = async (userToken, shouldChangeStage = true) => {
    if (!userToken) return;
    if (shouldChangeStage) setStage('loading');
    try {
      const response = await fetch('/api/stories', { headers: { 'Content-Type': 'application/json', 'x-auth-token': userToken } });
      if (!response.ok) throw new Error('Could not fetch stories');
      let stories = await response.json();
      // Enrich stories with full character data on the frontend
      stories = stories.map(story => {
        const fullCharacter = characters.find(c => c.id === story.character?.id);
        return { ...story, character: fullCharacter || story.character };
      });
      setUserStories(stories);
      if (shouldChangeStage) setStage('dashboard');
    } catch (err) {
      console.error(err);
      alert('Could not load your stories.');
      if (shouldChangeStage) setStage('dashboard');
    }
  };

  const fetchUserBlogPosts = async (userToken, shouldChangeStage = true) => {
    if (!userToken) return;
    if (shouldChangeStage) setStage('loading');
    try {
      const response = await fetch('/api/blogposts', { headers: { 'Content-Type': 'application/json', 'x-auth-token': userToken } });
      if (!response.ok) throw new Error('Could not fetch blog posts');
      const posts = await response.json();
      setBlogPosts(posts);
      if (shouldChangeStage) setStage('blog');
    } catch (err) {
      console.error(err);
      alert('Could not load your blog posts.');
      if (shouldChangeStage) setStage('dashboard');
    }
  };

  const fetchMyBlogPosts = async () => {
    if (!token) return;
    setStage('loading');
    try {
      const response = await fetch('/api/blogposts/me', { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Could not fetch your blog posts');
      const posts = await response.json();
      setMyBlogPosts(posts);
      setStage('my-blogs');
    } catch (err) {
      console.error(err);
      alert('Could not load your blog posts.');
      setStage('dashboard');
    }
  };

  const createBlogPost = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }
    try {
      const response = await fetch('/api/blogposts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: blogTitle, content: blogContent }),
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      const newPost = await response.json();
      setBlogPosts([newPost, ...blogPosts]);
      setBlogTitle('');
      setBlogContent('');
      setStage('blog');
    } catch (err) {
      console.error(err);
      alert('Failed to create blog post.');
    }
  };

  const updateBlogPost = async () => {
    if (!selectedBlogPost) return;
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`/api/blogposts/${selectedBlogPost._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: blogTitle, content: blogContent }),
      });
      if (!response.ok) throw new Error('Failed to update blog post');
      const updatedPost = await response.json();
      setBlogPosts(blogPosts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
      setSelectedBlogPost(null);
      setBlogTitle('');
      setBlogContent('');
      setStage('blog');
    } catch (err) {
      console.error(err);
      alert('Failed to update blog post.');
    }
  };

  const deleteBlogPost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const response = await fetch(`/api/blogposts/${postId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
      setBlogPosts(blogPosts.filter(post => post._id !== postId));
      setStage('blog');
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog post.');
    }
  };

  const likeBlogPost = async (postId) => {
    try {
      const response = await fetch(`/api/blogposts/${postId}/like`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      setBlogPosts(blogPosts.map(p => p._id === postId ? updatedPost : p));
      if (selectedBlogPost?._id === postId) {
        setSelectedBlogPost(updatedPost);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to like the post.');
    }
  };

  const addCommentToBlogPost = async (postId) => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`/api/blogposts/${postId}/comment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newComment }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const updatedPost = await response.json();
      setBlogPosts(blogPosts.map(p => p._id === postId ? updatedPost : p));
      setSelectedBlogPost(updatedPost);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to add the comment.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newUserMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newUserMessage];

    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot.');
      }

      const assistantMessage = await response.json();
      setChatMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const goToProfile = () => {
    fetchUserStats(token);
    setStage('profile');
  };

  const goToBlog = () => fetchUserBlogPosts(token);

  const goToCreateBlog = () => {
    setBlogTitle('');
    setBlogContent('');
    setSelectedBlogPost(null);
    setStage('create-blog');
  };

  const goToViewBlog = (post) => {
    setSelectedBlogPost(post);
    setBlogTitle(post.title);
    setBlogContent(post.content);
    setStage('view-blog');
  };

  const startNewStory = () => {
    setCurrentStoryId(null);
    setStoryProgress([]);
    setScore(0);
    setSelectedInterests([]);
    setSelectedCharacter(null);
    setStage('interests');
  };

  const continueStory = (story) => {
    setCurrentStoryId(story._id);
    setStoryProgress(story.fullStory);
    setScore(story.finalScore);
    setSelectedInterests(story.initialInterests);
    
    // Find the full character object from the main list to ensure all properties (like avatar) are present.
    const fullCharacter = story.character && story.character.id 
      ? characters.find(c => c.id === story.character.id)
      : null;
    setSelectedCharacter(fullCharacter || story.character || characters[0]); // Default to first character if none found

    const lastProgress = story.fullStory[story.fullStory.length - 1];
    setCurrentStory(lastProgress.story);
    setCurrentChoices(lastProgress.choices);
    setCurrentImageUrl(lastProgress.imageUrl || '');
    setStage('story');
  };

  const saveStory = async (progress, finalScore, isComplete = false) => {
    const characterToSave = selectedCharacter ? {
      id: selectedCharacter.id,
      name: selectedCharacter.name,
      description: selectedCharacter.description,
      trait: selectedCharacter.trait,
      avatar: selectedCharacter.avatar,
    } : null;
    const storyData = {
      initialInterests: selectedInterests,
      character: characterToSave,
      fullStory: progress,
      finalScore,
      isComplete,
    };

    try {
      let response;
      if (currentStoryId) {
        response = await fetch(`/api/stories/${currentStoryId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(storyData),
        });
      } else {
        response = await fetch('/api/stories', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(storyData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save story');
      }

      const savedStory = await response.json();
      setCurrentStoryId(savedStory._id);
      return savedStory;
    } catch (err) {
      console.error('Error saving story:', err);
      alert('There was an issue saving your progress.');
      return null;
    }
  };

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const startStory = async () => {
    if (!selectedCharacter) {
      alert('Please select a character!');
      return;
    }
    setStage('loading');
    const data = await generateStory(selectedInterests);

    if (data) {
      setCurrentStory(data.story);
      setCurrentChoices(data.choices);
      setCurrentImageUrl(data.imageUrl || '');
      const newProgress = [{ story: data.story, imageUrl: data.imageUrl || '', choices: data.choices, decision: null }];
      setStoryProgress(newProgress);
      await saveStory(newProgress, 0);
      setStage('story');
    }
  };

  const handleChoice = async (choice) => {
    const currentProgress = JSON.parse(JSON.stringify(storyProgress));

    const lastProgress = currentProgress[currentProgress.length - 1];
    lastProgress.decision = choice;
    lastProgress.feedback = choice.safe ? "Great job! That was a safe choice!" : "Let's think about that choice...";

    const newScore = score + choice.points;
    setScore(newScore);
    setLastFeedback({ safe: choice.safe, text: lastProgress.feedback });
    
    if (currentProgress.length === 5) {
      const safeChoices = currentProgress.filter(p => p.decision?.safe).length;
      try {
        const response = await fetch('/api/achievements/update-stats', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            safeChoices,
            totalChoices: currentProgress.length,
            isComplete: true
          })
        });
        if (response.ok) {
          const updatedStats = await response.json();
          setUserStats(updatedStats);
        }
      } catch (error) {
        console.error('Error updating achievements:', error);
      }
    }

    setStage('feedback');
    await saveStory(currentProgress, newScore);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const recentProgress = currentProgress.slice(-3);
    const data = await generateStory(selectedInterests, recentProgress);
    if (data) {
      setCurrentStory(data.story);
      setCurrentChoices(data.choices);
      setCurrentImageUrl(data.imageUrl || '');
      const newProgress = [...currentProgress, { story: data.story, imageUrl: data.imageUrl || '', choices: data.choices, decision: null }];
      setStoryProgress(newProgress);
      await saveStory(newProgress, newScore);
      setStage('story');
    } else {
      await saveStory(currentProgress, newScore, true);
      setStage('end');
    }
  };

  const goHome = () => {
    setStage('dashboard');
  };

  const value = {
    stage, setStage,
    user, setUser,
    token, setToken,
    username, setUsername,
    email, setEmail,
    emailOrUsername, setEmailOrUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error, setError,
    selectedInterests, setSelectedInterests,
    selectedCharacter, setSelectedCharacter,
    storyProgress, setStoryProgress,
    currentStory, setCurrentStory,
    currentChoices, setCurrentChoices,
    currentImageUrl, setCurrentImageUrl,
    score, setScore,
    currentStoryId, setCurrentStoryId,
    userStories, setUserStories,
    lastFeedback, setLastFeedback,
    myBlogPosts, setMyBlogPosts,
    blogPosts, setBlogPosts,
    selectedBlogPost, setSelectedBlogPost,
    blogTitle, setBlogTitle,
    blogContent, setBlogContent,
    newComment, setNewComment,
    isChatOpen, setIsChatOpen,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    isChatLoading, setIsChatLoading,
    isProfileOpen, setIsProfileOpen,
    isImageLoading, setIsImageLoading,
    interests,
    characters,
    userStats, setUserStats,
    handleAuth,
    handleLogout,
    fetchUserStories,
    fetchUserBlogPosts,
    fetchMyBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    likeBlogPost,
    addCommentToBlogPost,
    handleSendMessage,
    goToProfile,
    goToBlog,
    goToCreateBlog,
    goToViewBlog,
    startNewStory,
    continueStory,
    saveStory,
    handleInterestToggle,
    startStory,
    handleChoice,
    goHome,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};