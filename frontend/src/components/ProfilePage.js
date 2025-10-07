import React from 'react';
import { Award, Star, Target, Trophy } from 'lucide-react';

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

const ProfilePage = ({ user, userStories, blogPosts, userStats, setStage }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center">
            <span className="text-5xl font-bold text-primary">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-foreground">@{user.username}</h2>
            <p className="text-muted-foreground text-lg mt-1">{user.email}</p>
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div><span className="font-bold text-xl">{userStories.length}</span> <span className="text-muted-foreground">Adventures</span></div>
              <div><span className="font-bold text-xl">{blogPosts.length}</span> <span className="text-muted-foreground">Blogs</span></div>
              <div><span className="font-bold text-xl">{userStories.reduce((acc, story) => acc + (story.finalScore || 0), 0)}</span> <span className="text-muted-foreground">Total Score</span></div>
            </div>
          </div>
        </div>
      </div>

      {userStats && (
        <div className="mt-8 space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userStats.storiesCompleted}</div>
                <div className="text-sm text-muted-foreground">Stories Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userStats.perfectStories}</div>
                <div className="text-sm text-muted-foreground">Perfect Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userStats.safeChoicesStreak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userStats.achievements?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>

          {userStats.achievements?.length > 0 && (
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userStats.achievements.map((achievement) => (
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
    </div>
  );
};

export default ProfilePage;