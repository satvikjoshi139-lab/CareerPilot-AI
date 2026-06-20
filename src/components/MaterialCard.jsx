import React from 'react';

const MaterialCard = ({
  children,
  className = '',
  variant = 'filled', // elevated, filled, outlined
  onClick,
  style = {}
}) => {
  const getCardClass = () => {
    switch (variant) {
      case 'elevated': return 'card-elevated';
      case 'outlined': return 'card-outlined';
      case 'filled':
      default:
        return 'card-filled';
    }
  };

  const interactiveStyle = onClick ? { cursor: 'pointer' } : {};

  return (
    <div
      className={`card-md ${getCardClass()} ${className}`}
      onClick={onClick}
      style={{ ...interactiveStyle, ...style }}
    >
      {children}
    </div>
  );
};

export default MaterialCard;
