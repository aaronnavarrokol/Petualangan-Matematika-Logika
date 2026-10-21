export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlockedAt?: string;
}

export interface TopicStat {
  total: number;
  correct: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  totalStars: number;
  stageProgress: Record<string, { stars: number; highScore: number; completedAt: string }>;
  unlockedBadges: string[];
  topicStats: Record<string, TopicStat>;
  totalPlayedSec: number;
  lastPlayed: string;
  comboBest: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  totalStars: number;
  totalScore: number;
  clearedWorlds: number;
  date: string;
}

const STORAGE_KEY_PROFILE = 'mathquest_player_profile_v1';
const STORAGE_KEY_LEADERBOARD = 'mathquest_leaderboard_v1';

export const AVATAR_OPTIONS = [
  { id: 'kancil', label: 'Kancil Jenius', emoji: '🦌' },
  { id: 'robot', label: 'Robot Bimo', emoji: '🤖' },
  { id: 'kucing', label: 'Kucing Cilik', emoji: '🐱' },
  { id: 'singa', label: 'Singa Berani', emoji: '🦁' },
  { id: 'kelinci', label: 'Kelinci Gesit', emoji: '🐰' },
  { id: 'panda', label: 'Panda Bijak', emoji: '🐼' },
  { id: 'burung', label: 'Burung Hantu', emoji: '🦉' },
  { id: 'astronot', label: 'Penyelam Pintar', emoji: '🌟' },
];

export const BADGES_LIST: Badge[] = [
  { id: 'first_star', name: 'Bintang Perdana', desc: 'Meraih bintang pertama dalam petualangan', icon: '⭐' },
  { id: 'addition_pro', name: 'Pakar Berhitung', desc: 'Menyelesaikan Dunia 1 Rimba Berhitung', icon: '🌿' },
  { id: 'multiplication_master', name: 'Jago Samudra', desc: 'Menyelesaikan Dunia 2 Perkalian', icon: '🌊' },
  { id: 'pattern_guru', name: 'Master Pola', desc: 'Menyelesaikan Dunia 3 Kuil Rahasia', icon: '🔮' },
  { id: 'smart_buyer', name: 'Ahli Jam & Uang', desc: 'Menyelesaikan Dunia 4 Lembah Pecahan', icon: '🪙' },
  { id: 'detective_crown', name: 'Detektif Sejati', desc: 'Menyelesaikan Dunia 5 Menara Logika', icon: '👑' },
  { id: 'combo_flame', name: 'Api Beruntun', desc: 'Mencapai combo jawaban benar 5x berturut-turut', icon: '🔥' },
  { id: 'perfect_world', name: 'Bintang Emas 3', desc: 'Mendapat 3 bintang sempurna di suatu babak', icon: '🏆' },
];

export const DEFAULT_PROFILE: PlayerProfile = {
  id: 'player-default',
  name: 'Petualang Cilik',
  avatar: '🦌',
  totalScore: 0,
  totalStars: 0,
  stageProgress: {},
  unlockedBadges: [],
  topicStats: {
    'Aritmatika Dasar': { total: 0, correct: 0 },
    'Perkalian & Pembagian': { total: 0, correct: 0 },
    'Pola & Geometri': { total: 0, correct: 0 },
    'Pecahan & Pengukuran': { total: 0, correct: 0 },
    'Logika & Penalaran': { total: 0, correct: 0 },
  },
  totalPlayedSec: 0,
  lastPlayed: new Date().toISOString(),
  comboBest: 0,
};

// Seed initial friendly AI bots in leaderboard so the kid can see a lively leaderboard
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'bot-1', name: 'Kiki Kancil', avatar: '🦌', totalStars: 39, totalScore: 3950, clearedWorlds: 5, date: 'Hari Ini' },
  { id: 'bot-2', name: 'Bimo Bot', avatar: '🤖', totalStars: 32, totalScore: 3200, clearedWorlds: 4, date: 'Kemarin' },
  { id: 'bot-3', name: 'Aisyah Juara', avatar: '🐱', totalStars: 24, totalScore: 2480, clearedWorlds: 3, date: '2 hari lalu' },
  { id: 'bot-4', name: 'Kenzo Pintar', avatar: '🦁', totalStars: 18, totalScore: 1800, clearedWorlds: 2, date: '3 hari lalu' },
  { id: 'bot-5', name: 'Nadia Ceria', avatar: '🐰', totalStars: 12, totalScore: 1220, clearedWorlds: 2, date: 'Minggu ini' },
];

export const getProfile = (): PlayerProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_PROFILE;
};

export const saveProfile = (profile: PlayerProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    updateLeaderboardWithPlayer(profile);
  } catch {
    // Ignore
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  // Initialize default
  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(DEFAULT_LEADERBOARD));
  return DEFAULT_LEADERBOARD;
};

export const updateLeaderboardWithPlayer = (profile: PlayerProfile) => {
  try {
    const list = getLeaderboard();
    const existingIndex = list.findIndex(e => e.id === profile.id);

    // Count cleared worlds
    const stageKeys = Object.keys(profile.stageProgress);
    const clearedWorldsCount = Math.min(5, Math.floor(stageKeys.length / 3));

    const entry: LeaderboardEntry = {
      id: profile.id,
      name: profile.name || 'Petualang Cilik',
      avatar: profile.avatar || '🦌',
      totalStars: profile.totalStars,
      totalScore: profile.totalScore,
      clearedWorlds: clearedWorldsCount,
      date: 'Baru saja',
    };

    if (existingIndex >= 0) {
      list[existingIndex] = entry;
    } else {
      list.push(entry);
    }

    // Sort by stars descending, then score descending
    list.sort((a, b) => {
      if (b.totalStars !== a.totalStars) {
        return b.totalStars - a.totalStars;
      }
      return b.totalScore - a.totalScore;
    });

    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(list));
  } catch {
    // Catch
  }
};

export const resetProfile = () => {
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  return DEFAULT_PROFILE;
};
