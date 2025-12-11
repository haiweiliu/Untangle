import React from 'react';
import { ClassificationScores } from '../types';

interface AgencyTriangleProps {
  scores: ClassificationScores;
  dominant: string;
}

export const AgencyTriangle: React.FC<AgencyTriangleProps> = ({ scores, dominant }) => {
  const total = 100;
  const life = scores.life_domain || 0;
  const mine = scores.my_domain || 0;
  const theirs = scores.others_domain || 0;

  const vLife = { x: 50, y: 10 };
  const vMine = { x: 10, y: 90 };
  const vTheirs = { x: 90, y: 90 };

  const dotX = (vLife.x * life + vMine.x * mine + vTheirs.x * theirs) / total;
  const dotY = (vLife.y * life + vMine.y * mine + vTheirs.y * theirs) / total;

  return (
    <div className="relative w-64 h-64 mx-auto my-6">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <polygon points="50,10 10,90 90,90" fill="white" stroke="#ec4899" strokeWidth="2" className="opacity-90" />
        
        <text x="50" y="5" textAnchor="middle" fontSize="4" className="uppercase tracking-widest fill-pink-500 font-bold">天的事 (Life)</text>
        <text x="5" y="98" textAnchor="start" fontSize="4" className="uppercase tracking-widest fill-pink-500 font-bold">我的事 (Me)</text>
        <text x="95" y="98" textAnchor="end" fontSize="4" className="uppercase tracking-widest fill-pink-500 font-bold">別人的事 (Theirs)</text>
        
        {/* Cute Bow on My Domain vertex */}
        <g transform="translate(5, 85) scale(0.1)">
           <path d="M15 20 Q5 15 15 10 Q25 15 15 20" fill="#ec4899" />
        </g>

        <circle cx={dotX} cy={dotY} r="4" fill={dominant === '我的事' ? '#ec4899' : dominant === '別人的事' ? '#f59e0b' : '#8b5cf6'} className="animate-pulse stroke-white stroke-2" />
        <line x1="50" y1="55" x2={dotX} y2={dotY} stroke="#ec4899" strokeWidth="0.5" strokeDasharray="1,1" className="opacity-40" />
      </svg>
    </div>
  );
};