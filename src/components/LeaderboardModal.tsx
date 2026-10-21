import React, { useState } from 'react';
import { Trophy, Award, X, Sparkles, Check, User } from 'lucide-react';
import {
  PlayerProfile,
  LeaderboardEntry,
  getLeaderboard,
  BADGES_LIST,
  AVATAR_OPTIONS,
  saveProfile,
} from '../utils/storage';
import { sounds } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (p: PlayerProfile) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'profile'>('leaderboard');
  const [editingName, setEditingName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const leaderboard = getLeaderboard();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const updated: PlayerProfile = {
      ...profile,
      name: editingName.trim() || 'Petualang Cilik',
      avatar: selectedAvatar,
    };
    saveProfile(updated);
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-5 py-4 flex items-center justify-between border-b-2 border-amber-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-900 fill-amber-500 animate-bounce" />
            <div>
              <h3 className="font-display text-xl font-bold text-amber-950">
                Papan Juara & Prestasi
              </h3>
              <p className="text-xs font-medium text-amber-800">
                Rekor bintang dan lencana kehormatan petualang
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-amber-50/80 p-2 gap-1 border-b border-amber-100">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('leaderboard');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Papan Juara
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('badges');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'badges'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Award className="w-4 h-4" />
            Lencana ({profile.unlockedBadges.length}/{BADGES_LIST.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('profile');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <User className="w-4 h-4" />
            Profil Saya
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {/* TAB 1: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-medium px-2 flex justify-between">
                <span>Peringkat & Petualang</span>
                <span>⭐ Bintang · Skor</span>
              </div>
              <div className="space-y-2">
                {leaderboard.map((item: LeaderboardEntry, idx: number) => {
                  const isCurrentPlayer = item.id === profile.id;
                  const rankBadge =
                    idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl flex items-center justify-between border-2 transition-all ${
                        isCurrentPlayer
                          ? 'bg-amber-100/80 border-amber-400 shadow-md scale-101 ring-2 ring-amber-300'
                          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-base w-6 text-center text-slate-700">
                          {rankBadge}
                        </span>
                        <div className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">
                          {item.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-800">
                              {item.name}
                            </span>
                            {isCurrentPlayer && (
                              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                Kamu
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {item.clearedWorlds > 0
                              ? `Tamat ${item.clearedWorlds} Dunia`
                              : 'Pemula Rimba'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-amber-600 text-sm">
                          <span>⭐</span>
                          <span className="tabular-nums">{item.totalStars}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold tabular-nums">
                          {item.totalScore.toLocaleString()} poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BADGES */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES_LIST.map((badge) => {
                const isUnlocked = profile.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-100/60 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                    }`}
                  >
                    <div
                      className={`text-3xl p-2 rounded-2xl flex items-center justify-center ${
                        isUnlocked ? 'bg-amber-200/70 shadow-xs' : 'bg-slate-200'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {badge.name}
                        </h4>
                        {isUnlocked && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight line-clamp-2">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PROFIL SAYA */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Panggilan Petualang:
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Contoh: Dika Pintar"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Karakter Maskot Favoritmu:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedAvatar(av.emoji);
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                        selectedAvatar === av.emoji
                          ? 'bg-amber-200 border-2 border-amber-500 scale-105 shadow-md'
                          : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-3xl">{av.emoji}</span>
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                        {av.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-98 text-amber-950 font-bold text-sm rounded-2xl shadow-md border-b-4 border-amber-600 flex items-center justify-center gap-2 transition-transform"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-700" />
                      Tersimpan Rapi!
                    </>
                  ) : (
                    'Simpan Profil Petualang'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
