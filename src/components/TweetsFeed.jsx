import React, { useState } from 'react';
import { Heart, Repeat2 } from 'lucide-react';

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 22 22" fill="currentColor">
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function TweetCard({ tweet, index, isHovered, isActive, onHover, onLeave, onTap, totalCards }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Just now';
    }
  };

  // More separated positions
  const baseX = index * 40;
  const baseY = index * 28;
  
  const getTransform = () => {
    if (isHovered || isActive) {
      return `translateX(${baseX}px) translateY(${baseY - 16}px) skewY(-6deg)`;
    }
    return `translateX(${baseX}px) translateY(${baseY}px) skewY(-6deg)`;
  };

  const getZIndex = () => {
    if (isHovered || isActive) return 50;
    return index + 1;
  };

  const isBackCard = index < totalCards - 1;

  return (
    <a
      href={tweet.url || 'https://twitter.com/SignalsZara'}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => {
        if ('ontouchstart' in window && !isActive) {
          e.preventDefault();
          onTap?.();
        }
      }}
      className="absolute transition-all duration-500 ease-out cursor-pointer"
      style={{
        transform: getTransform(),
        zIndex: getZIndex(),
      }}
    >
      <div
        className={`
          relative w-[300px] min-h-[150px] rounded-2xl border 
          ${isHovered || isActive 
            ? 'border-gray-500 bg-gray-900 shadow-xl shadow-black/50' 
            : 'border-gray-800 bg-gray-900/80'
          }
          ${isBackCard && !isHovered && !isActive ? 'grayscale-[30%] opacity-70' : ''}
          backdrop-blur-md p-4 transition-all duration-500
        `}
      >
        {/* Overlay for back cards */}
        {isBackCard && !isHovered && !isActive && (
          <div className="absolute inset-0 bg-black/40 rounded-2xl transition-opacity duration-500" />
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-3 relative z-10">
          <img 
            src="/perfil2.png" 
            alt="Zara AI"
            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-lg shadow-black/30"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-white text-sm">Zara AI</span>
              <VerifiedBadge />
            </div>
            <span className="text-gray-600 text-xs">@SignalsZara</span>
          </div>
          <TwitterIcon className="w-5 h-5 text-gray-600 hover:text-gray-400 transition-colors shrink-0" />
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3 relative z-10 font-mono">
          {tweet.content || 'Loading...'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-gray-600 text-xs relative z-10">
          <span>{formatTime(tweet.postedAt)}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-gray-400 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span>{tweet.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-gray-400 transition-colors">
              <Repeat2 className="w-3.5 h-3.5" />
              <span>{tweet.retweets || 0}</span>
            </div>
          </div>
        </div>

        {/* Glow effect on hover */}
        {(isHovered || isActive) && (
          <div className="absolute -inset-[2px] bg-gradient-to-r from-gray-600/20 via-white/10 to-gray-600/20 rounded-2xl -z-10 blur-md" />
        )}
      </div>
    </a>
  );
}

function TweetsFeed({ tweets }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Get last 3 tweets safely
  const safeTweets = [];
  if (Array.isArray(tweets)) {
    for (let i = 0; i < tweets.length && i < 3; i++) {
      const tweet = tweets[i];
      if (tweet && typeof tweet === 'object' && tweet.content) {
        safeTweets.push(tweet);
      }
    }
  }

  // Fill with placeholder if less than 3
  while (safeTweets.length < 3) {
    safeTweets.push({
      content: safeTweets.length === 0 
        ? '🤖 Zara AI scanning markets for alpha...' 
        : '📊 Next signal incoming...',
      postedAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 50),
      retweets: Math.floor(Math.random() * 20)
    });
  }

  const handleTap = (index) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  return (
    <div className="relative h-[320px] flex items-center justify-center">
      {/* Cards */}
      <div className="relative w-full h-full flex items-start justify-center pt-8 pl-4">
        {safeTweets.map((tweet, index) => (
          <TweetCard
            key={tweet.tweetId || index}
            tweet={tweet}
            index={index}
            totalCards={safeTweets.length}
            isHovered={hoveredIndex === index}
            isActive={activeIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            onTap={() => handleTap(index)}
          />
        ))}
      </div>
      
      {/* Hint text */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs text-gray-700">Hover to explore</span>
      </div>
    </div>
  );
}

export default TweetsFeed;
