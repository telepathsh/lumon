'use client';

import { useState, useEffect, useRef } from 'react';

interface FloatingNumberProps {
  value?: number;
}

export default function FloatingNumber({ value }: FloatingNumberProps) {
  const [number] = useState(() => value !== undefined ? value : Math.floor(Math.random() * 10));
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  
  useEffect(() => {
    let time = 0;
    const speed = 0.5 + Math.random() * 0.5;
    const offsetX = Math.random() * Math.PI * 2;
    const offsetY = Math.random() * Math.PI * 2;
    const amplitudeX = 1.5 + Math.random() * 1.5;
    const amplitudeY = 1.5 + Math.random() * 1.5;
    
    const animate = () => {
      time += 0.01 * speed;
      
      const x = Math.sin(time + offsetX) * amplitudeX;
      const y = Math.cos(time * 0.7 + offsetY) * amplitudeY;
      
      setPosition({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden inline-block">
      <div 
        className="absolute text-2xl font-semibold w-full h-full flex items-center justify-center tabular-nums pointer-events-none text-[#00b5cc]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'none'
        }}
      >
        {number}
      </div>
    </div>
  );
}