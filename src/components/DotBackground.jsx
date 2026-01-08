import React, { useEffect, useRef, useState } from 'react';

function DotBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const gridSize = 25;
    const baseRadius = 1.5;
    const maxRadius = 4;
    const influenceRadius = 150;

    let time = 0;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const cols = Math.ceil(dimensions.width / gridSize) + 1;
      const rows = Math.ceil(dimensions.height / gridSize) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Distance from mouse
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Mouse influence (0 to 1)
          const mouseInfluence = Math.max(0, 1 - distance / influenceRadius);

          // Wave animation
          const wave = Math.sin(time + i * 0.3 + j * 0.3) * 0.5 + 0.5;

          // Calculate radius
          const radius = baseRadius + (maxRadius - baseRadius) * (mouseInfluence * 0.8 + wave * 0.2);

          // Calculate opacity
          const baseOpacity = 0.15;
          const opacity = baseOpacity + mouseInfluence * 0.6 + wave * 0.1;

          // Draw dot
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        background: '#050505'
      }}
    />
  );
}

export default DotBackground;
