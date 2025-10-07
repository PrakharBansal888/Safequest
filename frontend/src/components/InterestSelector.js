import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Animated Interest Components
const SpaceAdventureAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      {/* Nebula effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparento-transparent animate-pulse-glow"></div>
      <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-gradient-radial from-pink-500/10 via-transparent to-transparent rounded-full animate-float"></div>
      
      {/* Enhanced animated stars field */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars */}
      <div className="absolute top-20 left-10 w-20 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star"></div>
      <div className="absolute top-40 right-20 w-16 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-shooting-star-delayed"></div>
      
      {/* Enhanced rocket with exhaust trail */}
      <div className="absolute bottom-16 left-8 animate-rocket-launch">
        <div className="relative">
          <div className="w-10 h-16 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-t-full relative shadow-2xl">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full animate-pulse-bright blur-sm"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full animate-pulse-bright opacity-70 blur-sm"></div>
            <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse-bright opacity-50 blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced planets with rings and moons */}
      <div className="absolute top-16 right-16 animate-orbit-slow">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl animate-spin-slow">
            <div className="absolute inset-2 bg-gradient-to-br from-green-300 to-blue-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-300 rounded-full shadow-lg animate-moon-orbit"></div>
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 animate-float-delayed">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-xl animate-pulse">
            <div className="absolute inset-1 bg-gradient-to-br from-orange-300 to-red-400 rounded-full opacity-80"></div>
          </div>
          {/* Saturn-like ring */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent rounded-full opacity-40 animate-ring-rotate"></div>
        </div>
      </div>
      
      {/* Space station */}
      <div className="absolute top-1/3 left-1/4 animate-float-slow">
        <div className="w-8 h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full relative">
          <div className="absolute -top-1 left-1 w-2 h-4 bg-blue-400 rounded-sm"></div>
          <div className="absolute -top-1 right-1 w-2 h-4 bg-red-400 rounded-sm"></div>
        </div>
      </div>
    </div>
  </div>
);

const AnimalFriendsAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 via-green-200 to-green-400">
      {/* Enhanced sky with clouds */}
      <div className="absolute top-8 left-16 w-20 h-12 bg-white/60 rounded-full animate-float blur-sm"></div>
      <div className="absolute top-12 right-20 w-16 h-8 bg-white/40 rounded-full animate-float-delayed blur-sm"></div>
      <div className="absolute top-20 left-1/3 w-24 h-10 bg-white/50 rounded-full animate-float-slow blur-sm"></div>
      
      {/* Enhanced meadow with flowers */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-600 to-green-400"></div>
      <div className="absolute bottom-16 left-12 w-2 h-2 bg-pink-400 rounded-full animate-bloom"></div>
      <div className="absolute bottom-18 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-bloom animation-delay-400"></div>
      <div className="absolute bottom-14 right-16 w-2 h-2 bg-purple-400 rounded-full animate-bloom animation-delay-1000"></div>
      
      {/* Enhanced fox with more detail */}
      <div className="absolute bottom-16 left-8 animate-bounce-gentle">
        <div className="relative">
          <div className="w-8 h-6 bg-orange-500 rounded-full relative shadow-lg">
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-orange-500 rounded-full"></div>
            <div className="absolute -right-3 top-2 w-6 h-2 bg-orange-500 rounded-full"></div>
            <div className="absolute top-1 left-2 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-1 right-3 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-3 left-3 w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced rabbit family */}
      <div className="absolute bottom-12 right-12 animate-hop">
        <div className="relative">
          <div className="w-6 h-8 bg-white rounded-full relative shadow-lg">
            <div className="absolute -top-3 left-1 w-2 h-5 bg-white rounded-full"></div>
            <div className="absolute -top-3 right-1 w-2 h-5 bg-white rounded-full"></div>
            <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-4 left-2.5 w-1 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Baby rabbit */}
      <div className="absolute bottom-10 right-20 animate-hop animation-delay-200">
        <div className="w-4 h-5 bg-gray-200 rounded-full relative shadow-md">
          <div className="absolute -top-2 left-0.5 w-1 h-3 bg-gray-200 rounded-full"></div>
          <div className="absolute -top-2 right-0.5 w-1 h-3 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Enhanced bird flock */}
      <div className="absolute top-12 left-1/2 animate-fly-circle">
        <div className="relative">
          <div className="w-4 h-3 bg-blue-600 rounded-full relative shadow-md">
            <div className="absolute -left-1 top-0 w-3 h-2 bg-blue-600 rounded-full transform -rotate-12"></div>
            <div className="absolute -right-1 top-0 w-3 h-2 bg-blue-600 rounded-full transform rotate-12"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-16 left-1/3 animate-fly-circle animation-delay-1000">
        <div className="w-3 h-2 bg-blue-500 rounded-full relative">
          <div className="absolute -left-1 top-0 w-2 h-1 bg-blue-500 rounded-full transform -rotate-15"></div>
          <div className="absolute -right-1 top-0 w-2 h-1 bg-blue-500 rounded-full transform rotate-15"></div>
        </div>
      </div>
      
      {/* Animated tree */}
      <div className="absolute bottom-20 left-1/4 animate-sway">
        <div className="w-3 h-16 bg-amber-700 rounded-t-full relative">
          <div className="absolute -top-4 -left-2 w-8 h-8 bg-green-500 rounded-full"></div>
          <div className="absolute -top-6 -right-1 w-6 h-6 bg-green-400 rounded-full"></div>
          <div className="absolute -top-2 left-1 w-4 h-4 bg-green-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Butterflies */}
      <div className="absolute top-1/3 right-1/4 animate-butterfly-fly">
        <div className="relative">
          <div className="w-3 h-2 bg-orange-400 rounded-full relative">
            <div className="absolute -left-1 top-0 w-3 h-3 bg-orange-300 rounded-full opacity-80"></div>
            <div className="absolute -right-1 top-0 w-3 h-3 bg-orange-300 rounded-full opacity-80"></div>
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SportsHeroAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-br from-orange-400 via-red-400 to-red-600">
      {/* Stadium atmosphere */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent animate-pulse-glow"></div>
      
      {/* Stadium lights */}
      <div className="absolute top-4 left-8 w-4 h-4 bg-yellow-300 rounded-full animate-pulse-bright blur-sm shadow-2xl"></div>
      <div className="absolute top-4 right-8 w-4 h-4 bg-yellow-300 rounded-full animate-pulse-bright blur-sm shadow-2xl animation-delay-400"></div>
      <div className="absolute top-4 left-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse-bright blur-sm shadow-2xl animation-delay-1000"></div>
      
      {/* Enhanced soccer ball with shadow */}
      <div className="absolute bottom-14 left-12 animate-bounce-ball">
        <div className="relative">
          <div className="w-10 h-10 bg-white rounded-full relative border-2 border-black shadow-2xl">
            <div className="absolute inset-1 border border-black rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-0 border-t border-black"></div>
            <div className="absolute left-1/2 top-0 h-full w-0 border-l border-black"></div>
            <div className="absolute top-2 left-2 w-2 h-2 border border-black rounded-full"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border border-black rounded-full"></div>
            <div className="absolute bottom-2 left-3 w-2 h-2 border border-black rounded-full"></div>
          </div>
          {/* Ball shadow */}
          <div className="absolute top-12 left-1 w-8 h-2 bg-black/20 rounded-full blur-sm animate-bounce-shadow"></div>
        </div>
      </div>
      
      {/* Enhanced basketball with realistic texture */}
      <div className="absolute top-16 right-16 animate-spin">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full relative shadow-2xl">
            <div className="absolute inset-0 border-2 border-black rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-0 border-t-2 border-black"></div>
            <div className="absolute left-1/2 top-0 h-full w-0 border-l-2 border-black"></div>
            <div className="absolute top-1 left-1 w-10 h-10 border border-black rounded-full opacity-50"></div>
            {/* Basketball texture lines */}
            <div className="absolute top-3 left-2 w-8 h-0 border-t border-black/50 transform rotate-45"></div>
            <div className="absolute top-3 right-2 w-8 h-0 border-t border-black/50 transform -rotate-45"></div>
          </div>
        </div>
      </div>
      
      {/* Tennis ball */}
      <div className="absolute bottom-1/3 right-1/4 animate-bounce-gentle">
        <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full relative shadow-lg">
          <div className="absolute top-1/2 left-0 w-full h-0 border-t border-white transform -rotate-12"></div>
          <div className="absolute top-1/2 left-0 w-full h-0 border-t border-white transform rotate-12"></div>
        </div>
      </div>
      
      {/* American football */}
      <div className="absolute top-1/3 left-1/4 animate-spin-football">
        <div className="w-8 h-5 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full relative shadow-lg transform rotate-45">
          <div className="absolute top-1/2 left-1 right-1 h-0 border-t border-white"></div>
          <div className="absolute top-1/2 left-2 right-2 h-0 border-t border-white transform translate-y-0.5"></div>
          <div className="absolute top-1/2 left-2 right-2 h-0 border-t border-white transform -translate-y-0.5"></div>
        </div>
      </div>
      
      {/* Enhanced motion trails with multiple colors */}
      <div className="absolute bottom-20 left-20 w-20 h-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rounded-full animate-trail blur-sm"></div>
      <div className="absolute top-24 right-24 w-16 h-2 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60 rounded-full animate-trail-delayed blur-sm"></div>
      <div className="absolute bottom-1/2 left-1/3 w-12 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-50 rounded-full animate-trail animation-delay-1500 blur-sm"></div>
      
      {/* Stadium crowd effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-800/40 to-transparent"></div>
      <div className="absolute bottom-2 left-4 w-1 h-4 bg-yellow-400 rounded-full animate-cheer"></div>
      <div className="absolute bottom-2 left-8 w-1 h-3 bg-blue-400 rounded-full animate-cheer animation-delay-200"></div>
      <div className="absolute bottom-2 right-4 w-1 h-5 bg-green-400 rounded-full animate-cheer animation-delay-400"></div>
      <div className="absolute bottom-2 right-8 w-1 h-3 bg-red-400 rounded-full animate-cheer animation-delay-1000"></div>
      
      {/* Victory confetti */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i % 6],
            left: `${10 + i * 10}%`,
            top: `${5 + (i % 3) * 5}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  </div>
);

const TechWizardAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Matrix rain effect background */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent animate-pulse-glow"></div>
      
      {/* Enhanced floating code symbols */}
      <div className="absolute top-12 left-12 animate-float-code text-green-400 font-mono text-3xl font-bold shadow-2xl">&lt;/&gt;</div>
      <div className="absolute top-20 right-20 animate-float-code-delayed text-cyan-400 font-mono text-2xl font-bold shadow-2xl">{ }</div>
      <div className="absolute bottom-32 left-16 animate-float-code text-yellow-400 font-mono text-2xl font-bold shadow-2xl">01</div>
      <div className="absolute top-1/3 left-1/4 animate-float-code text-pink-400 font-mono text-xl font-bold shadow-2xl animation-delay-1000">fn()</div>
      <div className="absolute bottom-1/3 right-1/4 animate-float-code text-orange-400 font-mono text-xl font-bold shadow-2xl animation-delay-1500">AI</div>
      <div className="absolute top-1/2 right-1/3 animate-float-code-delayed text-purple-400 font-mono text-lg font-bold shadow-2xl">[]</div>
      
      {/* Enhanced circuit board patterns */}
      <div className="absolute inset-0">
        {/* Horizontal circuits */}
        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-cyan-400/50 shadow-2xl"></div>
        <div className="absolute top-1/4 left-32 w-4 h-4 bg-cyan-400 rounded-full animate-pulse-bright shadow-cyan-400/50 shadow-2xl"></div>
        <div className="absolute top-1/4 left-36 w-40 h-px bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent animate-pulse shadow-blue-400/50 shadow-2xl"></div>
        
        <div className="absolute top-2/3 right-0 w-48 h-px bg-gradient-to-l from-transparent via-purple-400 to-transparent animate-pulse shadow-purple-400/50 shadow-2xl"></div>
        <div className="absolute top-2/3 right-48 w-4 h-4 bg-purple-400 rounded-full animate-pulse-bright shadow-purple-400/50 shadow-2xl"></div>
        
        {/* Vertical circuits */}
        <div className="absolute left-1/3 top-0 w-px h-24 bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse shadow-green-400/50 shadow-2xl"></div>
        <div className="absolute left-1/3 top-24 w-4 h-4 bg-green-400 rounded-full animate-pulse-bright shadow-green-400/50 shadow-2xl"></div>
        <div className="absolute left-1/3 top-28 w-px h-32 bg-gradient-to-b from-green-400 via-yellow-400 to-transparent animate-pulse shadow-yellow-400/50 shadow-2xl"></div>
        
        <div className="absolute right-1/4 bottom-0 w-px h-40 bg-gradient-to-t from-transparent via-pink-400 to-transparent animate-pulse shadow-pink-400/50 shadow-2xl"></div>
        <div className="absolute right-1/4 bottom-40 w-4 h-4 bg-pink-400 rounded-full animate-pulse-bright shadow-pink-400/50 shadow-2xl"></div>
      </div>
      
      {/* Holographic screen projections */}
      <div className="absolute top-1/4 right-1/4 w-32 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 animate-float backdrop-blur-sm">
        <div className="absolute inset-2 border border-cyan-400/50 rounded animate-pulse"></div>
        <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse-bright"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse-bright animation-delay-400"></div>
        <div className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
      </div>
      
      {/* Enhanced digital particles - Matrix rain */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-green-400 rounded-full animate-digital-flow shadow-green-400/50 shadow-lg"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${5 + i * 4.5}%`,
            top: `${Math.random() * 20}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Binary code streams */}
      <div className="absolute top-8 left-1/2 text-green-300/60 font-mono text-sm animate-float-code">
        1010101010<br/>
        1100110011<br/>
        0011001100
      </div>
      
      {/* Cyber grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} className="w-full h-full animate-pulse"></div>
      </div>
      
      {/* AI robot avatar */}
      <div className="absolute bottom-20 right-16 animate-float-delayed">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-600 rounded-lg relative shadow-2xl">
          <div className="absolute top-2 left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse-bright"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse-bright animation-delay-400"></div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const CreativeArtistAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-400">
      {/* Artist's canvas background */}
      <div className="absolute inset-8 bg-white/90 rounded-2xl shadow-2xl border-8 border-amber-700 animate-float">
        <div className="absolute inset-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg"></div>
      </div>
      
      {/* Enhanced paint splashes with drips */}
      <div className="absolute top-12 left-12 animate-paint-splash">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl shadow-red-500/50 opacity-90">
          <div className="absolute -bottom-2 left-1/2 w-2 h-6 bg-red-500 rounded-full transform -translate-x-1/2 animate-drip"></div>
        </div>
      </div>
      
      <div className="absolute top-20 right-16 animate-paint-splash-delayed">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-2xl shadow-blue-500/50 opacity-90">
          <div className="absolute -bottom-1 right-1 w-1 h-4 bg-blue-500 rounded-full animate-drip animation-delay-400"></div>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-20 animate-paint-splash">
        <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl shadow-yellow-500/50 opacity-90">
          <div className="absolute -bottom-1 left-2 w-1 h-3 bg-yellow-500 rounded-full animate-drip animation-delay-1000"></div>
        </div>
      </div>
      
      <div className="absolute top-1/3 left-1/3 animate-paint-splash-delayed">
        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl shadow-green-500/50 opacity-90"></div>
      </div>
      
      <div className="absolute bottom-1/2 right-1/4 animate-paint-splash">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-700 rounded-full shadow-2xl shadow-purple-500/50 opacity-90">
          <div className="absolute -bottom-2 right-2 w-2 h-5 bg-purple-500 rounded-full animate-drip animation-delay-200"></div>
        </div>
      </div>
      
      {/* Enhanced paintbrush with realistic handle */}
      <div className="absolute top-1/2 left-8 animate-brush-stroke">
        <div className="relative">
          <div className="w-20 h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full shadow-2xl blur-sm"></div>
          <div className="absolute -right-8 top-0 w-12 h-3 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full"></div>
          <div className="absolute -right-12 top-1 w-2 h-1 bg-silver rounded-full"></div>
        </div>
      </div>
      
      {/* Color palette */}
      <div className="absolute bottom-16 right-12 animate-float-delayed">
        <div className="w-20 h-12 bg-white rounded-2xl shadow-2xl border-2 border-gray-300 p-2">
          <div className="grid grid-cols-4 gap-1 h-full">
            <div className="bg-red-500 rounded-full animate-pulse-bright"></div>
            <div className="bg-blue-500 rounded-full animate-pulse-bright animation-delay-200"></div>
            <div className="bg-yellow-500 rounded-full animate-pulse-bright animation-delay-400"></div>
            <div className="bg-green-500 rounded-full animate-pulse-bright animation-delay-1000"></div>
            <div className="bg-purple-500 rounded-full animate-pulse-bright animation-delay-1500"></div>
            <div className="bg-orange-500 rounded-full animate-pulse-bright animation-delay-200"></div>
            <div className="bg-pink-500 rounded-full animate-pulse-bright animation-delay-1000"></div>
            <div className="bg-cyan-500 rounded-full animate-pulse-bright animation-delay-400"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced floating art supplies */}
      <div className="absolute bottom-24 right-24 animate-spin-slow">
        <div className="w-12 h-12 bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-full shadow-2xl shadow-rainbow/50">
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-4 bg-gradient-conic from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-red-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Pencils and brushes */}
      <div className="absolute top-24 right-8 animate-float">
        <div className="w-2 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-full transform rotate-45 shadow-lg"></div>
        <div className="absolute -top-1 left-0 w-2 h-3 bg-pink-400 rounded-t-full"></div>
      </div>
      
      <div className="absolute top-32 right-12 animate-float-delayed">
        <div className="w-1 h-12 bg-gradient-to-t from-blue-800 to-blue-600 rounded-full transform rotate-30 shadow-lg"></div>
        <div className="absolute -top-1 left-0 w-1 h-2 bg-blue-900 rounded-t-full"></div>
      </div>
      
      {/* Enhanced creative sparkles with rainbow colors */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle shadow-2xl"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][i % 8],
            left: `${15 + i * 7}%`,
            top: `${20 + (i % 4) * 15}%`,
            animationDelay: `${i * 0.3}s`,
            borderRadius: i % 2 === 0 ? '50%' : '20%'
          }}
        />
      ))}
      
      {/* Floating inspirational quotes */}
      <div className="absolute top-16 left-1/4 animate-float-code text-purple-800 font-serif text-lg opacity-70 transform rotate-12">
        "Art is..."
      </div>
      
      {/* Paper sheets floating */}
      <div className="absolute bottom-40 left-12 animate-float">
        <div className="w-16 h-20 bg-white rounded shadow-2xl border border-gray-200 transform rotate-12">
          <div className="absolute inset-2 border-l-2 border-red-300"></div>
          <div className="absolute top-3 left-4 right-2 h-px bg-blue-300"></div>
          <div className="absolute top-5 left-4 right-2 h-px bg-blue-300"></div>
          <div className="absolute top-7 left-4 right-4 h-px bg-blue-300"></div>
        </div>
      </div>
    </div>
  </div>
);

const NatureExplorerAnimation = ({ isActive }) => (
  <div className={`absolute inset-0 overflow-hidden ${isActive ? 'animate-fade-in' : 'opacity-0'}`}>
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 via-sky-200 to-green-400">
      {/* Enhanced sky with moving clouds */}
      <div className="absolute top-8 left-20 w-24 h-16 bg-white/80 rounded-full animate-float blur-sm shadow-2xl"></div>
      <div className="absolute top-12 right-24 w-20 h-12 bg-white/60 rounded-full animate-float-delayed blur-sm shadow-xl"></div>
      <div className="absolute top-16 left-1/2 w-28 h-14 bg-white/70 rounded-full animate-float-slow blur-sm shadow-xl"></div>
      
      {/* Majestic mountain silhouettes */}
      <div className="absolute bottom-32 left-0 right-0">
        <div className="w-full h-32 bg-gradient-to-t from-green-700 to-green-500 opacity-60"></div>
        <div className="absolute bottom-0 left-1/4 w-0 h-0 border-l-24 border-r-24 border-b-40 border-l-transparent border-r-transparent border-b-green-800 opacity-80"></div>
        <div className="absolute bottom-0 right-1/4 w-0 h-0 border-l-20 border-r-20 border-b-32 border-l-transparent border-r-transparent border-b-green-700 opacity-90"></div>
      </div>
      
      {/* Enhanced forest with multiple trees */}
      <div className="absolute bottom-20 left-8 animate-sway">
        <div className="w-4 h-20 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-full relative shadow-lg">
          <div className="absolute -top-6 -left-4 w-12 h-12 bg-green-600 rounded-full shadow-lg"></div>
          <div className="absolute -top-8 -right-2 w-8 h-8 bg-green-500 rounded-full shadow-md"></div>
          <div className="absolute -top-4 left-1 w-6 h-6 bg-green-700 rounded-full shadow-md"></div>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-12 animate-sway-delayed">
        <div className="w-3 h-16 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-full relative shadow-lg">
          <div className="absolute -top-5 -left-3 w-9 h-9 bg-green-500 rounded-full shadow-lg"></div>
          <div className="absolute -top-6 -right-1 w-6 h-6 bg-green-600 rounded-full shadow-md"></div>
          <div className="absolute -top-2 left-0 w-4 h-4 bg-green-700 rounded-full shadow-md"></div>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-1/3 animate-sway animation-delay-1000">
        <div className="w-5 h-24 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-full relative shadow-xl">
          <div className="absolute -top-8 -left-5 w-14 h-14 bg-green-600 rounded-full shadow-xl"></div>
          <div className="absolute -top-10 -right-3 w-10 h-10 bg-green-500 rounded-full shadow-lg"></div>
          <div className="absolute -top-6 left-2 w-8 h-8 bg-green-700 rounded-full shadow-lg"></div>
        </div>
      </div>
      
      {/* Enhanced flower garden */}
      <div className="absolute bottom-16 left-16 animate-bloom">
        <div className="relative">
          <div className="w-4 h-4 bg-pink-500 rounded-full relative shadow-lg">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-14 left-24 animate-bloom animation-delay-400">
        <div className="w-3 h-3 bg-yellow-400 rounded-full relative shadow-lg">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute bottom-18 right-20 animate-bloom animation-delay-1000">
        <div className="w-3 h-3 bg-purple-500 rounded-full relative shadow-lg">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Enhanced butterfly collection */}
      <div className="absolute top-16 left-1/2 animate-butterfly-fly">
        <div className="relative">
          <div className="w-3 h-2 bg-orange-500 rounded-full relative shadow-lg">
            <div className="absolute -left-1 top-0 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-90 shadow-lg"></div>
            <div className="absolute -right-1 top-0 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-90 shadow-lg"></div>
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-24 right-1/3 animate-butterfly-fly animation-delay-1500">
        <div className="relative">
          <div className="w-2 h-1 bg-blue-500 rounded-full relative shadow-md">
            <div className="absolute -left-1 top-0 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-90 shadow-md"></div>
            <div className="absolute -right-1 top-0 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-90 shadow-md"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced sun with realistic rays */}
      <div className="absolute top-12 right-12 animate-pulse-bright">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl shadow-yellow-400/50">
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
          </div>
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-gradient-to-t from-yellow-400 to-transparent rounded-full animate-pulse-glow"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '50% 24px',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Singing birds */}
      <div className="absolute top-1/4 left-1/4 animate-fly-circle">
        <div className="w-4 h-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full relative shadow-lg">
          <div className="absolute -left-1 top-0 w-3 h-2 bg-blue-600 rounded-full transform -rotate-12"></div>
          <div className="absolute -right-1 top-0 w-3 h-2 bg-blue-600 rounded-full transform rotate-12"></div>
          <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
        </div>
      </div>
      
      {/* Swaying grass */}
      <div className="absolute bottom-0 left-0 right-0 h-8">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full animate-sway"
            style={{
              height: `${16 + Math.random() * 16}px`,
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating leaves */}
      <div className="absolute top-20 left-12 animate-float text-2xl">🍃</div>
      <div className="absolute top-32 right-16 animate-float-delayed text-xl">🍂</div>
      <div className="absolute top-40 left-1/3 animate-float-slow text-lg">🌿</div>
    </div>
  </div>
);

const InterestSelector = ({ interests, selectedInterests, handleInterestToggle, proceedToCharacterSelection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const animationComponents = {
    space: SpaceAdventureAnimation,
    animals: AnimalFriendsAnimation,
    sports: SportsHeroAnimation,
    tech: TechWizardAnimation,
    art: CreativeArtistAnimation,
    nature: NatureExplorerAnimation
  };

  const navigateToInterest = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % interests.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + interests.length) % interests.length);
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentInterest = interests[currentIndex];
  // Use original animations for all topics
  const AnimationComponent = animationComponents[currentInterest.id];



  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') navigateToInterest('prev');
      if (e.key === 'ArrowRight') navigateToInterest('next');
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigateToInterest]);

  return (
    <div className="fixed inset-0 top-16 bg-background overflow-hidden z-30">




      {/* Full-screen immersive animation area (on top of video) */}
      <div className="absolute inset-0 z-20">
        {AnimationComponent && <AnimationComponent isActive={true} />}
        
        {/* Floating navigation controls */}
        <button
          onClick={() => navigateToInterest('prev')}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110 shadow-2xl z-30"
          disabled={isAnimating}
          aria-label="Previous interest"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button
          onClick={() => navigateToInterest('next')}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110 shadow-2xl z-30"
          disabled={isAnimating}
          aria-label="Next interest"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Enhanced floating interest info panel */}
        <div className="absolute bottom-8 left-8 right-8 max-w-4xl mx-auto bg-black/30 backdrop-blur-xl rounded-3xl p-8 text-white border border-white/20 shadow-2xl z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-6xl animate-pulse-glow">{currentInterest.emoji}</div>
              <div>
                <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {currentInterest.name}
                </h3>
                <p className="text-lg text-gray-300 opacity-90">
                  Experience the magic of {currentInterest.name.toLowerCase()} adventures
                </p>
              </div>
            </div>
            <button
              onClick={() => handleInterestToggle(currentInterest.id)}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                selectedInterests.includes(currentInterest.id)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30 animate-pulse-glow'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white shadow-white/30'
              }`}
            >
              {selectedInterests.includes(currentInterest.id) ? (
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Selected
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Select
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced floating progress indicator */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-2xl z-30">
          {interests.map((interest, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 h-4 bg-white rounded-full shadow-lg shadow-white/50' 
                  : 'w-4 h-4 bg-white/40 rounded-full hover:bg-white/60'
              }`}
              title={interest.name}
            />
          ))}
        </div>

        {/* Floating instruction text */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-30">
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse-glow">
            Choose Your Adventure
          </h2>
          <p className="text-xl text-white/80 backdrop-blur-sm bg-black/20 px-6 py-2 rounded-full border border-white/20">
            Navigate through magical worlds and select your favorites
          </p>
        </div>
      </div>

      {/* Selected interests floating panel */}
      {selectedInterests.length > 0 && (
        <div className="fixed bottom-32 right-8 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-sm z-40 animate-fade-in">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Selected Adventures
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedInterests.map(id => {
              const interest = interests.find(i => i.id === id);
              return (
                <div key={id} className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-primary/30 text-sm">
                  <span>{interest.emoji}</span>
                  <span className="font-medium">{interest.name}</span>
                </div>
              );
            })}
          </div>
          <button 
            onClick={proceedToCharacterSelection} 
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            Begin Adventure →
          </button>
        </div>
      )}

      {/* Floating continue button when no selection */}
      {selectedInterests.length === 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <p className="text-white/60 text-center mb-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            Select at least one adventure to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default InterestSelector;