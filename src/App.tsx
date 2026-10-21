import { useState, useEffect, useRef } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { WorldSelectScreen } from './components/WorldSelectScreen';
import { QuizPlayScreen } from './components/QuizPlayScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ParentDashboardModal } from './components/ParentDashboardModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ParticleCanvas, ParticleTrigger } from './components/ParticleCanvas';
import { World, Stage } from './data/adventureData';
import { getProfile, PlayerProfile } from './utils/storage';
import { sounds } from './utils/audio';

export type GameView = 'TITLE' | 'WORLD_SELECT' | 'PLAYING';

export default function App() {
  const [view, setView] = useState<GameView>('TITLE');
  const [activeWorld, setActiveWorld] = useState<World | null>(null);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [profile, setProfile] = useState<PlayerProfile>(() => getProfile());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [isBgmPlaying, setIsBgmPlaying] = useState(sounds.isBgmPlaying);

  const particleTriggerRef = useRef<ParticleTrigger | null>(null);

  // Keyboard shortcut listener for Game Shell craft
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'TITLE' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        sounds.playClick();
        setView('WORLD_SELECT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (muted) {
      setIsBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      sounds.stopBgm();
      setIsBgmPlaying(false);
    } else {
      sounds.startBgm();
      setIsBgmPlaying(true);
    }
  };

  const handleStartGame = () => {
    setView('WORLD_SELECT');
  };

  const handleSelectStage = (world: World, stage: Stage) => {
    setActiveWorld(world);
    setActiveStage(stage);
    setView('PLAYING');
  };

  const handleNextStage = (nextStage: Stage) => {
    setActiveStage(nextStage);
    setView('PLAYING');
  };

  const handleBackToTitle = () => {
    setView('TITLE');
    setActiveWorld(null);
    setActiveStage(null);
  };

  const handleBackToMap = () => {
    setView('WORLD_SELECT');
    setActiveStage(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Particle & Confetti Canvas Overlay */}
      <ParticleCanvas onRef={(trigger) => (particleTriggerRef.current = trigger)} />

      {/* Screen Routing */}
      {view === 'TITLE' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenParentDashboard={() => setIsParentDashboardOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          profile={profile}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          isBgmPlaying={isBgmPlaying}
          onToggleBgm={handleToggleBgm}
        />
      )}

      {view === 'WORLD_SELECT' && (
        <WorldSelectScreen
          profile={profile}
          onSelectStage={handleSelectStage}
          onBackToTitle={handleBackToTitle}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenParentDashboard={() => setIsParentDashboardOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />
      )}

      {view === 'PLAYING' && activeWorld && activeStage && (
        <QuizPlayScreen
          world={activeWorld}
          stage={activeStage}
          profile={profile}
          onUpdateProfile={(p) => setProfile(p)}
          onBackToMap={handleBackToMap}
          onNextStage={handleNextStage}
          particleTrigger={particleTriggerRef.current}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Leaderboard and Badges Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        profile={profile}
        onUpdateProfile={(p) => setProfile(p)}
      />

      {/* Parent Dashboard and Report Modal */}
      <ParentDashboardModal
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        profile={profile}
        onUpdateProfile={(p) => setProfile(p)}
      />

      {/* Install App on Android HP Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
