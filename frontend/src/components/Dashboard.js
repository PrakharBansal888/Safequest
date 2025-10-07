import React from 'react';
import { Sparkles, BookCopy, FilePenLine, ArrowRight } from 'lucide-react';

const Dashboard = ({ user, startNewStory, setStage, goToBlog, goToCreateBlog }) => {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, <span className="text-primary">@{user.username}</span>!</h1>
        <p className="text-lg text-muted-foreground">Ready for your next adventure?</p>
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