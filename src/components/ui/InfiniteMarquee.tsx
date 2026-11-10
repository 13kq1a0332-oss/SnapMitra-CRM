import React from 'react';

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: string; // e.g. '30s'
  className?: string;
  reverse?: boolean;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  children,
  speed = '32s',
  className = '',
  reverse = false,
}) => {
  return (
    <div className={`relative w-full overflow-hidden mask-gradient-x ${className}`}>
      {/* Left/Right Edge Gradient Fades for Editorial Polish */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#0B0B0C] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#0B0B0C] to-transparent" />

      <div
        className="animate-marquee flex flex-row items-center gap-6"
        style={{
          animationDuration: speed,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {/* Render children twice for seamless continuous scroll */}
        <div className="flex items-center gap-6 shrink-0">{children}</div>
        <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

