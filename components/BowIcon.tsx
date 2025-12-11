import React from 'react';

interface IconProps {
  className?: string;
}

export const BowIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg">
       <ellipse cx="15" cy="20" rx="12" ry="10" fill="currentColor" />
       <ellipse cx="45" cy="20" rx="12" ry="10" fill="currentColor" />
       <circle cx="30" cy="20" r="8" fill="currentColor" />
  </svg>
);