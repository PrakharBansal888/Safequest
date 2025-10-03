import React, { useState, useEffect } from 'react';
import { Shield, Star, Home, ThumbsUp, MessageSquare, FilePenLine, ArrowLeft, User, ChevronDown, X, Send } from 'lucide-react'; // Make sure this is installed: npm install lucide-react
import Navigation from './components/Navigation';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import StoryView from './components/StoryView';
import AdventuresList from './components/AdventuresList';
import AuthForm from './components/AuthForm';
import InterestSelector from './components/InterestSelector';
import LoadingScreen from './components/LoadingScreen';

const SafeQuestApp = () => {
  // Stages: welcome, login, signup, dashboard, interests, loading, story, feedback, end, profile, blog, create-blog, view-blog
  const [stage, setStage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Story state
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [storyProgress, setStoryProgress] = useState([]);
  const [currentStory, setCurrentStory] = useState('');
  const [currentChoices, setCurrentChoices] = useState([]);
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
  const interests = [
    { id: 'space', name: 'Space Adventure', emoji: '🚀', color: 'from-purple-500 to-blue-500' },
    { id: 'animals', name: 'Animal Friends', emoji: '🐾', color: 'from-green-500 to-emerald-500' },
    { id: 'sports', name: 'Sports Hero', emoji: '⚽', color: 'from-orange-500 to-red-500' },
    { id: 'tech', name: 'Tech Wizard', emoji: '💻', color: 'from-cyan-500 to-blue-500' },
    { id: 'art', name: 'Creative Artist', emoji: '🎨', color: 'from-pink-500 to-purple-500' },
    { id: 'nature', name: 'Nature Explorer', emoji: '🌿', color: 'from-green-600 to-teal-500' },
  ];

  useEffect(() => {
    // Check if a token exists and try to validate it
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/user', {
            headers: { 'x-auth-token': token }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            fetchUserStories(token, false); // Fetch stories in the background
            fetchUserBlogPosts(token, false); // Fetch blogs for dashboard, but don't switch stage
            setStage('dashboard');
          } else {
            // Token is invalid, clear it
            handleLogout();
          }
        } catch (error) {
          console.error("Could not load user", error);
          handleLogout(); // Logout on error
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

  // API call to the backend to generate a story
  const generateStory = async (interests, decisions = []) => {
    setStage('loading');
    try {
      // This endpoint is now just for generation, not saving
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        // This can be a public endpoint if you want, or you can protect it
        // For now, let's not send a token here.
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ interests, decisions })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to generate story:", error);
      // Handle the error in the UI, maybe show an error message
      setStage('dashboard'); // Go back to dashboard
      alert('Sorry, we could not generate a story. Please try again.');
      return null;
    }
  };

  const handleAuth = async (authType) => {
    setError('');
    if (authType === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match");
      return; // Prevent API call if passwords don't match on the client-side
    }

    try {
      const response = await fetch(`/api/auth/${authType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Authentication failed');
      }
      const userToken = data.token;
      localStorage.setItem('token', data.token);
      setToken(userToken);
      setUser(data.user); // The useEffect will now trigger a data fetch
      setStage('dashboard');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setStage('welcome');
  };

  const fetchUserStories = async (userToken) => {
    if (!userToken) return;
    setStage('loading');
    try {
      const response = await fetch('/api/stories', { headers: { 'Content-Type': 'application/json', 'x-auth-token': userToken } });
      if (!response.ok) throw new Error('Could not fetch stories');
      const stories = await response.json();
      setUserStories(stories);
      setStage('dashboard');
    } catch (err) {
      console.error(err);
      alert('Could not load your stories.');
      setStage('dashboard');
    }
  };

  // Fetch user blog posts
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

  // Fetch ONLY the current user's blog posts
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
  // Create new blog post
  const createBlogPost = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }
    try {
      const response = await fetch('/api/blogposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
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

  // Update existing blog post
  const updateBlogPost = async () => {
    if (!selectedBlogPost) return;
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`/api/blogposts/${selectedBlogPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
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

  // Delete blog post
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

  // Like a blog post
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

  // Add a comment to a blog post
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

  // --- Chatbot Functions ---
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
  // Handlers for navigation
  const goToProfile = () => setStage('profile');
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
    setStage('interests');
  };

  const continueStory = (story) => {
    setCurrentStoryId(story._id);
    setStoryProgress(story.fullStory);
    setScore(story.finalScore);
    setSelectedInterests(story.initialInterests);
    
    const lastProgress = story.fullStory[story.fullStory.length - 1];
    setCurrentStory(lastProgress.story);
    setCurrentChoices(lastProgress.choices);
    setStage('story');
  };

  const saveStory = async (progress, finalScore, isComplete = false) => {
    const storyData = {
      initialInterests: selectedInterests,
      fullStory: progress,
      finalScore,
      isComplete,
    };

    try {
      let response;
      if (currentStoryId) {
        // Update existing story
        response = await fetch(`/api/stories/${currentStoryId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(storyData),
        });
      } else {
        // Create new story
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
      setCurrentStoryId(savedStory._id); // Set ID for subsequent saves
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
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest!');
      return;
    }
    const data = await generateStory(selectedInterests);
    if (data) {
      setCurrentStory(data.story);
      setCurrentChoices(data.choices);
      const newProgress = [{ story: data.story, choices: data.choices, decision: null }];
      setStoryProgress(newProgress);
      await saveStory(newProgress, 0); // Save the start of the new story
      setStage('story');
    }
  };

  const handleChoice = async (choice) => {
    const currentProgress = [...storyProgress];
    const lastProgress = currentProgress[currentProgress.length - 1];
    lastProgress.decision = choice;
    lastProgress.feedback = choice.safe ? "Great job! That was a safe choice!" : "Let's think about that choice...";

    const newScore = score + choice.points;
    setScore(newScore);
    setLastFeedback({ safe: choice.safe, text: lastProgress.feedback });
    setStage('feedback');
    
    // Save progress after making a choice
    await saveStory(currentProgress, newScore);
    
    // Wait for feedback, then generate the next part of the story
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const data = await generateStory(selectedInterests, currentProgress);
    if (data) {
      setCurrentStory(data.story);
      setCurrentChoices(data.choices);
      const newProgress = [...currentProgress, { story: data.story, choices: data.choices, decision: null }];
      setStoryProgress(newProgress);
      await saveStory(newProgress, newScore);
      setStage('story');
    } else {
      // Story might have ended or failed to generate
      await saveStory(currentProgress, newScore, true); // Mark as complete
      setStage('end');
    }
  };

  const goHome = () => {
    setStage('dashboard');
    // No need to fetch here, data is already loaded or will be by useEffect
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex">
        {token && (
          <Navigation stage={stage} setStage={setStage} handleLogout={handleLogout} goHome={goHome} goToProfile={goToProfile} goToBlog={goToBlog} />
        )}

        <main className={`flex-grow transition-all duration-300 ${token ? 'ml-20' : 'ml-0'}`}>
            {/* Header */}
          <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <button onClick={token ? goHome : () => setStage('welcome')} className="flex items-center gap-3 group">
                    <Shield className="w-8 h-8 text-primary group-hover:text-primary/90 transition-colors" />
                    <h1 className="text-2xl font-bold text-foreground group-hover:text-foreground/90 transition-colors">
                      SafeQuest
                    </h1>
                  </button>
                </div>
                {token && user && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-card text-accent px-3 py-1 rounded-lg shadow-md border border-border shadow-accent/50 shadow-lg">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="font-bold text-sm">{score} points</span>
                    </div>
                    <div className="relative">
                      <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border hover:border-primary">
                        <User className="w-5 h-5 text-foreground" />
                        <span className="font-semibold text-sm hidden md:inline">{user.email}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                          <a href="#" onClick={(e) => { e.preventDefault(); setStage('profile'); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-foreground hover:bg-accent">My Profile</a>
                          <a href="#" onClick={(e) => { e.preventDefault(); setStage('adventures'); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-foreground hover:bg-accent">My Adventures</a>
                          <a href="#" onClick={(e) => { e.preventDefault(); fetchMyBlogPosts(); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-foreground hover:bg-accent">My Blogs</a>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Logout</a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

            <div className="p-6 md:p-10">
        {/* Welcome Screen */}
        {stage === 'welcome' && <WelcomeScreen setStage={setStage} />}

        {/* Auth Screens */}
        {(stage === 'login' || stage === 'signup') && (
          <AuthForm
            type={stage}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleAuth={handleAuth}
            error={error}
            setStage={setStage}
          />
        )}

        {/* Dashboard */}
        {stage === 'dashboard' && user && (
          <Dashboard
            user={user}
            userStories={userStories}
            blogPosts={blogPosts}
            startNewStory={startNewStory}
            setStage={setStage}
            goToBlog={goToBlog}
            goToCreateBlog={goToCreateBlog}
          />
        )}

        {/* Adventures List */}
        {stage === 'adventures' && user && (
          <AdventuresList
            userStories={userStories}
            continueStory={continueStory}
            currentStoryId={currentStoryId}
          />
        )}

        {/* Interest Selection */}
        {stage === 'interests' && (
          <InterestSelector
            interests={interests}
            selectedInterests={selectedInterests}
            handleInterestToggle={handleInterestToggle}
            startStory={startStory}
          />
        )}
        {/* Loading Screen */}
        {stage === 'loading' && (
          <LoadingScreen />
        )}

        {/* Story Display */}
        {stage === 'story' && (
          <StoryView currentStory={currentStory} currentChoices={currentChoices} handleChoice={handleChoice} goHome={goHome} />
        )}

        {/* Feedback Screen */}
        {stage === 'feedback' && (
          <div className="max-w-2xl mx-auto text-center space-y-4 animate-fade-in">
            {lastFeedback && (
              <>
                <div className="inline-block p-6 bg-card rounded-full shadow-lg border border-border">
                  {lastFeedback.safe ? (
                    <div className="text-6xl">✅</div>
                  ) : (
                    <div className="text-6xl">💭</div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {lastFeedback.text}
                </h2>
                <p className="text-md text-muted-foreground">
                  Loading next part of your adventure...
                </p>
              </>
            )}
          </div>
        )}

        {/* End of Story Screen */}
        {stage === 'end' && (
          <div className="text-center space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="inline-block p-5 bg-card rounded-full shadow-lg border border-border">
                <div className="text-6xl">✅</div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">The End!</h2>
            <p className="text-lg text-muted-foreground">You've reached the end of this adventure. Your final score is {score}.</p>
            <button onClick={goHome} className="px-6 py-3 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transform transition-all duration-200" >
              <span className="flex items-center gap-2"><Home /> Back to Dashboard</span>
            </button>
          </div>
        )}

        {/* Profile Page */}
        {stage === 'profile' && user && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary">{user.email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-foreground">{user.email}</h2>
                  <div className="flex gap-6 mt-4 justify-center md:justify-start">
                    <div><span className="font-bold text-xl">{userStories.length}</span> <span className="text-muted-foreground">Adventures</span></div>
                    <div><span className="font-bold text-xl">{blogPosts.length}</span> <span className="text-muted-foreground">Blogs</span></div>
                    <div><span className="font-bold text-xl">{userStories.reduce((acc, story) => acc + (story.finalScore || 0), 0)}</span> <span className="text-muted-foreground">Total Score</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => setStage('dashboard')}
                className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Blog List Page */}
        {stage === 'blog' && (
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">Community Blogs</h2>
              <button
                onClick={goToCreateBlog}
                className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <FilePenLine className="w-4 h-4" />
                Create New Post
              </button>
            </div>
            {blogPosts.length > 0 ? (
              <div className="space-y-6">
                {blogPosts.map(post => (
                  <div key={post._id} className="bg-card rounded-lg shadow-lg p-6 border border-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                      <button onClick={() => goToViewBlog(post)} className="text-primary hover:underline text-sm font-semibold">View Blog</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground bg-card p-6 rounded-lg border border-border">No blog posts have been written yet. Be the first!</div>
            )}
          </div>
        )}

        {/* My Blogs Page */}
        {stage === 'my-blogs' && (
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">My Blogs</h2>
              <button onClick={goToCreateBlog} className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                <FilePenLine className="w-4 h-4" />
                Create New Post
              </button>
            </div>
            {myBlogPosts.length > 0 ? (
              <div className="space-y-6">
                {myBlogPosts.map(post => (
                  <div key={post._id} className="bg-card rounded-lg shadow-lg p-6 border border-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                      <button onClick={() => goToViewBlog(post)} className="text-primary hover:underline text-sm font-semibold">View Blog</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground bg-card p-6 rounded-lg border border-border">You haven't written any blogs yet.</div>
            )}
          </div>
        )}

        {/* Create Blog Post Page */}
        {stage === 'create-blog' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">{selectedBlogPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
                <textarea
                  placeholder="Post Content"
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
                <div className="flex gap-4">
                  <button
                    onClick={selectedBlogPost ? updateBlogPost : createBlogPost}
                    className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    {selectedBlogPost ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    onClick={() => setStage('blog')}
                    className="px-5 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md shadow-sm hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Blog Post Page */}
        {stage === 'view-blog' && selectedBlogPost && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <button
              onClick={() => setStage('blog')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
            <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border">
              <h2 className="text-4xl font-bold text-foreground mb-2">{selectedBlogPost.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Created: {new Date(selectedBlogPost.createdAt).toLocaleDateString()}
              </p>
              <div className="prose prose-lg max-w-none prose-invert">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{selectedBlogPost.content}</p>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border">
                <button onClick={() => likeBlogPost(selectedBlogPost._id)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-semibold">{selectedBlogPost.likes?.length || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{selectedBlogPost.comments?.length || 0}</span>
                </div>
              </div>
              {user && user._id === selectedBlogPost.userId && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStage('create-blog')}
                    className="px-5 py-2 bg-yellow-500/80 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 transition-colors"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={() => deleteBlogPost(selectedBlogPost._id)}
                    className="px-5 py-2 bg-destructive text-destructive-foreground font-semibold rounded-md shadow-sm hover:bg-destructive/90 transition-colors"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
            {/* Comments Section */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Comments</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md bg-input border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
                <button onClick={() => addCommentToBlogPost(selectedBlogPost._id)} className="px-4 py-1.5 text-sm bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                  Post Comment
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {selectedBlogPost.comments?.map((comment, index) => (
                  <div key={index} className="bg-accent p-3 rounded-lg border border-border">
                    <p className="text-sm text-foreground">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">- {comment.userEmail} on {new Date(comment.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
      </div>

      {/* Chatbot UI */}
      {token && (
        <>
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:bg-accent/90 transition-transform hover:scale-110 z-50"
              aria-label="Open Chat"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          )}

          {isChatOpen && (
            <div className="fixed bottom-6 right-6 w-80 h-[28rem] bg-card rounded-xl shadow-2xl border border-border flex flex-col z-50 animate-fade-in">
              <header className="flex items-center justify-between p-3 bg-background/50 border-b border-border">
                <h3 className="font-bold text-foreground">SafeQuest Bot</h3>
                <button onClick={() => setIsChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </header>
              <div className="flex-grow p-3 overflow-y-auto space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-input text-foreground'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-2 rounded-lg bg-input text-foreground">
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-grow bg-input px-3 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isChatLoading}
                />
                <button type="submit" className="bg-primary p-2 rounded-full text-primary-foreground disabled:bg-muted" disabled={isChatLoading || !chatInput.trim()}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SafeQuestApp;