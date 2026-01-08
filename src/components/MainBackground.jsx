import React, { useRef, useId, useEffect } from 'react';
import { animate, useMotionValue } from 'framer-motion';

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  if (fromLow === fromHigh) {
    return toLow;
  }
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

function MainBackground() {
  const rawId = useId();
  const id = `mainbg-${rawId.replace(/:/g, "")}`;
  const feColorMatrixRef = useRef(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef(null);

  // Animation settings (+30% more movement)
  const animation = { scale: 85, speed: 65 };
  const noise = { opacity: 0.4, scale: 1.0 };
  const color = 'rgba(128, 128, 128, 1)';

  const displacementScale = mapRange(animation.scale, 1, 100, 40, 180);
  const animationDuration = mapRange(animation.speed, 1, 100, 600, 20);

  useEffect(() => {
    if (feColorMatrixRef.current) {
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 50,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute("values", String(value));
          }
        }
      });

      return () => {
        if (hueRotateAnimation.current) {
          hueRotateAnimation.current.stop();
        }
      };
    }
  }, [animationDuration, hueRotateMotionValue]);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        overflow: "hidden",
        background: '#050505'
      }}
    >
      {/* Animated shadow layer */}
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: `url(#${id}) blur(4px)`
        }}
      >
        <svg style={{ position: "absolute" }}>
          <defs>
            <filter id={id}>
              <feTurbulence
                result="undulation"
                numOctaves="4"
                baseFrequency={`${mapRange(animation.scale, 0, 100, 0.003, 0.0015)},${mapRange(animation.scale, 0, 100, 0.01, 0.005)}`}
                seed="0"
                type="turbulence"
              />
              <feColorMatrix
                ref={feColorMatrixRef}
                in="undulation"
                type="hueRotate"
                values="180"
              />
              <feColorMatrix
                in="dist"
                result="circulation"
                type="matrix"
                values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circulation"
                scale={displacementScale}
                result="dist"
              />
              <feDisplacementMap
                in="dist"
                in2="undulation"
                scale={displacementScale}
                result="output"
              />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%"
          }}
        />
      </div>

      {/* Noise overlay */}
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            pointerEvents: "none"
          }}
        />
      )}
    </div>
  );
}

export default MainBackground;
