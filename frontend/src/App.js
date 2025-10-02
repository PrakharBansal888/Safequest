import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, Star, Sparkles, Home, Pause } from 'lucide-react'; // Make sure this is installed: npm install lucide-react
import Navigation from './Navigation';

const SafeQuestApp = () => {
  // Stages: welcome, login, signup, dashboard, interests, loading, story, feedback, end
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
            fetchUserStories(token);
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
      setUser(data.user);
      fetchUserStories(userToken);
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

  const renderAuthForm = (type) => (
    <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
      <h2 className="text-4xl font-bold text-gray-800">{type === 'login' ? 'Log In' : 'Sign Up'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAuth(type); }} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
          required
        />
        {type === 'signup' && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
            required
          />
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all">
          {type === 'login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <button onClick={() => setStage(type === 'login' ? 'signup' : 'login')} className="text-indigo-600 hover:underline">
        {type === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
      </button>
    </div>
  );

  const goHome = () => {
    setStage('dashboard');
    fetchUserStories(token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-400">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={token ? goHome : () => setStage('welcome')} className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-indigo-600" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SafeQuest
            </h1>
          </div>
          {token && !['welcome', 'login', 'signup'].includes(stage) && (
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">{score} points</span>
            </div>
          )}
          {token && !['welcome', 'login', 'signup', 'dashboard'].includes(stage) && (
            <Navigation stage={stage} setStage={setStage} handleLogout={handleLogout} goHome={goHome} />
          )}
          {token && ['dashboard'].includes(stage) && (
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-colors">
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Screen */}
        {stage === 'welcome' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block p-6 bg-white rounded-full shadow-2xl">
              <BookOpen className="w-24 h-24 text-indigo-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-800">
              Welcome to SafeQuest!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Embark on interactive adventures where YOUR choices matter. 
              Learn to stay safe while having fun in exciting stories tailored just for you!
            </p>
            <button
              onClick={() => setStage('login')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Login Screen */}
        {stage === 'login' && renderAuthForm('login')}

        {/* Signup Screen */}
        {stage === 'signup' && renderAuthForm('signup')}

        {/* Dashboard */}
        {stage === 'dashboard' && (
          <div className="animate-fade-in space-y-10">
            <div className="text-center">
              {user && (
                <p className="text-2xl text-gray-700 mb-4">
                  Welcome back, <span className="font-bold text-indigo-600">{user.email}</span>!
                </p>
              )}
              <h2 className="text-4xl font-bold text-gray-800">Your Adventures</h2>
              <p className="text-lg text-gray-600 mt-2">Start a new quest or continue a previous one.</p>
            </div>
            <div className="text-center">
              <button
                onClick={startNewStory}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Start a New Story
                </span>
              </button>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-700">Continue a Story:</h3>
              {userStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userStories.filter(s => !s.isComplete).map(story => (
                    <button
                      key={story._id}
                      onClick={() => continueStory(story)}
                      className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-200 text-left border-2 border-transparent hover:border-indigo-400"
                    >
                      <h4 className="text-xl font-bold text-gray-800">{story.initialInterests.join(', ')} Adventure</h4>
                      <p className="text-gray-600 mt-2">
                        Score: {story.finalScore} | Progress: {story.fullStory.length} step(s)
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Last played: {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 bg-white p-6 rounded-xl shadow-md">You have no stories in progress. Start a new one!</p>
              )}
            </div>
          </div>
        )}

        {/* Interest Selection */}
        {stage === 'interests' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800">
                What interests you?
              </h2>
              <p className="text-lg text-gray-600">
                Pick one or more topics you'd love to explore (choose at least one)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`p-8 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 ${
                    selectedInterests.includes(interest.id)
                      ? `bg-gradient-to-br ${interest.color} text-white ring-4 ring-white`
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="text-6xl mb-4">{interest.emoji}</div>
                  <h3 className="text-2xl font-bold">{interest.name}</h3>
                </button>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={startStory}
                disabled={selectedInterests.length === 0}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Generate My Story
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {stage === 'loading' && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block p-6 bg-white rounded-full shadow-2xl">
              <Sparkles className="w-20 h-20 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Crafting your adventure...
            </h2>
            <p className="text-lg text-gray-600">
              Our storytellers are hard at work!
            </p>
          </div>
        )}

        {/* Story Display */}
        {stage === 'story' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-indigo-500">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl leading-relaxed text-gray-800">
                  {currentStory}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                What do you do?
              </h3>
              {currentChoices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-200 text-left border-2 border-transparent hover:border-indigo-400"
                >
                  <span className="text-lg font-semibold text-gray-800">
                    {choice.text}
                  </span>
                </button>
              ))}
               <div className="text-center mt-8">
                <button 
                  onClick={goHome}
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-full shadow-lg hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Pause className="w-5 h-5" /> Let's take a break
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Screen */}
        {stage === 'feedback' && (
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            {lastFeedback && (
              <>
                <div className="inline-block p-8 bg-white rounded-full shadow-2xl">
                  {lastFeedback.safe ? (
                    <div className="text-8xl">✅</div>
                  ) : (
                    <div className="text-8xl">💭</div>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {lastFeedback.text}
                </h2>
                <p className="text-lg text-gray-600">
                  Loading next part of your adventure...
                </p>
              </>
            )}
          </div>
        )}

        {/* End of Story Screen */}
        {stage === 'end' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block p-6 bg-white rounded-full shadow-2xl">
                <div className="text-8xl">✅</div>
            </div>
            <h2 className="text-4xl font-bold text-gray-800">The End!</h2>
            <p className="text-xl text-gray-600">You've reached the end of this adventure. Your final score is {score}.</p>
            <button onClick={goHome} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-200" >
              <span className="flex items-center gap-2"><Home /> Back to Dashboard</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SafeQuestApp;