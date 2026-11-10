import React, { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  borderBeam?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(212, 175, 55, 0.18)',
  enableTilt = true,
  borderBeam = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (enableTilt) {
      // Calculate normalized coordinates (-1 to 1) from card center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Max tilt angle: 6 degrees for subtle luxury feel
      const maxTilt = 6;
      setTilt({
        rotateX: -normY * maxTilt,
        rotateY: normX * maxTilt,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableTilt && isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.25s ease'
          : 'transform 0.5s ease-out, box-shadow 0.4s ease',
      }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]/85 backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:shadow-[0_12px_40px_-10px_rgba(212,175,55,0.22)] ${className}`}
    >
      {/* 21st.dev Dynamic Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Specular lighting sheen on tilt */}
      {enableTilt && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `linear-gradient(${tilt.rotateY * 15 + 135}deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 21st.dev Border-Beam Glowing Accent for Featured Cards */}
      {borderBeam && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-gold/60"
          style={{
            boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.2)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
