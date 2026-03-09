"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, TEXT_LIGHT } from "@/lib/theme";
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
  const scores = game.scores ?? {};
  const sorted = [...game.playerOrder].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );
  const winnerId = sorted[0];
  const winnerName = winnerId ? room.playerNames[winnerId] ?? "?" : "?";

  return (
    <main
      className="flex min-h-screen flex-col p-6"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <div className="w-full flex justify-center">
        <Logo className="mb-4" />
      </div>
      <h1 className="text-xl font-bold mb-2">Game over</h1>
      <p className="text-lg font-medium mb-6 opacity-90" style={{ color: ACCENT }}>
        Winner: {winnerName}
      </p>
      <p className="text-sm mb-2 opacity-90">Final scores</p>
      <ul className="space-y-3 mb-6">
        {sorted.map((id, i) => (
          <li
            key={id}
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="font-medium">
              {i + 1}. {room.playerNames[id] ?? "?"}
            </span>
            <span className="font-bold" style={{ color: ACCENT }}>
              {scores[id] ?? 0} pts
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="w-full rounded-lg px-6 py-3 text-center font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
      >
        Back to start
      </Link>
    </main>
  );
}
