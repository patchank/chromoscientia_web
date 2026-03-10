"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { endGameForAll, leaveRoom } from "@/lib/room";
import { useTranslations } from "@/lib/i18n";
import { contrastColor, toCssHex } from "@/lib/colorContrast";

/** Exit icon (stroke-only); color via currentColor. */
function ExitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M320,176V136a40,40,0,0,0-40-40H88a40,40,0,0,0-40,40V376a40,40,0,0,0,40,40H280a40,40,0,0,0,40-40V336" />
      <polyline points="384 176 464 256 384 336" />
      <line x1="191" y1="256" x2="464" y2="256" />
    </svg>
  );
}

export function LeaveGameButton({
  roomCode,
  backgroundColor,
}: {
  roomCode: string;
  backgroundColor: string;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const iconColor = contrastColor(toCssHex(backgroundColor));

  const handleLeave = useCallback(async () => {
    setLeaving(true);
    try {
      await endGameForAll(roomCode);
      await leaveRoom(roomCode);
      router.push("/");
    } finally {
      setLeaving(false);
      setConfirmOpen(false);
    }
  }, [roomCode, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-0 shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          color: iconColor,
        }}
        aria-label={t("leaveGame.ariaLabel")}
      >
        <ExitIcon />
      </button>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-dialog-title"
        >
          <div
            className="max-w-sm rounded-xl p-6 shadow-xl"
            style={{ backgroundColor: "#1a1a2e", color: "#E9E0F0" }}
          >
            <h2 id="leave-dialog-title" className="text-lg font-bold mb-2">
              {t("leaveGame.title")}
            </h2>
            <p className="text-sm opacity-90 mb-6">
              {t("leaveGame.message")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg px-4 py-2 font-medium opacity-90 hover:opacity-100"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                {t("leaveGame.cancel")}
              </button>
              <button
                type="button"
                onClick={handleLeave}
                disabled={leaving}
                className="rounded-lg px-4 py-2 font-medium text-black"
                style={{ backgroundColor: "#F87171" }}
              >
                {leaving ? t("leaveGame.leaving") : t("leaveGame.leave")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
