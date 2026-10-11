import React, { useState, useEffect } from 'react'
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react'

const DISMISS_KEY = 'kilastugas_install_dismissed_until'
const DISMISS_DURATION_DAYS = 3

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isApple, setIsApple] = useState(false)

  useEffect(() => {
    // 1. Cek apakah sudah berjalan dalam mode standalone (sudah terinstal)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true

    if (isStandalone) return

    // 2. Cek apakah user sudah menutup notifikasi baru-baru ini
    const dismissedUntil = localStorage.getItem(DISMISS_KEY)
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return
    }

    // 3. Deteksi Apple (iOS / iPadOS)
    const ua = navigator.userAgent || ''
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (isIOSDevice) {
      setIsApple(true)
      // Tampilkan banner panduan iOS setelah delay singkat agar tidak mengganggu render awal
      const timer = setTimeout(() => setShowBanner(true), 1200)
      return () => clearTimeout(timer)
    }

    // 4. Deteksi Non-Apple (Android / Desktop Chrome / Edge via beforeinstallprompt)
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Deteksi jika user sudah menginstal saat prompt berjalan
    const handleAppInstalled = () => {
      setShowBanner(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    const expiry = Date.now() + DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000
    localStorage.setItem(DISMISS_KEY, String(expiry))
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  if (!showBanner) return null

  return (
    <aside
      aria-label="Pemberitahuan instalasi aplikasi"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-[#18181B] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-zinc-800 flex flex-col gap-3 font-sans">
        {/* Header bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/logo-192.png" alt="Logo KilasTugas" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100 tracking-tight leading-tight">
                {isApple ? 'Pasang di iPhone / iPad' : 'Pasang Aplikasi KilasTugas'}
              </h4>
              <p className="text-[11px] text-zinc-400">Akses instan & micro-pacing 100% offline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Tutup notifikasi instalasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Action based on Platform */}
        {isApple ? (
          // Apple (iOS Safari) Guidance
          <div className="space-y-2 pt-1 border-t border-zinc-800/80">
            <p className="text-xs text-zinc-300 leading-relaxed">
              Pasang ke Layar Utama dalam 2 langkah mudah:
            </p>
            <ol className="text-xs text-zinc-400 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded-md">1</span>
                <span>Ketuk ikon <strong>Bagikan</strong> (<Share className="w-3.5 h-3.5 inline text-sky-400 -mt-0.5" /> <em>Share</em>) di bilah Safari.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded-md">2</span>
                <span>Pilih <strong>Tambahkan ke Layar Utama</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 -mt-0.5" />).</span>
              </li>
            </ol>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition active:scale-95 cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        ) : (
          // Android / Chrome / Windows / Mac Non-Safari (1-click Install Prompt)
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
            <span className="text-xs text-zinc-300">
              Pasang langsung tanpa unduh lewat toko aplikasi.
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-medium transition cursor-pointer"
              >
                Nanti
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-zinc-900" />
                <span>Instal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
