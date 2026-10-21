import React, { useState } from 'react';
import { ShieldCheck, Printer, RotateCcw, X, CheckCircle2, BookOpen, HeartHandshake } from 'lucide-react';
import { PlayerProfile, resetProfile, saveProfile } from '../utils/storage';
import { getTotalPossibleStars } from '../data/adventureData';
import { sounds } from '../utils/audio';

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (p: PlayerProfile) => void;
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  // Gate authentication so children don't easily enter
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateQuestion, setGateQuestion] = useState({ a: 7, b: 8, answer: 56 });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'certificate' | 'tips'>('analytics');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const totalPossibleStars = getTotalPossibleStars();

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateInput.trim(), 10) === gateQuestion.answer) {
      sounds.playCorrect();
      setIsUnlocked(true);
      setGateError(false);
    } else {
      sounds.playWrong();
      setGateError(true);
      // New gate question
      const newA = Math.floor(Math.random() * 5) + 6; // 6-10
      const newB = Math.floor(Math.random() * 5) + 6;
      setGateQuestion({ a: newA, b: newB, answer: newA * newB });
      setGateInput('');
    }
  };

  const handleReset = () => {
    sounds.playClick();
    const fresh = resetProfile();
    saveProfile(fresh);
    onUpdateProfile(fresh);
    setShowResetConfirm(false);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  // Calculate totals
  let totalAttempted = 0;
  let totalCorrect = 0;
  Object.values(profile.topicStats || {}).forEach((t) => {
    totalAttempted += t.total;
    totalCorrect += t.correct;
  });
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col max-h-[92vh] print:max-w-none print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-teal-600 px-5 py-4 flex items-center justify-between text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-200" />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold">
                Pojok Laporan Orang Tua
              </h3>
              <p className="text-xs text-sky-100">
                Pantau kemajuan belajar & analisis penguasaan logika anak
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-transform active:scale-90"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        {!isUnlocked ? (
          // GATE AUTHENTICATION
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-sky-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
              🔒
            </div>
            <h4 className="font-display text-lg font-bold text-slate-800">
              Verifikasi Khusus Orang Tua / Wali
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Untuk melindungi pengaturan dan melihat laporan belajar ananda, jawablah perkalian sederhana ini:
            </p>

            <form onSubmit={handleVerifyGate} className="max-w-xs mx-auto space-y-3 pt-2">
              <div className="p-3 bg-sky-50 rounded-2xl border-2 border-sky-200 text-lg font-black text-sky-900">
                {gateQuestion.a} × {gateQuestion.b} = ?
              </div>
              <input
                type="number"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="Tuliskan jawaban..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-center font-bold text-lg"
              />
              {gateError && (
                <p className="text-xs font-semibold text-rose-500">
                  Jawaban belum tepat, silakan coba lagi.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow transition-transform"
              >
                Buka Laporan Orang Tua
              </button>
            </form>
          </div>
        ) : (
          // UNLOCKED DASHBOARD
          <>
            {/* Tabs */}
            <div className="flex bg-sky-50/80 p-2 gap-1 border-b border-sky-100 print:hidden">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('analytics');
                }}
                className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-sky-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Kemampuan & Topik
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('certificate');
                }}
                className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'certificate'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-sky-100'
                }`}
              >
                <Printer className="w-4 h-4" />
                Sertifikat Penghargaan
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('tips');
                }}
                className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'tips'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-sky-100'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                Tips Belajar di Rumah
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: ANALYTICS & TOPICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                      <span className="text-[11px] font-semibold text-amber-800 block">Bintang Diraih</span>
                      <div className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
                        ⭐ {profile.totalStars} <span className="text-xs text-amber-700 font-normal">/ {totalPossibleStars}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <span className="text-[11px] font-semibold text-emerald-800 block">Akurasi Jawaban</span>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                        {overallAccuracy}%
                      </div>
                    </div>
                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-center">
                      <span className="text-[11px] font-semibold text-sky-800 block">Soal Terjawab</span>
                      <div className="text-xl sm:text-2xl font-black text-sky-600 mt-0.5">
                        {totalAttempted}
                      </div>
                    </div>
                  </div>

                  {/* Topic Progress Bars */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      Tingkat Penguasaan per Bidang Topik:
                    </h5>

                    {Object.entries(profile.topicStats || {}).map(([topic, stat]) => {
                      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                      return (
                        <div key={topic} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{topic}</span>
                            <span>
                              {stat.correct}/{stat.total} Benar ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-400 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reset confirmation */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Mulai petualangan baru untuk anak lain?</span>
                    {!showResetConfirm ? (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Data
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleReset}
                          className="text-xs font-bold bg-rose-600 text-white px-3 py-1 rounded-xl shadow hover:bg-rose-700"
                        >
                          Ya, Hapus
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="text-xs font-semibold text-slate-600 px-2 py-1"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CERTIFICATE OF ACHIEVEMENT */}
              {activeTab === 'certificate' && (
                <div className="space-y-4">
                  <div className="border-4 border-double border-amber-400 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-6 rounded-3xl text-center space-y-3 relative shadow-md">
                    <div className="text-3xl">🏅</div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-amber-700 block">
                      Sertifikat Kelulusan Petualang Matematika
                    </span>
                    <h2 className="font-display text-2xl font-black text-sky-950">
                      {profile.name || 'Petualang Cilik'}
                    </h2>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Telah menunjukkan ketekunan, kecerdikan, dan semangat pantang menyerah dalam memecahkan teka-teki logika & matematika petualangan.
                    </p>

                    <div className="pt-2 flex justify-center items-center gap-4 text-xs font-bold text-slate-700">
                      <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
                        ⭐ {profile.totalStars} Bintang Emas
                      </div>
                      <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
                        🎯 {overallAccuracy}% Akurasi
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-end border-t border-amber-200/60 text-[10px] text-slate-500 px-4">
                      <div className="text-left">
                        <span className="block font-semibold">Karakter Favorit:</span>
                        <span className="text-base">{profile.avatar}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-semibold">Tanda Tangan Maskot:</span>
                        <span className="font-display font-bold text-sky-700 text-xs">Kiki & Bimo ✨</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center print:hidden">
                    <button
                      onClick={handlePrintCertificate}
                      className="py-2.5 px-5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak / Simpan PDF Sertifikat
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: PARENTING TIPS */}
              {activeTab === 'tips' && (
                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-1">
                    <h5 className="font-bold text-sky-900 flex items-center gap-1.5">
                      <span>🍎</span> 1. Matematika Nyata di Meja Makan
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Ajak anak membagi kue, buah, atau biskuit sama rata kepada anggota keluarga (konsep pembagian dan pecahan 1/2, 1/4 secara konkret).
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span>🕒</span> 2. Rutinitas Membaca Jam
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Tanyakan waktu saat jadwal mandi, makan, atau bermain menggunakan jam dinding analog, bukan hanya melihat angka digital di HP.
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <span>🪙</span> 3. Simulasi Belanja Warung
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Beri kesempatan anak membayar dan menghitung uang kembalian sederhana saat membeli roti atau susu di minimarket/warung dekat rumah.
                    </p>
                  </div>

                  <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                    <h5 className="font-bold text-purple-900 flex items-center gap-1.5">
                      <span>💡</span> 4. Apresiasi Proses, Bukan Hanya Skor
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Saat ananda salah menjawab, ajak melihat tombol "Penjelasan" bersama. Katakan: "Bagus sekali sudah berani mencoba, yuk kita cari tahu solusinya bareng Kiki!"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
