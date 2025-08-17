import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MagneticButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: 'arrow' | 'sparkles' | null;
  variant?: 'primary' | 'secondary';
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  to,
  onClick,
  children,
  className = '',
  icon = 'arrow',
  variant = 'primary',
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
  };

  const sharedClasses =
    'relative group overflow-hidden rounded-2xl transition-all duration-300 will-change-transform';
  const sizing = 'px-6 py-3 text-base md:text-lg';
  const look =
    variant === 'primary'
      ? 'glass-button shadow-lg hover:shadow-xl'
      : 'glass border-2 border-primary/20 hover:border-primary/40';

  const content = (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      className={`${sharedClasses} ${sizing} ${look} ${className}`}
      style={{
        // Subtle magnetic translation
        transform: `translate3d(${(pos.x - 60) * 0.02}px, ${(pos.y - 20) * 0.02}px, 0)`
      }}
    >
      {/* Spotlight */}
      <span
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px 180px at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.18), transparent 60%)`
        }}
      />
      <span className="relative z-10 flex items-center gap-2 md:gap-3">
        {icon === 'sparkles' && (
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
        )}
        <span>{children}</span>
        {icon === 'arrow' && (
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </span>
    </button>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default MagneticButton;
