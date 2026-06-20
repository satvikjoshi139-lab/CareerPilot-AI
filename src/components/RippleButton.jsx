import React, { useState } from 'react';

const RippleButton = ({
  children,
  onClick,
  className = '',
  variant = 'filled', // filled, tonal, outlined, elevated
  icon = '',
  type = 'button',
  disabled = false,
  style = {}
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (disabled) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now() + Math.random(),
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
      }
    };

    setRipples((prev) => [...prev, newRipple]);

    if (onClick) {
      onClick(event);
    }
  };

  const cleanRipple = (id) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'tonal': return 'btn-tonal';
      case 'outlined': return 'btn-outlined';
      case 'elevated': return 'btn-elevated';
      case 'filled':
      default:
        return 'btn-filled';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${className}`}
      onClick={createRipple}
      disabled={disabled}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={ripple.style}
          onAnimationEnd={() => cleanRipple(ripple.id)}
        />
      ))}
      
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <span style={{ position: 'relative', pointerEvents: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {children}
      </span>
    </button>
  );
};

export default RippleButton;
