import React from 'react';

const AnimatedTransition = ({ children, isVisible }) => {
  return (
    <div
      className={`
        transition-all duration-500 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-full'
        }
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;