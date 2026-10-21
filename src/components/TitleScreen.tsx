import React from 'react';
import { Play, Trophy, ShieldCheck, Volume2, VolumeX, Music, Sparkles, Smartphone } from 'lucide-react';
import { Mascot } from './Mascot';
import { PlayerProfile } from '../utils/storage';
import { sounds } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenParentDashboard: () => void;
  onOpenInstallModal: () => void;
  profile: PlayerProfile;
  isMuted: boolean;
  onToggleSound: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLeaderboard,
  onOpenParentDashboard,
  onOpenInstallModal,
  profile,
  isMuted,
  onToggleSound,
  isBgmPlaying,
  onToggleBgm,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100">
      {/* Decorative sky clouds and cheerful floating math symbols */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-35">
        <span className="absolute top-10 left-[8%] text-5xl animate-float">☁️</span>
        <span className="absolute top-24 right-[12%] text-6xl animate-float" style={{ animationDelay: '1.2s' }}>☁️</span>
        <span className="absolute bottom-28 left-[15%] text-4xl animate-float" style={{ animationDelay: '2s' }}>🌱</span>
        <span className="absolute top-1/3 left-[5%] text-3xl font-black text-amber-500/80">➕</span>
        <span className="absolute top-1/4 right-[8%] text-3xl font-black text-sky-600/80">✖️</span>
        <span className="absolute bottom-1/3 right-[10%] text-4xl font-black text-emerald-500/80">➗</span>
        <span className="absolute bottom-1/4 left-[10%] text-3xl font-black text-purple-500/80">🟰</span>
      </div>

      {/* Top Bar Status Zone */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Player Profile Quick Pill */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLeaderboard();
          }}
          className="flex items-center gap-2 bg-white/90 hover:bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border-2 border-amber-300 transition-transform active:scale-95"
          title="Lihat Profil & Prestasi"
        >
          <span className="text-xl sm:text-2xl p-0.5">{profile.avatar}</span>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {profile.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
              <span>⭐</span>
              <span className="tabular-nums">{profile.totalStars}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 tabular-nums">{profile.totalScore} poin</span>
            </div>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Install on Mobile HP Button in Header */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenInstallModal();
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 sm:px-3 py-2 rounded-2xl shadow-md border-2 border-emerald-400 text-xs font-bold transition-all"
            title="Instal / Main di HP Android"
          >
            <Smartphone className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Instal di HP</span>
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleBgm();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 border-2 ${
              isBgmPlaying
                ? 'bg-amber-400 border-amber-500 text-amber-950'
                : 'bg-white/80 border-slate-200 text-slate-500'
            }`}
            title={isBgmPlaying ? 'Matikan Musik' : 'Bunyikan Musik Ceria'}
            aria-label="Musik Latar"
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 border-2 ${
              !isMuted
                ? 'bg-emerald-400 border-emerald-500 text-emerald-950'
                : 'bg-white/80 border-slate-200 text-slate-500'
            }`}
            title={!isMuted ? 'Suara Efek Aktif' : 'Suara Efek Nonaktif'}
            aria-label="Efek Suara"
          >
            {!isMuted ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Parent Portal */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenParentDashboard();
            }}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-2.5 sm:px-3 py-2 rounded-2xl shadow-md border-2 border-sky-400 text-xs font-bold transition-all"
            title="Pojok Orang Tua"
          >
            <ShieldCheck className="w-4 h-4 text-sky-200" />
            <span className="hidden md:inline">Pojok Ortu</span>
          </button>
        </div>
      </header>

      {/* Main Title Centerpiece */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto text-center flex flex-col items-center justify-center py-4">
        {/* Animated Double Mascots */}
        <div className="flex items-end justify-center gap-4 sm:gap-8 mb-4">
          <Mascot
            character="kiki"
            mood="happy"
            size="md"
            speechText="Halo Petualang! Ayo kita taklukkan angka!"
          />
          <Mascot
            character="bimo"
            mood="celebrate"
            size="md"
            speechText="Bip! Siap bermain!"
          />
        </div>

        {/* Grand Typography Logo Lockup */}
        <div className="relative mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-400/90 text-amber-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-xs border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Game Edukasi Anak Cerdas
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black text-sky-900 tracking-tight leading-tight drop-shadow-sm">
            Petualangan <br />
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Matematika
            </span>{' '}
            &{' '}
            <span className="text-emerald-600">
              Logika
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 max-w-md mx-auto">
            Jelajahi 5 Dunia Ajaib, kumpulkan bintang emas, pecahkan teka-teki, dan jadilah juara matematika!
          </p>
        </div>

        {/* Primary Action Start Button */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => {
              sounds.playClick();
              sounds.playCorrect();
              onStartGame();
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-emerald-950 font-display text-xl sm:text-2xl font-black rounded-3xl shadow-xl border-b-6 border-emerald-600 flex items-center justify-center gap-3 transition-transform cursor-pointer glow-gold"
          >
            <Play className="w-7 h-7 fill-emerald-950" />
            Mulai Petualangan!
          </button>

          {/* Secondary Action: Leaderboard */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="w-full py-3 px-5 bg-white hover:bg-amber-50 active:scale-95 text-amber-900 font-bold text-sm sm:text-base rounded-2xl shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
            Papan Juara & Prestasi
          </button>

          {/* Tertiary Action: Install / Run on Android HP */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenInstallModal();
            }}
            className="w-full py-2.5 px-4 bg-emerald-100/90 hover:bg-emerald-200 active:scale-95 text-emerald-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xs border-2 border-emerald-300 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            📱 Instal / Main di HP Android
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 text-center py-2 text-xs text-slate-600 font-medium">
        <span>Cocok untuk siswa SD Kelas 1-6 & didampingi orang tua di rumah</span>
      </footer>
    </div>
  );
};
