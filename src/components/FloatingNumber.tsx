'use client';

import { useState, useEffect } from 'react';
import './FloatingNumber.css';

interface FloatingNumberProps {
  value?: number;
}

export default function FloatingNumber({ value }: FloatingNumberProps) {
  const [number] = useState(() => value !== undefined ? value : Math.floor(Math.random() * 10));
  const [animationDuration] = useState(() => 6 + Math.random() * 4);
  const [animationDelay] = useState(() => Math.random() * 2);

  return (
    <div className="floating-container">
      <div 
        className="floating-number"
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