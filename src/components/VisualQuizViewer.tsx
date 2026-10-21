import React from 'react';
import { Question } from '../data/adventureData';

interface VisualQuizViewerProps {
  question: Question;
}

export const VisualQuizViewer: React.FC<VisualQuizViewerProps> = ({ question }) => {
  const { visualType, visualData } = question;

  if (!visualType || !visualData) return null;

  // 1. Countable Items / Icon Row
  if (visualType === 'icons' && visualData.items) {
    return (
      <div className="my-4 p-4 bg-sky-50/90 rounded-2xl border-2 border-sky-200 flex flex-wrap items-center justify-center gap-3 shadow-inner">
        {visualData.items.map((item, idx) => (
          <div
            key={idx}
            className={`text-2xl sm:text-3xl p-2 rounded-xl transition-transform hover:scale-110 ${
              item === '➕' || item === '➖' || item === '✖️' || item === '➗'
                ? 'font-bold text-sky-700 bg-sky-100 text-xl'
                : 'bg-white shadow-sm border border-sky-100'
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  // 2. Pattern Sequence Row
  if (visualType === 'pattern' && visualData.pattern) {
    return (
      <div className="my-4 p-4 bg-amber-50/90 rounded-2xl border-2 border-amber-200 flex flex-wrap items-center justify-center gap-2 sm:gap-3 shadow-inner">
        {visualData.pattern.map((pat, idx) => {
          const isMissing = pat.includes('❓');
          return (
            <div
              key={idx}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center transition-all ${
                isMissing
                  ? 'bg-amber-300 text-amber-900 border-2 border-dashed border-amber-500 animate-pulse shadow-md scale-105'
                  : 'bg-white text-slate-800 border-2 border-amber-100 shadow-sm'
              }`}
            >
              {pat}
            </div>
          );
        })}
      </div>
    );
  }

  // 3. Fraction Visual Pie / Slices
  if (visualType === 'fraction' && visualData.fraction) {
    const { numerator, denominator, label } = visualData.fraction;
    return (
      <div className="my-4 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex flex-col items-center justify-center gap-2 shadow-inner">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            {/* Fraction filled slice */}
            {denominator === 2 && (
              <path d="M50 50 L95 50 A45 45 0 0 1 50 95 Z" fill="#10b981" />
            )}
            {denominator === 4 && (
              <path
                d={
                  numerator === 1
                    ? 'M50 50 L95 50 A45 45 0 0 1 50 95 Z'
                    : 'M50 50 L95 50 A45 45 0 0 1 5 50 Z'
                }
                fill="#10b981"
              />
            )}
            {/* Slices divider lines */}
            <line x1="5" y1="50" x2="95" y2="50" stroke="#ffffff" strokeWidth="2.5" />
            {denominator === 4 && (
              <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeWidth="2.5" />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 px-2 py-0.5 rounded-full text-xs font-bold text-emerald-800 shadow">
              {numerator}/{denominator}
            </span>
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-emerald-800">{label}</span>
      </div>
    );
  }

  // 4. Analog Clock Face
  if (visualType === 'clock' && visualData.clockTime) {
    const { hour, minute } = visualData.clockTime;
    // Calculate angles
    const minuteAngle = minute * 6; // 360 / 60
    const hourAngle = (hour % 12) * 30 + (minute / 60) * 30; // 360 / 12

    return (
      <div className="my-4 p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 flex flex-col items-center justify-center gap-2 shadow-inner">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Clock rim */}
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#0284c7" strokeWidth="4" />
            
            {/* Hour markers */}
            {[12, 3, 6, 9].map((num) => {
              const angles: Record<number, { x: number; y: number }> = {
                12: { x: 50, y: 16 },
                3: { x: 86, y: 54 },
                6: { x: 50, y: 90 },
                9: { x: 14, y: 54 },
              };
              const pos = angles[num];
              return (
                <text
                  key={num}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#0369a1"
                >
                  {num}
                </text>
              );
            })}

            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />

            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 50 50)`}
            />

            {/* Center pin */}
            <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
          </svg>
        </div>
        <span className="text-xs text-sky-700 font-medium">Lihat jarum pendek dan jarum panjangnya!</span>
      </div>
    );
  }

  // 5. Scale Balance (Timbangan Ekuivalen)
  if (visualType === 'scale' && visualData.scaleSides) {
    const { left, right } = visualData.scaleSides;
    return (
      <div className="my-4 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 flex flex-col items-center justify-center gap-3 shadow-inner">
        <div className="w-full max-w-sm flex items-center justify-between gap-4">
          {/* Left Pan */}
          <div className="flex-1 p-3 bg-white rounded-xl border-2 border-purple-300 shadow-sm text-center">
            <span className="text-xs font-bold text-purple-700 block mb-1">Piringan Kiri</span>
            <div className="text-xl sm:text-2xl font-bold flex flex-wrap justify-center gap-1">
              {left.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>

          <div className="text-2xl font-black text-purple-600">⚖️</div>

          {/* Right Pan */}
          <div className="flex-1 p-3 bg-white rounded-xl border-2 border-purple-300 shadow-sm text-center">
            <span className="text-xs font-bold text-purple-700 block mb-1">Piringan Kanan</span>
            <div className="text-xl sm:text-2xl font-bold flex flex-wrap justify-center gap-1">
              {right.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-purple-700 font-semibold bg-purple-100 px-3 py-1 rounded-full">
          Kedua sisi timbangan seimbang sama berat!
        </span>
      </div>
    );
  }

  return null;
};
