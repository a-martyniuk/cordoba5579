"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed this session
    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 8 seconds before showing the banner (don't interrupt first impression)
      setTimeout(() => setVisible(true), 8000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-20 sm:w-80 z-[9990] animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-[#1E2320] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#5F6F52] flex items-center justify-center text-white">
          <Download className="w-5 h-5" />
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Agregar a pantalla de inicio
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Accedé a tu guía del depto sin abrir el navegador
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 w-full bg-[#5F6F52] hover:bg-[#4F5D43] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            Instalar app
          </button>
        </div>
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
