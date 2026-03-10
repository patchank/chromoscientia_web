"use client";

import { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useFooterBackground } from "@/lib/FooterContext";
import { useTranslations } from "@/lib/i18n";
import { FloatingCredits } from "@/components/FloatingCredits";
import { LeaveGameButton } from "@/components/LeaveGameButton";
import { DARK_BG } from "@/lib/theme";

const LOTTIE_SRC = "/gradient-bg.lottie";

export function PlayWaitScreen({
  roomCode,
  describerName,
  message,
}: {
  roomCode: string;
  describerName: string;
  message?: string;
}) {
  const { t } = useTranslations();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotLottieRef = useRef<DotLottie | null>(null);

  const { setBackground } = useFooterBackground();
  const displayMessage = message ?? t("playWait.waitingFor", { name: describerName });
  useEffect(() => {
    setBackground("hidden");
    return () => setBackground(null);
  }, [setBackground]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dotLottie = new DotLottie({
      canvas,
      src: LOTTIE_SRC,
      autoplay: true,
      loop: true,
    });

    dotLottieRef.current = dotLottie;

    return () => {
      dotLottie.destroy();
      dotLottieRef.current = null;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <LeaveGameButton roomCode={roomCode} backgroundColor={DARK_BG} />
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: "block" }}
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="flex w-full justify-center px-2">
          <img
            src="/chromoscientia_logo_white.svg"
            alt="Chromoscientia"
            className="mb-4 h-8 w-auto max-w-full opacity-80"
            width={322}
            height={32}
          />
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {displayMessage}
        </p>
      </div>
      <FloatingCredits />
    </main>
  );
}
