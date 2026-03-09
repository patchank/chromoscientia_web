"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRoom } from "@/hooks/useRoom";
import { useGame } from "@/hooks/useGame";
import { useEffect, useState } from "react";
import {
  advanceToResults,
  advanceTurnOrEnd,
  allNonDescriberPlayersHaveGuessed,
  acknowledgeResults,
  acknowledgeLeaderboard,
} from "@/lib/room";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { darkScreenStyle } from "@/lib/theme";
import { WaitingScreen } from "@/components/WaitingScreen";
import { DescribeScreen } from "@/components/DescribeScreen";
import { GuessScreen } from "@/components/GuessScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { LeaderboardScreen } from "@/components/LeaderboardScreen";
import { EndScreen } from "@/components/EndScreen";

const PlayWaitScreen = dynamic(
  () => import("@/components/PlayWaitScreen").then((m) => ({ default: m.PlayWaitScreen })),
  { ssr: false, loading: () => <PlayWaitScreenFallback /> }
);

function PlayWaitScreenFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
      <Logo className="mb-4" />
      <p className="opacity-90">Loading…</p>
    </main>
  );
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code : null;
  const { room, loading: roomLoading } = useRoom(code);
  const { game, loading: gameLoading, isDescriber, playerId } = useGame(code);

  // Redirect to start if this player is not in the room
  useEffect(() => {
    if (!room || playerId == null) return;
    if (!room.playerIds.includes(playerId)) {
      router.replace("/");
    }
  }, [room, playerId, router]);

  // Optimistic: transition immediately when this player clicks OK (don't wait for Firestore)
  const [resultsAcknowledgedByMe, setResultsAcknowledgedByMe] = useState(false);
  const [leaderboardAcknowledgedByMe, setLeaderboardAcknowledgedByMe] = useState(false);
  useEffect(() => {
    if (!game) return;
    if (game.phase !== "results") setResultsAcknowledgedByMe(false);
    if (game.phase !== "leaderboard") setLeaderboardAcknowledgedByMe(false);
  }, [game?.phase]);

  // When phase is guess and everyone has guessed, advance to results (any client can do this).
  // Retry after a short delay in case the first call raced with the last submitGuess (getDoc was stale).
  useEffect(() => {
    if (!code || !game || game.phase !== "guess") return;
    if (!allNonDescriberPlayersHaveGuessed(game)) return;
    advanceToResults(code).catch(() => {});
    const retryId = setTimeout(() => {
      advanceToResults(code).catch(() => {});
    }, 1500);
    return () => clearTimeout(retryId);
  }, [code, game?.phase, game?.playerOrder, game?.turnIndex, game?.guesses]);

  // When on leaderboard and everyone has acknowledged, advance to next turn (unsticks if we missed it due to race).
  useEffect(() => {
    if (!code || !game || game.phase !== "leaderboard") return;
    const ack = game.leaderboardAcknowledgedBy ?? [];
    const order = game.playerOrder ?? [];
    if (order.length === 0 || ack.length < order.length) return;
    advanceTurnOrEnd(code).catch(() => {});
    const retryId = setTimeout(() => advanceTurnOrEnd(code).catch(() => {}), 1500);
    return () => clearTimeout(retryId);
  }, [code, game?.phase, game?.playerOrder, game?.leaderboardAcknowledgedBy]);

  const configured = isFirebaseConfigured();
  const db = getDb();

  if (!configured || !db) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
        <Logo className="mb-6" />
        <p className="opacity-90">Firebase is not configured.</p>
      </main>
    );
  }

  if (!code) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
        <Logo className="mb-6" />
        <p className="opacity-90">Invalid room.</p>
      </main>
    );
  }

  if (roomLoading || !room) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
        <Logo className="mb-6" />
        <p className="opacity-90">
          {roomLoading ? "Loading…" : "Room not found."}
        </p>
      </main>
    );
  }

  // Not in room: redirect to start (effect above handles it; show loading meanwhile)
  if (playerId != null && !room.playerIds.includes(playerId)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
        <Logo className="mb-6" />
        <p className="opacity-90">Redirecting…</p>
      </main>
    );
  }

  // Game ended because a player left: show simple message
  if (room.status === "ended" && room.endedByLeave) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
        <Logo className="mb-6" />
        <h1 className="text-xl font-bold mb-2">Game ended</h1>
        <p className="opacity-90 mb-6 text-center">A player left the room. The game has ended for everyone.</p>
        <Link href="/" className="rounded-lg px-4 py-2 font-medium text-black" style={{ backgroundColor: "#E9FEFF" }}>
          Back to start
        </Link>
      </main>
    );
  }

  // Game ended normally: show end screen with winner
  if (room.status === "ended" && game) {
    return <EndScreen roomCode={code} game={game} room={room} />;
  }

  // No game yet: waiting lobby
  if (!game || gameLoading) {
    return (
      <WaitingScreen
        roomCode={code}
        room={room}
        playerId={playerId}
      />
    );
  }

  // In-game: route by phase and role
  if (game.phase === "describe") {
    if (isDescriber) {
      return (
        <DescribeScreen
          roomCode={code}
          referenceColor={game.referenceColor}
        />
      );
    }
    return (
      <PlayWaitScreen
        roomCode={code}
        describerName={
          room.playerNames[game.playerOrder[game.turnIndex]] ?? "Someone"
        }
      />
    );
  }

  if (game.phase === "guess") {
    if (isDescriber) {
      return (
        <PlayWaitScreen
          roomCode={code}
          describerName="you"
          message="Waiting for others to guess…"
        />
      );
    }
    // Once this player has submitted, show wait screen until results
    const hasGuessed = playerId != null && game.guesses != null && playerId in game.guesses;
    if (hasGuessed) {
      return (
        <PlayWaitScreen
          roomCode={code}
          describerName=""
          message="Waiting for others to guess…"
        />
      );
    }
    return (
      <GuessScreen
        roomCode={code}
        description={game.description ?? ""}
      />
    );
  }

  if (game.phase === "results") {
    const hasAcknowledgedResults =
      resultsAcknowledgedByMe ||
      (playerId != null && (game.resultsAcknowledgedBy ?? []).includes(playerId));
    const hasAcknowledgedLeaderboard =
      leaderboardAcknowledgedByMe ||
      (playerId != null && (game.leaderboardAcknowledgedBy ?? []).includes(playerId));
    if (hasAcknowledgedResults && hasAcknowledgedLeaderboard) {
      return (
        <PlayWaitScreen
          roomCode={code}
          describerName=""
          message="Waiting for others to continue…"
        />
      );
    }
    if (hasAcknowledgedResults) {
      return (
        <LeaderboardScreen
          roomCode={code}
          game={game}
          room={room}
          onAcknowledge={async () => {
            setLeaderboardAcknowledgedByMe(true);
            await acknowledgeLeaderboard(code);
          }}
        />
      );
    }
    return (
      <ResultsScreen
        roomCode={code}
        game={game}
        room={room}
        onAcknowledge={async () => {
          setResultsAcknowledgedByMe(true);
          await acknowledgeResults(code);
        }}
      />
    );
  }

  if (game.phase === "leaderboard") {
    const hasAcknowledgedLeaderboard =
      leaderboardAcknowledgedByMe ||
      (playerId != null && (game.leaderboardAcknowledgedBy ?? []).includes(playerId));
    if (hasAcknowledgedLeaderboard) {
      return (
        <PlayWaitScreen
          roomCode={code}
          describerName=""
          message="Waiting for others to continue…"
        />
      );
    }
    return (
      <LeaderboardScreen
        roomCode={code}
        game={game}
        room={room}
        onAcknowledge={async () => {
          setLeaderboardAcknowledgedByMe(true);
          await acknowledgeLeaderboard(code);
        }}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6" style={darkScreenStyle}>
      <Logo className="mb-6" />
      <p className="opacity-90">Loading…</p>
    </main>
  );
}
