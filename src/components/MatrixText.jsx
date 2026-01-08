import React, { useState, useEffect, useCallback, useMemo } from 'react';

const MatrixText = ({
  text = "HelloWorld!",
  className = "",
  initialDelay = 200,
  letterAnimationDuration = 500,
  letterInterval = 100,
}) => {
  const [letters, setLetters] = useState(() =>
    text.split("").map((char) => ({
      char,
      isMatrix: false,
      isSpace: char === " ",
    }))
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomChar = useCallback(
    () => (Math.random() > 0.5 ? "1" : "0"),
    []
  );

  const animateLetter = useCallback(
    (index) => {
      if (index >= text.length) return;

      requestAnimationFrame(() => {
        setLetters((prev) => {
          const newLetters = [...prev];
          if (!newLetters[index].isSpace) {
            newLetters[index] = {
              ...newLetters[index],
              char: getRandomChar(),
              isMatrix: true,
            };
          }
          return newLetters;
        });

        setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev];
            newLetters[index] = {
              ...newLetters[index],
              char: text[index],
              isMatrix: false,
            };
            return newLetters;
          });
        }, letterAnimationDuration);
      });
    },
    [getRandomChar, text, letterAnimationDuration]
  );

  const startAnimation = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex >= text.length) {
        setIsAnimating(false);
        return;
      }

      animateLetter(currentIndex);
      currentIndex++;
      setTimeout(animate, letterInterval);
    };

    animate();
  }, [animateLetter, text, isAnimating, letterInterval]);

  useEffect(() => {
    const timer = setTimeout(startAnimation, initialDelay);
    return () => clearTimeout(timer);
  }, []);

  // Re-trigger animation on hover
  const handleMouseEnter = () => {
    if (!isAnimating) {
      startAnimation();
    }
  };

  return (
    <div
      className={`flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex items-center">
        {letters.map((letter, index) => (
          <span
            key={`${index}-${letter.char}`}
            className="font-mono text-center inline-block transition-all duration-100"
            style={{
              color: letter.isMatrix ? '#00ff00' : 'inherit',
              textShadow: letter.isMatrix 
                ? '0 2px 4px rgba(0, 255, 0, 0.5)' 
                : 'none',
              fontVariantNumeric: 'tabular-nums',
              width: letter.isSpace ? '0.5ch' : 'auto',
            }}
          >
            {letter.isSpace ? "\u00A0" : letter.char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MatrixText;
