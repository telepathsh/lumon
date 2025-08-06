'use client';

import { useState } from 'react';

interface FloatingNumberProps {
  value?: number;
}

export default function FloatingNumber({ value }: FloatingNumberProps) {
  const [number] = useState(() => value !== undefined ? value : Math.floor(Math.random() * 10));
  const [animationDuration] = useState(() => 6 + Math.random() * 4);
  const [animationDelay] = useState(() => Math.random() * 2);

  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden inline-block">
      <div 
        className="absolute text-2xl font-semibold w-full h-full flex items-center justify-center animate-float tabular-nums pointer-events-none text-[#00b5cc]"
        style={{
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`
        }}
      >
        {number}
      </div>
    </div>
  );
}