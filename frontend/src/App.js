import React, { useEffect } from 'react';
import { Shield, Star, Home, ThumbsUp, MessageSquare, FilePenLine, ArrowLeft, User, ChevronDown, X, Send } from 'lucide-react';
import { useAppContext } from './AppContext';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import EnhancedStoryView from './components/EnhancedStoryView';
import AdventuresList from './components/AdventuresList';
import AuthForm from './components/AuthForm';
import InterestSelector from './components/InterestSelector';
import LoadingScreen from './components/LoadingScreen';
import CharacterSelector from './components/CharacterSelector';
import ProfilePage from './components/ProfilePage';

const SafeQuestApp = () => {
  const {
    stage, setStage, user, token, username, setUsername, email, setEmail, 
    emailOrUsername, setEmailOrUsername, password, setPassword,
    confirmPassword, setConfirmPassword, error, handleAuth, handleLogout,
    selectedInterests, handleInterestToggle, selectedCharacter, setSelectedCharacter,
    currentStory, currentChoices, handleChoice, goHome, currentImageUrl, isImageLoading,
    startStory, score, isProfileOpen, setIsProfileOpen, fetchMyBlogPosts,
    userStories, continueStory, currentStoryId,
    interests, characters,
    lastFeedback,
    userStats,
    blogPosts, myBlogPosts, selectedBlogPost, blogTitle, setBlogTitle, blogContent, setBlogContent,
    newComment, setNewComment, createBlogPost, updateBlogPost, deleteBlogPost, likeBlogPost, addCommentToBlogPost,
    isChatOpen, setIsChatOpen, chatMessages, chatInput, setChatInput, isChatLoading, handleSendMessage,
    startNewStory, goToBlog, goToCreateBlog, goToViewBlog, goToProfile
  } = useAppContext();

  // Effect to handle browser fullscreen mode for story immersion
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen request failed. User interaction might be required.", error);
      }
    };

    const exitFullscreen = async () => {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error("Exit fullscreen failed.", error);
      }
    };

    if (stage === 'story') {
      if (!document.fullscreenElement) {
        enterFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        exitFullscreen();
      }
    }
  }, [stage]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Immersive Full-Screen Story View */}
      {stage === 'story' && (
        <EnhancedStoryView 
          currentStory={currentStory} 
          currentChoices={currentChoices} 
          handleChoice={handleChoice} 
          goHome={goHome}
          character={selectedCharacter}
          storyImage={currentImageUrl}
          isImageLoading={isImageLoading}
        />
      )}
      {/* Standard App View */}
      {stage !== 'story' && <div className="flex">
        {token && ( // Navigation is only shown in standard view
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
                        <span className="font-semibold text-sm hidden md:inline">@{user.username}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                          <button onClick={() => { setStage('profile'); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent">My Profile</button>
                          <button onClick={() => { setStage('adventures'); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent">My Adventures</button>
                          <button onClick={() => { fetchMyBlogPosts(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent">My Blogs</button>
                          <button onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Logout</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

            <div className="p-6 md:p-10">
        {/* Welcome Screen - Padlock Loader */}
        {stage === 'welcome' && <LoadingScreen onComplete={() => setStage('login')} />}

        {/* Auth Screens */}
        {(stage === 'login' || stage === 'signup') && (
          <div className="fixed inset-0 z-50">
            <AuthForm
              type={stage}
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              emailOrUsername={emailOrUsername}
              setEmailOrUsername={setEmailOrUsername}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleAuth={handleAuth}
              error={error}
              setStage={setStage}
            />
          </div>
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
            proceedToCharacterSelection={() => setStage('characterSelection')}
          />
        )}

        {/* Character Selection */}
        {stage === 'characterSelection' && (
          <CharacterSelector
            characters={characters}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            onContinue={startStory}
          />
        )}
        {/* Loading Screen */}
        {stage === 'loading' && (
          <LoadingScreen />
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
          <ProfilePage
            user={user}
            userStories={userStories}
            blogPosts={blogPosts}
            userStats={userStats}
            setStage={setStage}
          />
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
      </div>}

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
                <button 
                  type="submit" 
                  className="bg-primary p-2 rounded-full text-primary-foreground disabled:bg-muted" 
                  disabled={isChatLoading || !chatInput.trim()}
                >
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