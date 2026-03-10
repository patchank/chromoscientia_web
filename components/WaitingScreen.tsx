"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { leaveRoom, startGame } from "@/lib/room";
import { useTranslations } from "@/lib/i18n";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, ERROR, TEXT_LIGHT, WARNING } from "@/lib/theme";
import { useFooterBackground } from "@/lib/FooterContext";
import { FloatingCredits } from "@/components/FloatingCredits";
import type { RoomSnapshot } from "@/lib/room";

export function WaitingScreen({
  roomCode,
  room,
  playerId,
}: {
  roomCode: string;
  room: RoomSnapshot;
  playerId: string;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isHost = room.hostId === playerId;
  const canStart = isHost && room.playerIds.length >= 3;
  const { setBackground } = useFooterBackground();
  useEffect(() => {
    setBackground("hidden");
    return () => setBackground(null);
  }, [setBackground]);

  async function handleLeave() {
    setError("");
    setLoading(true);
    try {
      await leaveRoom(roomCode);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("waiting.failedToLeave"));
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    setError("");
    setLoading(true);
    try {
      await startGame(roomCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("waiting.failedToStart"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col p-6"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <FloatingCredits />
      <div className="w-full flex justify-center">
        <Logo className="mb-4" />
      </div>
      <p className="text-sm mb-6 opacity-90">
        {t("waiting.roomCode")}: <strong className="font-mono">{roomCode}</strong>
      </p>
      <p className="text-sm mb-2 opacity-90">{t("waiting.playersCount", { count: room.playerIds.length })}</p>
      <ul className="list-disc list-inside mb-6 opacity-90">
        {room.playerIds.map((id) => (
          <li key={id}>
            {room.playerNames[id] ?? t("waiting.unknown")}
            {id === room.hostId && ` ${t("waiting.host")}`}
          </li>
        ))}
      </ul>
      {room.playerIds.length < 3 && (
        <p className="text-sm mb-4" style={{ color: WARNING }}>
          {t("waiting.needMinPlayers")}
        </p>
      )}
      {error && (
        <p className="text-sm mb-4" style={{ color: ERROR }}>{error}</p>
      )}
      {canStart && (
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
        >
          {loading ? t("waiting.starting") : t("waiting.startGame")}
        </button>
      )}
      <button
        type="button"
        onClick={handleLeave}
        disabled={loading}
        className="mt-6 text-sm underline hover:opacity-80 disabled:opacity-50"
        style={{ color: ACCENT }}
      >
        {t("waiting.leaveRoom")}
      </button>
    </main>
  );
}
