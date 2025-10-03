import React, { useEffect, useState } from 'react';
import { Sparkles, BookCopy, FilePenLine, ArrowRight, Trophy, Award, Target, Star } from 'lucide-react';

const ACHIEVEMENT_ICONS = {
  FIRST_STORY: <Star className="w-6 h-6 text-yellow-500" />,
  SAFETY_STREAK: <Target className="w-6 h-6 text-blue-500" />,
  PERFECT_SCORE: <Trophy className="w-6 h-6 text-purple-500" />,
  STORY_MASTER: <Award className="w-6 h-6 text-green-500" />
};

const ACHIEVEMENT_DETAILS = {
  FIRST_STORY: { title: 'First Story', description: 'Completed your first story!' },
  SAFETY_STREAK: { title: 'Safety Streak', description: 'Made 5 safe choices in a row!' },
  PERFECT_SCORE: { title: 'Perfect Score', description: 'Completed a story with all safe choices!' },
  STORY_MASTER: { title: 'Story Master', description: 'Completed 5 stories!' }
};

const Dashboard = ({ user, startNewStory, setStage, goToBlog, goToCreateBlog }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/achievements/stats', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, <span className="text-primary">{user.email}</span>!</h1>
        <p className="text-lg text-muted-foreground">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={startNewStory} className="bg-card p-6 rounded-lg shadow-lg border border-border hover:border-primary transition-all group text-left">
          <Sparkles className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-xl font-bold">Start New Adventure</h3>
          <p className="text-muted-foreground mt-1">Begin a fresh journey.</p>
        </button>
        <button onClick={() => setStage('adventures')} className="bg-card p-6 rounded-lg shadow-lg border border-border hover:border-primary transition-all group text-left">
          <BookCopy className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-xl font-bold">Continue an Adventure</h3>
          <p className="text-muted-foreground mt-1">Pick up where you left off.</p>
        </button>
        <button onClick={goToCreateBlog} className="bg-card p-6 rounded-lg shadow-lg border border-border hover:border-primary transition-all group text-left">
          <FilePenLine className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-xl font-bold">Share an Experience</h3>
          <p className="text-muted-foreground mt-1">Got an experience to share? Write your own blog.</p>
        </button>
      </div>

      {stats && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.storiesCompleted}</div>
                <div className="text-sm text-muted-foreground">Stories Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.perfectStories}</div>
                <div className="text-sm text-muted-foreground">Perfect Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.safeChoicesStreak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.achievements?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>

          {stats.achievements?.length > 0 && (
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.achievements.map((achievement) => (
                  <div key={achievement} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    {ACHIEVEMENT_ICONS[achievement]}
                    <div>
                      <div className="font-semibold">{ACHIEVEMENT_DETAILS[achievement].title}</div>
                      <div className="text-sm text-muted-foreground">{ACHIEVEMENT_DETAILS[achievement].description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-center">
        <button onClick={goToBlog} className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
          <span>View Blogs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;