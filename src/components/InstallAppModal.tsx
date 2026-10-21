import React, { useState } from 'react';
import { Smartphone, Download, X, Copy, Check, ExternalLink, Sparkles, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  if (!isOpen) return null;

  // Use the shared pre app URL or current window location
  const appUrl = window.location.href.includes('ais-dev')
    ? 'https://ais-pre-bztqpqqqmuytx4pesnbysg-487743888473.asia-east1.run.app'
    : window.location.href;

  const handleCopyLink = () => {
    sounds.playClick();
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    sounds.playClick();
    if (isInstallable) {
      const res = await install();
      if (res) {
        sounds.playVictory();
        onClose();
      }
    }
  };

  // Generate clean inline QR code SVG representation using Google Charts API or quick SVG QR
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=0284c7`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-emerald-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold">
                Instal Game di HP Android
              </h3>
              <p className="text-xs text-emerald-100">
                Mainkan di layar penuh, tanpa kuota berlebih & seperti aplikasi native
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

        {/* Tab switch: PWA Langsung vs Build APK Google Play */}
        <div className="flex bg-emerald-50/80 p-2 gap-1 border-b border-emerald-100">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('pwa');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pwa'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Instal Langsung di HP (PWA)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('apk');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Download className="w-4 h-4" />
            Paket APK / Play Store
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'pwa' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Direct install button if browser triggers beforeinstallprompt */}
              {isInstallable && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Browser Mendukung 1-Klik:
                  </span>
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Pasang Sekarang ke Layar Utama
                  </button>
                </div>
              )}

              {isInstalled && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-2xl text-center flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  Aplikasi telah terpasang di perangkat Anda!
                </div>
              )}

              {/* Step by step for Android HP */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>📱</span> Cara Pasang di HP Android (Sangat Mudah & Cepat):
                </h4>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">Buka link game di browser Chrome di HP Anda</p>
                      <p className="text-xs text-slate-500">Scan QR Code di bawah atau salin link ke WhatsApp</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">Ketuk ikon Menu Titik Tiga (⋮) di pojok kanan atas Chrome</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">
                        Pilih <span className="text-emerald-700 font-bold">"Instal aplikasi"</span> atau <span className="text-emerald-700 font-bold">"Tambahkan ke Layar Utama"</span>
                      </p>
                      <p className="text-xs text-slate-500">Game akan otomatis terpasang dengan ikon Kiki di layar beranda HP Anda!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code and Copy Link Card */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-xs border border-sky-100 shrink-0">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Buka di HP"
                    className="w-28 h-28 object-contain"
                  />
                  <span className="text-[10px] text-center block text-slate-400 font-bold mt-1">
                    Scan Kamera HP
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <span className="text-xs font-bold text-sky-900 block">
                    Link Game Petualangan:
                  </span>
                  <div className="p-2 bg-white rounded-xl border border-sky-200 text-[11px] font-mono text-slate-600 truncate select-all">
                    {appUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto py-2 px-4 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Link Berhasil Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Salin Link ke WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* iOS notice */}
              {isIOS && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <strong>Untuk iPhone/iPad:</strong> Ketuk tombol <em>Share</em> di Safari bawah, lalu gulir dan ketuk <em>"Add to Home Screen"</em>.
                </div>
              )}
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Important 404 Explanation Box */}
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                  <span>ℹ️</span> Kenapa Muncul 404 saat Cek di PWABuilder?
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Link <code>ais-pre-...run.app</code> adalah <strong>lingkungan preview privat Google AI Studio</strong> yang dilindungi otentikasi akun Google Anda. Bot eksternal (seperti server PWABuilder) ditolak aksesnya oleh Google Cloud, sehingga memunculkan pesan <em>404 Not Found</em>.
                </p>
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950">
                  💡 <strong>Kabar Baik:</strong> Anda tidak memerlukan PWABuilder sama sekali untuk menginstal game ini di HP Android!
                </div>
              </div>

              {/* Native WebAPK explanation */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2.5">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <span>🚀</span> Solusi Instan di Android: Fitur WebAPK Otomatis
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Google Chrome di Android memiliki teknologi bawaan bernama <strong>WebAPK</strong>. Saat Anda membuka link game di Chrome HP dan memilih <strong>"Instal aplikasi"</strong>:
                </p>
                <ul className="text-xs text-emerald-950 space-y-1.5 pl-4 list-disc font-medium">
                  <li>Android akan secara otomatis membuat paket APK native di HP Anda.</li>
                  <li>Ikon game muncul di laci aplikasi (App Drawer) dan home screen.</li>
                  <li>Bisa dibuka full-screen tanpa address bar browser, lancar, dan mendukung offline!</li>
                </ul>
              </div>

              {/* Build APK Offline instructions */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Opsi: Build APK Mandiri di Komputer (Google Bubblewrap / CLI):
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika Anda ingin file <code>.apk</code> murni untuk diunggah ke Google Play Store, gunakan tool resmi Google <strong>Bubblewrap CLI</strong> di terminal komputer Anda:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto select-all">
                  <div>npm install -g @bubblewrap/cli</div>
                  <div>bubblewrap init --manifest=dist/manifest.webmanifest</div>
                  <div>bubblewrap build</div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Perintah di atas akan langsung menghasilkan file <code>app-release-signed.apk</code> di folder proyek Anda.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
