import React, { forwardRef } from 'react';

const HoverSlatButton = forwardRef(({ 
  initialText, 
  hoverText, 
  className = "",
  onClick,
  disabled,
  ...props 
}, ref) => {
  // Pad shorter text with spaces if lengths don't match
  const maxLength = Math.max(initialText.length, hoverText.length);
  const paddedInitial = initialText.padEnd(maxLength);
  const paddedHover = hoverText.padEnd(maxLength);

  return (
    <div
      ref={ref}
      className={`group flex cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {paddedInitial.split("").map((char, index) => (
        <div
          key={index}
          className={`relative flex h-10 w-7 items-center justify-center overflow-hidden bg-gradient-to-r from-gray-300 to-gray-500 text-sm font-bold text-black transition-all duration-700 ${
            index === 0 ? 'rounded-l-xl' : ''
          } ${index === paddedInitial.length - 1 ? 'rounded-r-xl' : ''}`}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center bg-white text-black transition-transform duration-300 ${
              index % 2 === 0 ? "translate-y-full" : "-translate-y-full"
            } ${disabled ? '' : 'group-hover:translate-y-0'}`}
          >
            {paddedHover[index]}
          </div>
          {char}
        </div>
      ))}
    </div>
  );
});

HoverSlatButton.displayName = "HoverSlatButton";

export default HoverSlatButton;
