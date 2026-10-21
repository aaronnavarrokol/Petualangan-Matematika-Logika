import React, { useState } from 'react';
import { ArrowLeft, Star, Play, Sparkles, Trophy, ShieldCheck, Smartphone } from 'lucide-react';
import { WORLDS, World, Stage } from '../data/adventureData';
import { PlayerProfile } from '../utils/storage';
import { sounds } from '../utils/audio';

interface WorldSelectScreenProps {
  profile: PlayerProfile;
  onSelectStage: (world: World, stage: Stage) => void;
  onBackToTitle: () => void;
  onOpenLeaderboard: () => void;
  onOpenParentDashboard: () => void;
  onOpenInstallModal: () => void;
}

export const WorldSelectScreen: React.FC<WorldSelectScreenProps> = ({
  profile,
  onSelectStage,
  onBackToTitle,
  onOpenLeaderboard,
  onOpenParentDashboard,
  onOpenInstallModal,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-1');

  const selectedWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];

  // Helper to count stars earned in a world
  const getWorldStars = (world: World): number => {
    let sum = 0;
    world.stages.forEach((s) => {
      const prog = profile.stageProgress[s.id];
      if (prog) sum += prog.stars;
    });
    return sum;
  };

  const maxWorldStars = (world: World): number => {
    return world.stages.reduce((acc, s) => acc + s.targetStars, 0);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col justify-between">
      {/* Top Navigation HUD */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            onClick={() => {
              sounds.playClick();
              onBackToTitle();
            }}
            className="flex items-center gap-1.5 py-2 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Menu Utama</span>
          </button>

          {/* Player stats */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-2xl border border-amber-300 font-bold text-amber-900 text-xs sm:text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="tabular-nums">{profile.totalStars}</span>
              <span className="text-[10px] text-amber-700">Bintang</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-sky-100 px-3 py-1.5 rounded-2xl border border-sky-300 font-bold text-sky-900 text-xs sm:text-sm">
              <span className="tabular-nums">{profile.totalScore.toLocaleString()}</span>
              <span className="text-[10px] text-sky-700">Poin</span>
            </div>
          </div>

          {/* Quick modals triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenInstallModal();
              }}
              className="p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1"
              title="Instal / Main di HP Android"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline text-[11px]">Pasang di HP</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLeaderboard();
              }}
              className="p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all"
              title="Papan Juara"
            >
              <Trophy className="w-4 h-4 text-amber-600 fill-amber-400" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenParentDashboard();
              }}
              className="p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all"
              title="Pojok Ortu"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Title & World Selector horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800">
              Pilih Wilayah Petualangan
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              5 Wilayah Tersedia
            </span>
          </div>

          {/* Horizontal Realm Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {WORLDS.map((world) => {
              const isSelected = world.id === selectedWorldId;
              const stars = getWorldStars(world);
              const maxStars = maxWorldStars(world);

              return (
                <button
                  key={world.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedWorldId(world.id);
                  }}
                  className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-amber-400 shadow-md ring-3 ring-amber-300 scale-102'
                      : 'bg-white/80 hover:bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{world.badge}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Dunia {world.number}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 leading-tight">
                    {world.name.replace('Pulau ', '').replace('Samudra ', '').replace('Kuil ', '').replace('Lembah ', '').replace('Menara ', '')}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-amber-600">
                    <span className="flex items-center gap-0.5">
                      ⭐ {stars}/{maxStars}
                    </span>
                    {stars === maxStars && (
                      <span className="text-emerald-600">✓ Penuh</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected World Showcase Banner */}
        <div
          className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-r ${selectedWorld.bgGradient} text-white shadow-lg relative overflow-hidden`}
        >
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Dunia #{selectedWorld.number}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight">
              {selectedWorld.name}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              {selectedWorld.description}
            </p>
          </div>
          <span className="absolute -right-4 -bottom-6 text-8xl sm:text-9xl opacity-20 select-none">
            {selectedWorld.badge}
          </span>
        </div>

        {/* Stages in Selected World */}
        <div className="space-y-3">
          <h4 className="font-display text-lg font-bold text-slate-800">
            Pilih Babak Tantangan:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {selectedWorld.stages.map((stage) => {
              const progress = profile.stageProgress[stage.id];
              const stars = progress?.stars || 0;
              const highScore = progress?.highScore || 0;

              return (
                <div
                  key={stage.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Stage badge and star row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
                        {stage.icon}
                      </div>

                      {/* 3 Stars */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-5 h-5 ${
                              starNum <= stars
                                ? 'text-amber-400 fill-amber-400 drop-shadow'
                                : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-sky-600 block uppercase tracking-wider">
                      Babak {stage.number}
                    </span>
                    <h5 className="font-bold text-base text-slate-800 leading-snug">
                      {stage.name}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {stage.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-semibold bg-slate-50 p-2 rounded-xl">
                      <span>{stage.questions.length} Soal Cerita</span>
                      {highScore > 0 ? (
                        <span className="text-amber-600 font-bold tabular-nums">
                          Skor: {highScore}
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum Main</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectStage(selectedWorld, stage);
                    }}
                    className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow border-b-3 border-emerald-700 flex items-center justify-center gap-2 transition-transform cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {stars > 0 ? 'Main Lagi' : 'Mulai Babak'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-slate-500 border-t border-slate-200 bg-white">
        Kumpulkan 3 bintang di setiap babak untuk membuka lencana rahasia!
      </footer>
    </div>
  );
};
