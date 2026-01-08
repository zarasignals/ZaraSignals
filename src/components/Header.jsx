import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Radio, Twitter, Send, Github } from 'lucide-react';
import MatrixText from './MatrixText';
import GlowingEffect from './GlowingEffect';

// Text Scramble Class
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="text-white opacity-70">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Scrambled Title Component
function ScrambledTitle() {
  const elementRef = useRef(null);
  const scramblerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current);
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        'Hello, Zara There,',
        'It\'s RAINING',
        'with PROFITS',
        'and SIGNALS',
        'dont FORGET to bring',
        'your umbrella today'
      ];
      
      let counter = 0;
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000);
          });
          counter = (counter + 1) % phrases.length;
        }
      };

      next();
    }
  }, [mounted]);

  return (
    <h1 
      ref={elementRef}
      className="text-white text-2xl md:text-3xl font-bold tracking-wider font-mono"
    >
      Hello, Zara There,
    </h1>
  );
}

// Raining Letters Background
function RainingLetters() {
  const [characters, setCharacters] = useState([]);
  const [activeIndices, setActiveIndices] = useState(new Set());

  const createCharacters = useCallback(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const charCount = 150;
    const newCharacters = [];

    for (let i = 0; i < charCount; i++) {
      newCharacters.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.15,
      });
    }

    return newCharacters;
  }, []);

  useEffect(() => {
    setCharacters(createCharacters());
  }, [createCharacters]);

  useEffect(() => {
    const updateActiveIndices = () => {
      const newActiveIndices = new Set();
      const numActive = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numActive; i++) {
        newActiveIndices.add(Math.floor(Math.random() * characters.length));
      }
      setActiveIndices(newActiveIndices);
    };

    const flickerInterval = setInterval(updateActiveIndices, 50);
    return () => clearInterval(flickerInterval);
  }, [characters.length]);

  useEffect(() => {
    let animationFrameId;

    const updatePositions = () => {
      setCharacters(prevChars => 
        prevChars.map(char => ({
          ...char,
          y: char.y + char.speed,
          ...(char.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
            char: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
              Math.floor(Math.random() * 36)
            ],
          }),
        }))
      );
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {characters.map((char, index) => (
        <span
          key={index}
          className={`absolute transition-colors duration-100 ${
            activeIndices.has(index)
              ? "text-white font-bold"
              : "text-gray-700 font-light"
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(index) ? 'scale(1.25)' : 'scale(1)'}`,
            textShadow: activeIndices.has(index) 
              ? '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)' 
              : 'none',
            opacity: activeIndices.has(index) ? 1 : 0.4,
            transition: 'color 0.1s, transform 0.1s, text-shadow 0.1s',
            fontSize: '0.9rem'
          }}
        >
          {char.char}
        </span>
      ))}
    </div>
  );
}

function Header({ isConnected }) {
  return (
    <header className="relative border-b border-gray-800 bg-black/90 backdrop-blur-lg sticky top-0 z-50 overflow-hidden">
      {/* Raining Letters Background */}
      <RainingLetters />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Centered Scrambled Title */}
          <div className="flex-1 flex justify-center">
            <ScrambledTitle />
          </div>

          {/* Status & Links */}
          <div className="flex items-center gap-6">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white' : 'bg-gray-600'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/SignalsZara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors group"
              >
                <Twitter className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </a>
              <a 
                href="https://t.me/ZaraSignals" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors group"
              >
                <Send className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </a>
              <a 
                href="https://github.com/zarasignals" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors group"
              >
                <Github className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </a>
            </div>

            {/* Live Indicator */}
            <div className="relative hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
              <GlowingEffect
                spread={30}
                glow={true}
                disabled={false}
                proximity={50}
                inactiveZone={0.01}
                borderWidth={1}
              />
              <Radio className="w-4 h-4 text-white animate-pulse relative z-10" />
              <MatrixText 
                text="LIVE SIGNALS" 
                className="text-xs font-medium text-gray-300 relative z-10"
                initialDelay={1000}
                letterAnimationDuration={200}
                letterInterval={40}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
