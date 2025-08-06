'use client';

import './CRTEffect.css';

export default function CRTEffect({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt relative w-full h-full overflow-hidden">
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}