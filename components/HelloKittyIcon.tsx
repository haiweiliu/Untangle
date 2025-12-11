import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const HelloKittyIcon: React.FC<IconProps> = ({ size = 60, className = "" }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
     {/* Main Head Shape with Ears Integrated */}
     <path d="M 20 30 C 15 15 35 5 45 15 C 50 12 70 12 75 15 C 85 5 105 15 100 30 C 105 40 105 55 100 70 C 90 90 30 90 20 70 C 15 55 15 40 20 30 Z" 
           fill="white" stroke="#333" strokeWidth="3" strokeLinejoin="round" />
     
     {/* Bow - Placed on Right Ear */}
     <g transform="translate(82, 22) rotate(20)">
        <path d="M -2 0 C -10 -10 -20 -5 -20 5 C -20 15 -10 20 -2 10" fill="#ec4899" stroke="#333" strokeWidth="2" />
        <path d="M 2 0 C 10 -10 20 -5 20 5 C 20 15 10 20 2 10" fill="#ec4899" stroke="#333" strokeWidth="2" />
        <circle cx="0" cy="5" r="6" fill="#ec4899" stroke="#333" strokeWidth="2" />
     </g>

     {/* Face Features */}
     <g transform="translate(0, 5)">
        <ellipse cx="35" cy="55" rx="4" ry="6" fill="#333" /> {/* Left Eye */}
        <ellipse cx="85" cy="55" rx="4" ry="6" fill="#333" /> {/* Right Eye */}
        <ellipse cx="60" cy="65" rx="6" ry="4" fill="#fbbf24" stroke="#333" strokeWidth="2" /> {/* Nose */}
        
        {/* Whiskers Left */}
        <line x1="15" y1="58" x2="28" y2="60" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="68" x2="28" y2="68" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="78" x2="28" y2="76" stroke="#333" strokeWidth="2" strokeLinecap="round" />

        {/* Whiskers Right */}
        <line x1="105" y1="58" x2="92" y2="60" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="68" x2="92" y2="68" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="78" x2="92" y2="76" stroke="#333" strokeWidth="2" strokeLinecap="round" />
     </g>
  </svg>
);