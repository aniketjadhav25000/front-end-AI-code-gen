import React from 'react';

const AnimatedStarsBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <g fill="#ffffff" fillOpacity="0.15">
          {Array.from({ length: 80 }).map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const r = Math.random() * 1.2 + 0.4;
            const dur = (Math.random() * 5 + 2).toFixed(2);
            const delay = (Math.random() * 5).toFixed(2);
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r={r}
                className="animate-twinkle"
                style={{
                  animationDuration: `${dur}s`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedStarsBackground;
