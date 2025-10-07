import React from 'react';

const AdventuresList = ({ userStories, continueStory, currentStoryId }) => {
  const inProgressAdventures = userStories.filter(s => !s.isComplete);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-foreground mb-6">Your Adventures</h2>
      {inProgressAdventures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgressAdventures.map(story => (
            <button
              key={story._id}
              onClick={() => continueStory(story)}
              className={`p-6 bg-card text-foreground rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-left h-40 flex flex-col justify-between border border-border hover:border-secondary ${currentStoryId === story._id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
            >
              <div>
                <h4 className="text-lg font-bold">{story.initialInterests.join(', ')} Adventure</h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Progress: {story.fullStory.length} step(s)
                </p>
              </div>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Last played: {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground bg-card p-8 rounded-lg border border-border">You have no adventures in progress. Start a new one from the Home screen!</div>
      )}
    </div>
  );
};

export default AdventuresList;