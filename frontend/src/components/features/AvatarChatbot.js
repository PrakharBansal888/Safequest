import React from 'react';

const AvatarChatbot = ({ role, message }) => {
  const getAvatar = () => {
    if (role === 'assistant') {
      return (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span role="img" aria-label="SafeQuest Bot" className="text-lg">🦸‍♂️</span>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
        <span role="img" aria-label="You" className="text-lg">👤</span>
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      {getAvatar()}
      <div className={`
        max-w-[80%] p-3 rounded-lg text-sm
        ${role === 'user' 
          ? 'bg-secondary text-secondary-foreground' 
          : 'bg-primary/10 text-primary-foreground'
        }
      `}>
        {message}
      </div>
    </div>
  );
};

export default AvatarChatbot;