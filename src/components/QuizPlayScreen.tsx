import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Flame,
  Star,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Home,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { World, Stage } from '../data/adventureData';
import { VisualQuizViewer } from './VisualQuizViewer';
import { Mascot, MascotMood } from './Mascot';
import { PlayerProfile, saveProfile } from '../utils/storage';
import { sounds } from '../utils/audio';
import { ParticleTrigger } from './ParticleCanvas';

interface QuizPlayScreenProps {
  world: World;
  stage: Stage;
  profile: PlayerProfile;
  onUpdateProfile: (p: PlayerProfile) => void;
  onBackToMap: () => void;
  onNextStage?: (nextStage: Stage) => void;
  particleTrigger: ParticleTrigger | null;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const QuizPlayScreen: React.FC<QuizPlayScreenProps> = ({
  world,
  stage,
  profile,
  onUpdateProfile,
  onBackToMap,
  onNextStage,
  particleTrigger,
  isMuted,
  onToggleSound,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotSpeech, setMascotSpeech] = useState<string>('Yuk baca soalnya baik-baik ya!');
  const [isPaused, setIsPaused] = useState(false);
  const [isStageFinished, setIsStageFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [timerLeft, setTimerLeft] = useState<number>(stage.timeLimitSec);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const timerRef = useRef<number | null>(null);
  const currentQuestion = stage.questions[currentQIndex];

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || isPaused || isAnswered || isStageFinished) return;

    timerRef.current = window.setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          // Time out for current question: treat as wrong and show answer
          handleOptionClick(-1, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isPaused, isAnswered, isStageFinished, currentQIndex]);

  // Handle stage completion
  const handleStageComplete = useCallback(() => {
    setIsStageFinished(true);
    setIsTimerActive(false);

    // Calculate stars
    const totalQ = stage.questions.length;
    const accuracy = correctAnswersCount / totalQ;
    let stars = 1;
    if (accuracy >= 0.99) {
      stars = 3;
    } else if (accuracy >= 0.6) {
      stars = 2;
    } else if (accuracy > 0) {
      stars = 1;
    } else {
      stars = 0;
    }
    setEarnedStars(stars);

    // Play triumphant sound
    sounds.playVictory();
    if (particleTrigger) {
      particleTrigger.celebrate();
    }

    // Sequence star sounds
    for (let i = 0; i < stars; i++) {
      setTimeout(() => {
        sounds.playStar(i);
      }, 400 + i * 350);
    }

    // Update player profile
    const existingProg = profile.stageProgress[stage.id];
    const prevStars = existingProg?.stars || 0;
    const prevHigh = existingProg?.highScore || 0;

    const newStarsGained = Math.max(0, stars - prevStars);
    const updatedTotalStars = profile.totalStars + newStarsGained;
    const updatedTotalScore = profile.totalScore + score;

    // Check badges
    const unlocked = [...profile.unlockedBadges];
    const newlyAwarded: string[] = [];

    if (updatedTotalStars >= 1 && !unlocked.includes('first_star')) {
      unlocked.push('first_star');
      newlyAwarded.push('Bintang Perdana');
    }
    if (stars === 3 && !unlocked.includes('perfect_world')) {
      unlocked.push('perfect_world');
      newlyAwarded.push('Bintang Emas 3');
    }
    if (maxCombo >= 5 && !unlocked.includes('combo_flame')) {
      unlocked.push('combo_flame');
      newlyAwarded.push('Api Beruntun 5x');
    }
    if (world.id === 'world-1' && stars >= 1 && !unlocked.includes('addition_pro')) {
      unlocked.push('addition_pro');
      newlyAwarded.push('Pakar Berhitung');
    }
    if (world.id === 'world-2' && stars >= 1 && !unlocked.includes('multiplication_master')) {
      unlocked.push('multiplication_master');
      newlyAwarded.push('Jago Samudra');
    }
    if (world.id === 'world-3' && stars >= 1 && !unlocked.includes('pattern_guru')) {
      unlocked.push('pattern_guru');
      newlyAwarded.push('Master Pola');
    }
    if (world.id === 'world-4' && stars >= 1 && !unlocked.includes('smart_buyer')) {
      unlocked.push('smart_buyer');
      newlyAwarded.push('Ahli Jam & Uang');
    }
    if (world.id === 'world-5' && stars >= 1 && !unlocked.includes('detective_crown')) {
      unlocked.push('detective_crown');
      newlyAwarded.push('Detektif Sejati');
    }

    setNewBadges(newlyAwarded);

    const updatedProfile: PlayerProfile = {
      ...profile,
      totalStars: updatedTotalStars,
      totalScore: updatedTotalScore,
      unlockedBadges: unlocked,
      comboBest: Math.max(profile.comboBest, maxCombo),
      stageProgress: {
        ...profile.stageProgress,
        [stage.id]: {
          stars: Math.max(prevStars, stars),
          highScore: Math.max(prevHigh, score),
          completedAt: new Date().toISOString(),
        },
      },
    };

    saveProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  }, [
    stage,
    world.id,
    correctAnswersCount,
    particleTrigger,
    profile,
    score,
    maxCombo,
    onUpdateProfile,
  ]);

  // Handle click on an option
  const handleOptionClick = (index: number, isTimeout = false) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = !isTimeout && index === currentQuestion.correctIndex;

    // Update topic stats
    const currentTopic = currentQuestion.topic;
    const existingTopicStat = profile.topicStats[currentTopic] || { total: 0, correct: 0 };
    const updatedTopicStats = {
      ...profile.topicStats,
      [currentTopic]: {
        total: existingTopicStat.total + 1,
        correct: existingTopicStat.correct + (isCorrect ? 1 : 0),
      },
    };
    saveProfile({
      ...profile,
      topicStats: updatedTopicStats,
    });
    onUpdateProfile({
      ...profile,
      topicStats: updatedTopicStats,
    });

    if (isCorrect) {
      sounds.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectAnswersCount((prev) => prev + 1);

      if (newCombo >= 2) {
        sounds.playCombo(newCombo);
      }

      // Base score 100 + combo bonus (combo * 20) + time bonus
      const timeBonus = Math.floor(timerLeft * 2);
      const points = 100 + (newCombo - 1) * 25 + timeBonus;
      setScore((prev) => prev + points);

      // Trigger particle burst
      if (particleTrigger) {
        particleTrigger.burst(window.innerWidth / 2, window.innerHeight * 0.45, 32);
      }

      // Mascot reaction
      setMascotMood('happy');
      const praises = [
        'Hebat Sekali! Kamu benar!',
        'Pintar Banget! Jawaban tepat!',
        'Luar Biasa! Teruskan semangatmu!',
        'Juara! Otakmu bekerja cerdas!',
      ];
      setMascotSpeech(praises[Math.floor(Math.random() * praises.length)]);
    } else {
      sounds.playWrong();
      setCombo(0);
      setMascotMood('oops');
      setMascotSpeech(
        isTimeout
          ? 'Waktu habis! Jangan berkecil hati, yuk pelajari solusinya!'
          : 'Hampir tepat! Periksa penjelasannya ya.'
      );
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentQIndex + 1 < stage.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setTimerLeft(stage.timeLimitSec);
      setMascotMood('idle');
      setMascotSpeech('Soal baru telah siap! Semangat ya!');
    } else {
      // Finished all questions in this stage
      handleStageComplete();
    }
  };

  const handleRestartStage = () => {
    sounds.playClick();
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectAnswersCount(0);
    setTimerLeft(stage.timeLimitSec);
    setIsPaused(false);
    setIsStageFinished(false);
    setMascotMood('idle');
    setMascotSpeech('Mulai lagi dengan semangat baru!');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 select-none">
      {/* TOP HUD BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-3 sm:px-4 py-2.5 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Pause / Back button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsPaused(true);
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
            title="Jeda Permainan"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stage name & progress */}
          <div className="flex-1 max-w-xs text-center">
            <span className="text-[11px] font-bold text-sky-700 block uppercase tracking-wider">
              {world.badge} {stage.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Soal {currentQIndex + 1}/{stage.questions.length}
              </span>
              <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQIndex + (isAnswered ? 1 : 0)) / stage.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Score & Combo */}
          <div className="flex items-center gap-2">
            {combo >= 2 && (
              <div className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2 py-1 rounded-xl font-bold text-xs animate-bounce shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-amber-900" />
                <span>{combo}x</span>
              </div>
            )}

            <div className="bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm tabular-nums">
              {score}
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-90"
              title="Efek Suara"
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        {isTimerActive && !isStageFinished && (
          <div className="max-w-2xl mx-auto mt-1 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timerLeft <= 10 ? 'bg-rose-500' : 'bg-sky-400'
              }`}
              style={{ width: `${(timerLeft / stage.timeLimitSec) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* MAIN PLAYING FIELD */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        {/* Question Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-sky-200 shadow-md relative overflow-hidden">
          {/* Header topic chip */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {currentQuestion.topic} · {currentQuestion.gradeLevel}
            </span>

            {/* Hint Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowHint(!showHint);
                setMascotMood('thinking');
                setMascotSpeech('Kiki beri petunjuk ya! Klik petunjuknya di bawah.');
              }}
              className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Bantuan Kiki</span>
            </button>
          </div>

          {/* Title & Story */}
          <h3 className="font-display text-lg sm:text-xl font-black text-slate-800 leading-snug">
            {currentQuestion.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {currentQuestion.story}
          </p>

          {/* Visual Learning Aid (icons, pattern, fraction pie, clock, scale) */}
          <VisualQuizViewer question={currentQuestion} />

          {/* Friendly Hint Box */}
          {showHint && (
            <div className="my-3 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs font-semibold text-amber-900 flex items-start gap-2 animate-fade-in shadow-inner">
              <span className="text-base">💡</span>
              <div className="flex-1">
                <span className="font-bold block">Petunjuk Pintar:</span>
                <span>{currentQuestion.hint}</span>
              </div>
            </div>
          )}

          {/* Core Question Prompt */}
          <div className="mt-3 p-3 bg-sky-50/80 rounded-2xl border-2 border-sky-100 font-bold text-sm sm:text-base text-sky-950 text-center">
            {currentQuestion.question}
          </div>

          {/* Multiple Choice Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {currentQuestion.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-sky-50 text-slate-800 border-2 border-slate-200 active:scale-98';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-400 border-2 border-emerald-600 text-emerald-950 shadow-md font-black scale-102';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-200 border-2 border-rose-400 text-rose-950 line-through opacity-75';
                } else {
                  btnStyle = 'bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(idx)}
                  className={`min-h-[58px] p-3.5 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-xs font-bold text-slate-700">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                  )}
                  {isAnswered && isChosen && !isCorrect && (
                    <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation drawer when answered */}
          {isAnswered && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 animate-fade-in space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pembahasan & Cara Berhitung:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Mascot & Next Question Action Zone */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-3">
            <Mascot
              character="kiki"
              mood={mascotMood}
              speechText={mascotSpeech}
              size="sm"
            />
          </div>

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-display text-base font-black rounded-2xl shadow-lg border-b-4 border-emerald-700 flex items-center gap-2 transition-transform cursor-pointer animate-bounce"
            >
              <span>
                {currentQIndex + 1 < stage.questions.length ? 'Soal Berikutnya' : 'Lihat Hasil!'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl border-4 border-sky-300 space-y-4">
            <div className="text-4xl">⏸️</div>
            <h3 className="font-display text-xl font-bold text-slate-800">
              Petualangan Dijeda
            </h3>
            <p className="text-xs text-slate-600">
              Santai dulu sejenak! Kiki dan Bimo menunggumu di sini.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl shadow transition-transform active:scale-98"
              >
                Lanjutkan Bermain
              </button>
              <button
                onClick={handleRestartStage}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Babak Ini
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToMap();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali ke Peta Dunia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY / STAGE FINISHED MODAL */}
      {isStageFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 text-center shadow-2xl border-4 border-amber-300 space-y-4 relative overflow-hidden">
            {/* Top Ribbon */}
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              ✨ Babak Selesai!
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-800">
              {earnedStars === 3
                ? 'Sempurna! Bintang 3!'
                : earnedStars >= 1
                ? 'Hebat, Kamu Berhasil!'
                : 'Bagus, Terus Berlatih!'}
            </h3>

            {/* 3 Animated Stars Showcase */}
            <div className="flex justify-center items-center gap-3 py-3">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= earnedStars;
                return (
                  <div
                    key={starIdx}
                    className={`relative transform transition-all duration-500 ${
                      isEarned ? 'animate-star-pop' : 'opacity-30 scale-90'
                    }`}
                    style={{ animationDelay: `${(starIdx - 1) * 300}ms` }}
                  >
                    <Star
                      className={`w-14 h-14 ${
                        isEarned
                          ? 'text-amber-400 fill-amber-400 drop-shadow-lg'
                          : 'text-slate-300 fill-slate-200'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Score & Summary Grid */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">Benar</span>
                <span className="text-base font-bold text-emerald-600">
                  {correctAnswersCount}/{stage.questions.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">Combo Terbaik</span>
                <span className="text-base font-bold text-amber-600">
                  🔥 {maxCombo}x
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">Skor Babak</span>
                <span className="text-base font-black text-sky-600 tabular-nums">
                  +{score}
                </span>
              </div>
            </div>

            {/* Newly awarded badges */}
            {newBadges.length > 0 && (
              <div className="p-3 bg-amber-100 rounded-2xl border border-amber-300 text-xs font-bold text-amber-900 flex items-center justify-center gap-2">
                <span>🏆 Lencana Baru Diraih:</span>
                <span className="text-amber-800 underline">{newBadges.join(', ')}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  // Check next stage in the same world
                  const currentIdx = world.stages.findIndex((s) => s.id === stage.id);
                  if (currentIdx >= 0 && currentIdx + 1 < world.stages.length && onNextStage) {
                    onNextStage(world.stages[currentIdx + 1]);
                  } else {
                    onBackToMap();
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-emerald-950 font-display text-base font-black rounded-2xl shadow-md border-b-4 border-emerald-600 active:scale-98 transition-transform cursor-pointer"
              >
                {world.stages.findIndex((s) => s.id === stage.id) + 1 < world.stages.length
                  ? 'Lanjut ke Babak Berikutnya'
                  : 'Pilih Wilayah Lainnya'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRestartStage}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Main Lagi
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onBackToMap();
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  Peta Dunia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
