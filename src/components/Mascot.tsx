import React from 'react';

export type MascotMood = 'idle' | 'thinking' | 'happy' | 'celebrate' | 'oops';

interface MascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  character?: 'kiki' | 'bimo';
  onClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  speechText,
  size = 'md',
  character = 'kiki',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    >
      {/* Speech bubble */}
      {speechText && (
        <div className="mb-2 px-3 py-1.5 bg-white text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl shadow-md border-2 border-amber-300 relative animate-bounce max-w-[200px] text-center">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      {/* SVG Character */}
      <div className={`${sizeMap[size]} relative animate-float`}>
        {character === 'kiki' ? (
          // Kiki si Kancil Cerdik (Playful intelligent deer with little antlers & glasses)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Ears */}
            <ellipse cx="32" cy="30" rx="10" ry="24" fill="#d97706" transform="rotate(-25 32 30)" />
            <ellipse cx="32" cy="30" rx="6" ry="16" fill="#fde68a" transform="rotate(-25 32 30)" />
            <ellipse cx="88" cy="30" rx="10" ry="24" fill="#d97706" transform="rotate(25 88 30)" />
            <ellipse cx="88" cy="30" rx="6" ry="16" fill="#fde68a" transform="rotate(25 88 30)" />

            {/* Little cute antlers */}
            <path d="M42 22 L36 8 M39 15 L46 10" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            <path d="M78 22 L84 8 M81 15 L74 10" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

            {/* Head */}
            <circle cx="60" cy="65" r="40" fill="#f59e0b" />
            <ellipse cx="60" cy="74" rx="28" ry="22" fill="#fef3c7" />

            {/* Cheeks */}
            <circle cx="38" cy="74" r="7" fill="#fb7185" opacity="0.6" />
            <circle cx="82" cy="74" r="7" fill="#fb7185" opacity="0.6" />

            {/* Glasses (Glasses of wisdom) */}
            <circle cx="45" cy="60" r="13" fill="none" stroke="#0284c7" strokeWidth="3" />
            <circle cx="75" cy="60" r="13" fill="none" stroke="#0284c7" strokeWidth="3" />
            <line x1="58" y1="60" x2="62" y2="60" stroke="#0284c7" strokeWidth="3" />

            {/* Eyes based on mood */}
            {mood === 'happy' || mood === 'celebrate' ? (
              <>
                <path d="M39 60 Q45 53 51 60" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M69 60 Q75 53 81 60" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : mood === 'thinking' ? (
              <>
                <circle cx="47" cy="58" r="4.5" fill="#1e293b" />
                <circle cx="77" cy="58" r="4.5" fill="#1e293b" />
                <circle cx="48" cy="56" r="1.5" fill="#ffffff" />
                <circle cx="78" cy="56" r="1.5" fill="#ffffff" />
              </>
            ) : mood === 'oops' ? (
              <>
                <path d="M41 57 L49 63 M49 57 L41 63" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                <path d="M71 57 L79 63 M79 57 L71 63" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="45" cy="60" r="4" fill="#1e293b" />
                <circle cx="75" cy="60" r="4" fill="#1e293b" />
                <circle cx="46" cy="58" r="1.5" fill="#ffffff" />
                <circle cx="76" cy="58" r="1.5" fill="#ffffff" />
              </>
            )}

            {/* Cute nose */}
            <ellipse cx="60" cy="72" rx="4" ry="3" fill="#3b1d11" />

            {/* Mouth */}
            {mood === 'happy' || mood === 'celebrate' ? (
              <path d="M52 76 Q60 88 68 76" fill="#be123c" stroke="#3b1d11" strokeWidth="2.5" strokeLinecap="round" />
            ) : mood === 'oops' ? (
              <ellipse cx="60" cy="78" rx="4" ry="5" fill="#3b1d11" />
            ) : mood === 'thinking' ? (
              <path d="M54 78 Q62 76 66 79" fill="none" stroke="#3b1d11" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M53 76 Q60 82 67 76" fill="none" stroke="#3b1d11" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Little detective hero cape / tie */}
            <polygon points="56,92 64,92 60,105" fill="#10b981" />
          </svg>
        ) : (
          // Bimo si Robot Sahabat (Cute friendly mint robot)
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Antenna */}
            <line x1="60" y1="26" x2="60" y2="10" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
            <circle cx="60" cy="8" r="6" fill="#f59e0b" className="animate-pulse" />

            {/* Head container */}
            <rect x="25" y="26" width="70" height="58" rx="18" fill="#14b8a6" stroke="#0f766e" strokeWidth="3" />

            {/* Screen face */}
            <rect x="33" y="34" width="54" height="42" rx="12" fill="#0f172a" />

            {/* Eyes */}
            {mood === 'happy' || mood === 'celebrate' ? (
              <>
                <path d="M42 56 Q48 48 54 56" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <path d="M66 56 Q72 48 78 56" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : mood === 'oops' ? (
              <>
                <text x="43" y="58" fill="#f43f5e" fontSize="16" fontWeight="bold">?</text>
                <text x="68" y="58" fill="#f43f5e" fontSize="16" fontWeight="bold">?</text>
              </>
            ) : (
              <>
                <circle cx="48" cy="53" r="5" fill="#38bdf8" />
                <circle cx="72" cy="53" r="5" fill="#38bdf8" />
                <circle cx="50" cy="51" r="1.5" fill="#ffffff" />
                <circle cx="74" cy="51" r="1.5" fill="#ffffff" />
              </>
            )}

            {/* Robot Cheeks */}
            <circle cx="39" cy="64" r="3" fill="#f59e0b" />
            <circle cx="81" cy="64" r="3" fill="#f59e0b" />

            {/* Ear Bolts */}
            <rect x="18" y="44" width="7" height="16" rx="3" fill="#f59e0b" />
            <rect x="95" y="44" width="7" height="16" rx="3" fill="#f59e0b" />

            {/* Neck & Body */}
            <rect x="42" y="86" width="36" height="24" rx="8" fill="#0d9488" />
            <circle cx="60" cy="98" r="5" fill="#fbbf24" />
          </svg>
        )}
      </div>
    </div>
  );
};
