"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LeaveGameButton } from "@/components/LeaveGameButton";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, TEXT_LIGHT } from "@/lib/theme";
import { playAgain } from "@/lib/room";
import type { GameSnapshot, RoomSnapshot } from "@/lib/room";

export function EndScreen({
  roomCode,
  game,
  room,
}: {
  roomCode: string;
  game: GameSnapshot;
  room: RoomSnapshot;
}) {
  const [loading, setLoading] = useState(false);
  const scores = game.scores ?? {};
  const sorted = [...game.playerOrder].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );

  async function handlePlayAgain() {
    setLoading(true);
    try {
      await playAgain(roomCode);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex flex-1 min-h-0 flex-col p-6 pt-10"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <LeaveGameButton roomCode={roomCode} backgroundColor={DARK_BG} />
      <div className="w-full flex justify-center">
        <Logo className="mb-8" />
      </div>
      <h1 className="text-xl font-bold mb-3">Game over</h1>
      <p className="text-sm mb-3 opacity-90">Final scores</p>
      <ul className="space-y-3 mb-8 overflow-visible">
        {sorted.map((id, i) => (
          <li
            key={id}
            className={
              i === 0
                ? "end-screen-gradient-border overflow-visible"
                : "flex items-center justify-between rounded-lg px-4 py-3"
            }
            style={
              i === 0 ? undefined : { backgroundColor: "rgba(255,255,255,0.08)" }
            }
          >
            {i === 0 ? (
              <div className="end-screen-gradient-border-inner flex items-center justify-between rounded-lg px-4 py-3">
                <span className="font-medium">
                  1. {room.playerNames[id] ?? "?"}
                </span>
                <span className="font-bold" style={{ color: ACCENT }}>
                  {scores[id] ?? 0} pts
                </span>
              </div>
            ) : (
              <>
                <span className="font-medium">
                  {i + 1}. {room.playerNames[id] ?? "?"}
                </span>
                <span className="font-bold" style={{ color: ACCENT }}>
                  {scores[id] ?? 0} pts
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handlePlayAgain}
        disabled={loading}
        className="w-full rounded-lg px-6 py-3 text-center font-medium transition-opacity hover:opacity-90 disabled:opacity-70"
        style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
      >
        {loading ? "Starting…" : "Play again"}
      </button>
    </main>
  );
}
