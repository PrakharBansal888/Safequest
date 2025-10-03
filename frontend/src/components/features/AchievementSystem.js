import React from 'react';
import { Trophy, Star, Target, Shield } from 'lucide-react';

const achievements = {
  FIRST_STORY: {
    id: 'FIRST_STORY',
    title: 'Story Pioneer',
    description: 'Completed your first safety story',
    icon: Trophy,
  },
  SAFETY_STREAK: {
    id: 'SAFETY_STREAK',
    title: 'Safety Champion',
    description: 'Made 5 safe choices in a row',
    icon: Star,
  },
  PERFECT_SCORE: {
    id: 'PERFECT_SCORE',
    title: 'Perfect Guardian',
    description: 'Completed a story with all safe choices',
    icon: Shield,
  },
  STORY_MASTER: {
    id: 'STORY_MASTER',
    title: 'Story Master',
    description: 'Completed 5 different stories',
    icon: Target,
  },
};

const AchievementSystem = ({ userAchievements = [] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Your Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(achievements).map((achievement) => {
          const Icon = achievement.icon;
          const isUnlocked = userAchievements.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`
                p-4 rounded-lg border ${
                  isUnlocked
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card/50 border-border opacity-50'
                }
              `}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Icon className={`w-8 h-8 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                <h4 className="font-bold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const checkAchievements = (userStats) => {
  const newAchievements = [];

  if (userStats.storiesCompleted >= 1) {
    newAchievements.push('FIRST_STORY');
  }

  if (userStats.safeChoicesStreak >= 5) {
    newAchievements.push('SAFETY_STREAK');
  }

  if (userStats.perfectStories >= 1) {
    newAchievements.push('PERFECT_SCORE');
  }

  if (userStats.storiesCompleted >= 5) {
    newAchievements.push('STORY_MASTER');
  }

  return newAchievements;
};

export default AchievementSystem;