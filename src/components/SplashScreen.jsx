import React, { useState, useCallback, useRef, useEffect } from 'react';
import ShadowOverlay from './ShadowOverlay';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

function TextScramble({ text, className = "", onComplete }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    setIsScrambling(true);
    frameRef.current = 0;
    const duration = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / duration;
      const revealedLength = Math.floor(progress * text.length);

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealedLength) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(newText);

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    scramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    scramble();
    setTimeout(() => {
      onComplete?.();
    }, text.length * 3 * 30 + 200);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={`group relative inline-flex flex-col cursor-pointer select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className="relative font-mono text-3xl md:text-5xl lg:text-6xl tracking-widest uppercase">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              isScrambling && char !== text[i] 
                ? "text-white scale-110" 
                : "text-gray-300"
            }`}
            style={{
              transitionDelay: `${i * 10}ms`,
              textShadow: isScrambling && char !== text[i] 
                ? '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)' 
                : '0 0 10px rgba(255,255,255,0.1)'
            }}
          >
            {char}
          </span>
        ))}
      </span>
      
      {/* Animated underline */}
      <span className="relative h-[2px] w-full mt-6 overflow-hidden">
        <span
          className={`absolute inset-0 bg-gradient-to-r from-gray-600 via-white to-gray-600 transition-transform duration-500 ease-out origin-left ${
            isHovering ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <span className="absolute inset-0 bg-gray-800" />
      </span>
      
      {/* Glow effect */}
      <span
        className={`absolute -inset-12 rounded-3xl transition-opacity duration-500 -z-10 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}

function SplashScreen({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter?.();
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{ background: '#000000' }}
    >
      {/* Shadow Overlay Animated Background - Grey */}
      <ShadowOverlay
        color="rgba(128, 128, 128, 1)"
        animation={{ scale: 70, speed: 50 }}
        noise={{ opacity: 0.4, scale: 1.0 }}
        className="absolute inset-0"
        style={{ background: '#000000' }}
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center px-4">
          {/* Logo Image */}
          <div className="relative mb-4">
            <img 
              src="/zara.png" 
              alt="Zara AI"
              className="w-40 h-40 md:w-56 md:h-56 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))'
              }}
            />
            {/* Outer glow */}
            <div 
              className="absolute -inset-8 rounded-full animate-pulse -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
              }}
            />
          </div>

          {/* Title with scramble effect */}
          <TextScramble 
            text="ENTER ZARA" 
            onComplete={handleEnter}
          />

          {/* Subtitle */}
          <p className="mt-12 text-gray-500 text-base md:text-lg tracking-[0.3em] uppercase font-light">
            Click to initialize
          </p>
          
          {/* Animated indicator */}
          <div className="mt-8 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </ShadowOverlay>

      {/* Version tag */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-20">
        <span className="text-gray-700 text-xs font-mono tracking-wider">
          v1.0.0 • POLYMARKET AI LABS
        </span>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gray-800 z-20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gray-800 z-20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-gray-800 z-20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-gray-800 z-20" />

      {/* Scan line effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)'
        }}
      />
    </div>
  );
}

export default SplashScreen;
