import React from 'react';
import { motion } from 'framer-motion'; // Add this import

const CharacterSelector = ({ selectedCharacter, setSelectedCharacter, onContinue, characters }) => {

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-foreground">Choose Your Guide!</h2>
        <p className="text-lg text-muted-foreground">
          Pick a character who will join you on your adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((character) => {
          const Icon = character.icon;
          const isSelected = selectedCharacter?.id === character.id;
          
          return (
            <motion.button
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className={`relative bg-card rounded-2xl p-6 transition-all duration-300
                ${isSelected ? 'shadow-xl' : 'shadow-md'}`}
            >
              {/* Glowing Border Container */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300
                ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                ${character.color} blur-md -z-10`}
              />

              {/* Character Avatar Container */}
              <motion.div 
                className={`relative w-32 h-32 mx-auto mb-4 rounded-full 
                  overflow-hidden transition-transform duration-300
                  bg-gradient-to-br ${character.color}`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <img 
                  src={character.avatar} 
                  alt={character.name} 
                  className="w-full h-full object-cover transform transition-transform hover:scale-110" 
                />
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full opacity-0 hover:opacity-100
                  transition-opacity duration-300 bg-gradient-to-br ${character.color} blur-md -z-10`}
                />
              </motion.div>

              {/* Character Info */}
              <div className="space-y-3 text-center relative z-10">
                <h3 className="text-2xl font-bold text-foreground">{character.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {character.description}
                </p>
                
                {/* Trait Badge */}
                <motion.div 
                  className={`inline-flex items-center gap-2 px-4 py-2 
                    bg-gradient-to-r ${character.color} rounded-full 
                    text-white text-sm font-semibold shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="w-4 h-4" />
                  {character.trait}
                </motion.div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedCharacter && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4"
        >
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-primary text-primary-foreground text-lg 
              font-bold rounded-full shadow-lg hover:bg-primary/90 
              hover:scale-105 transform transition-all duration-200"
          >
            Start Adventure with {selectedCharacter.name}! 🚀
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CharacterSelector;