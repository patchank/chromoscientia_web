"use client";

import { Logo } from "@/components/Logo";
import { acknowledgeLeaderboard } from "@/lib/room";
import { LeaveGameButton } from "@/components/LeaveGameButton";
import { ACCENT, ACCENT_BUTTON_TEXT, DARK_BG, TEXT_LIGHT } from "@/lib/theme";
import type { GameSnapshot, RoomSnapshot } from "@/lib/room";

export function LeaderboardScreen({
  roomCode,
  game,
  room,
  onAcknowledge,
}: {
  roomCode: string;
  game: GameSnapshot;
  room: RoomSnapshot;
  onAcknowledge?: () => void | Promise<void>;
}) {
  const scores = game.scores ?? {};
  const sorted = [...game.playerOrder].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );

  async function handleOk() {
    if (onAcknowledge) {
      await onAcknowledge();
    } else {
      await acknowledgeLeaderboard(roomCode);
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col p-6 pt-10"
      style={{ backgroundColor: DARK_BG, color: TEXT_LIGHT }}
    >
      <LeaveGameButton roomCode={roomCode} backgroundColor={DARK_BG} />
      <div className="w-full flex justify-center">
        <Logo className="mb-8" />
      </div>
      <h1 className="text-xl font-bold mb-3">Leaderboard</h1>
      <ul className="space-y-3 mb-8">
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
      <button
        onClick={handleOk}
        className="w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: ACCENT, color: ACCENT_BUTTON_TEXT }}
      >
        OK
      </button>
    </main>
  );
}
