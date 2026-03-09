"use client";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import {
  randomHex,
  rankGuessesAndAssignPoints,
  getCurrentDescriberId,
  isDescriber,
  allNonDescriberPlayersHaveGuessed,
  getNextTurnState,
  shuffle,
  MIN_PLAYERS,
  MAX_PLAYERS,
  TOTAL_ROUNDS,
  type GameData,
  type Phase,
} from "@chromoscientia/game-core";
import { getDb } from "./firebase";
import { getOrCreatePlayerId } from "./playerId";
import {
  DESCRIBER_BONUS_DISTANCE_CLOSE,
  DESCRIBER_BONUS_DISTANCE_VERY_CLOSE,
  DESCRIBER_BONUS_POINTS_CLOSE,
  DESCRIBER_BONUS_POINTS_VERY_CLOSE,
  GUESS_MIN_PLAYERS_FOR_SECOND,
  GUESS_MIN_PLAYERS_FOR_THIRD,
  GUESS_POINTS_FIRST,
  GUESS_POINTS_SECOND,
  GUESS_POINTS_THIRD,
} from "./scoring";

const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function getTimestamp() {
  return { seconds: Math.floor(Date.now() / 1000) };
}

export interface RoomSnapshot {
  code: string;
  hostId: string;
  playerIds: string[];
  playerNames: Record<string, string>;
  status: "waiting" | "playing" | "ended";
  /** True when the game was ended because a player left (not normal game over). */
  endedByLeave?: boolean;
}

export interface GameSnapshot {
  roomCode: string;
  playerOrder: string[];
  roundIndex: number;
  turnIndex: number;
  phase: Phase;
  referenceColor: string;
  description?: string;
  guesses: Record<string, { color: string; distance?: number; points?: number }>;
  scores: Record<string, number>;
  /** Describer bonus granted this round (once): 5 if any guess very close, 2 if any close. */
  describerBonus?: number;
  resultsAcknowledgedBy?: string[];
  leaderboardAcknowledgedBy?: string[];
  updatedAt?: unknown;
}

export async function createRoom(nickname: string): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const playerId = getOrCreatePlayerId();
  let code: string;
  let attempts = 0;
  do {
    code = generateRoomCode();
    const ref = doc(db, "rooms", code);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        code,
        hostId: playerId,
        playerIds: [playerId],
        playerNames: { [playerId]: nickname },
        status: "waiting",
        createdAt: serverTimestamp(),
      });
      return code;
    }
    attempts++;
  } while (attempts < 10);
  throw new Error("Could not generate unique room code");
}

export async function joinRoom(
  code: string,
  nickname: string
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const roomRef = doc(db, "rooms", code.toUpperCase());
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error("Room not found");
  const data = snap.data();
  const status = data.status ?? "waiting";
  if (status !== "waiting") throw new Error("Game has already started");
  const playerIds: string[] = data.playerIds ?? [];
  if (playerIds.length >= MAX_PLAYERS) throw new Error("Room is full");
  const playerId = getOrCreatePlayerId();
  if (playerIds.includes(playerId)) return; // already in room
  const existingNames = Object.values(data.playerNames ?? {}).map((n) =>
    String(n).trim().toLowerCase()
  );
  const nameLower = nickname.trim().toLowerCase();
  if (existingNames.includes(nameLower))
    throw new Error("This nickname is already taken in this room");
  const playerNames = { ...(data.playerNames ?? {}), [playerId]: nickname };
  await updateDoc(roomRef, {
    playerIds: [...playerIds, playerId],
    playerNames,
  });
}

export async function leaveRoom(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const roomRef = doc(db, "rooms", roomCode);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error("Room not found");
  const data = snap.data();
  const playerIds: string[] = data.playerIds ?? [];
  const playerId = getOrCreatePlayerId();
  if (!playerIds.includes(playerId)) return;
  const newPlayerIds = playerIds.filter((id) => id !== playerId);
  const playerNames = { ...(data.playerNames ?? {}) };
  delete playerNames[playerId];
  if (newPlayerIds.length === 0) {
    await deleteDoc(roomRef);
    return;
  }
  const updates: { playerIds: string[]; playerNames: Record<string, string>; hostId?: string } = {
    playerIds: newPlayerIds,
    playerNames,
  };
  if (data.hostId === playerId) {
    updates.hostId = newPlayerIds[0];
  }
  await updateDoc(roomRef, updates);
}

/** End the game for everyone (e.g. when a player leaves during play). Sets room status to ended. */
export async function endGameForAll(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const roomRef = doc(db, "rooms", roomCode);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) return;
  await updateDoc(roomRef, {
    status: "ended" as const,
    endedByLeave: true,
  });
}

export async function startGame(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const roomRef = doc(db, "rooms", roomCode);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) throw new Error("Room not found");
  const room = roomSnap.data();
  const playerIds: string[] = room.playerIds ?? [];
  if (playerIds.length < MIN_PLAYERS)
    throw new Error(`Need at least ${MIN_PLAYERS} players`);
  const playerOrder = shuffle(playerIds);
  const gameRef = doc(db, "games", roomCode);
  const initialScores: Record<string, number> = {};
  playerIds.forEach((id) => (initialScores[id] = 0));
  await setDoc(gameRef, {
    roomCode,
    playerOrder,
    roundIndex: 0,
    turnIndex: 0,
    phase: "describe" as Phase,
    referenceColor: randomHex(),
    description: "",
    guesses: {},
    scores: initialScores,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(roomRef, { status: "playing" });
}

export async function submitDescription(
  roomCode: string,
  description: string
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const gameRef = doc(db, "games", roomCode);
  await updateDoc(gameRef, {
    description,
    phase: "guess" as Phase,
    updatedAt: serverTimestamp(),
  });
}

export async function submitGuess(roomCode: string, color: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const playerId = getOrCreatePlayerId();
  const gameRef = doc(db, "games", roomCode);
  const snap = await getDoc(gameRef);
  if (!snap.exists()) throw new Error("Game not found");
  const game = snap.data() as GameData;
  const guesses = { ...(game.guesses ?? {}), [playerId]: { color } };
  await updateDoc(gameRef, {
    guesses,
    updatedAt: serverTimestamp(),
  });
}

export async function advanceToResults(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const gameRef = doc(db, "games", roomCode);
  const snap = await getDoc(gameRef);
  if (!snap.exists()) throw new Error("Game not found");
  const game = snap.data() as GameData;
  if (game.phase !== "guess") return; // already advanced
  if (!allNonDescriberPlayersHaveGuessed(game)) return;
  const referenceHex = game.referenceColor;
  const guesses = game.guesses ?? {};
  const playerCount = game.playerOrder?.length ?? 0;
  const ranked = rankGuessesAndAssignPoints(referenceHex, guesses, playerCount, {
    pointsFirst: GUESS_POINTS_FIRST,
    pointsSecond: GUESS_POINTS_SECOND,
    pointsThird: GUESS_POINTS_THIRD,
    minPlayersForSecond: GUESS_MIN_PLAYERS_FOR_SECOND,
    minPlayersForThird: GUESS_MIN_PLAYERS_FOR_THIRD,
  });
  const describerId = game.playerOrder?.[game.turnIndex ?? 0] ?? "";
  const newGuesses: Record<string, { color: string; distance: number; points: number }> = {};
  const scores = { ...(game.scores ?? {}) };
  ranked.forEach((r) => {
    newGuesses[r.playerId] = {
      color: r.color,
      distance: r.distance,
      points: r.points,
    };
    scores[r.playerId] = (scores[r.playerId] ?? 0) + r.points;
  });
  const hasVeryClose = ranked.some((r) => r.distance < DESCRIBER_BONUS_DISTANCE_VERY_CLOSE);
  const hasClose = ranked.some((r) => r.distance < DESCRIBER_BONUS_DISTANCE_CLOSE);
  const describerBonusForRound = hasVeryClose
    ? DESCRIBER_BONUS_POINTS_VERY_CLOSE
    : hasClose
      ? DESCRIBER_BONUS_POINTS_CLOSE
      : 0;
  if (describerId && describerBonusForRound > 0) {
    scores[describerId] = (scores[describerId] ?? 0) + describerBonusForRound;
  }
  await updateDoc(gameRef, {
    guesses: newGuesses,
    scores,
    describerBonus: describerBonusForRound,
    phase: "results" as Phase,
    updatedAt: serverTimestamp(),
  });
}

export async function advanceToLeaderboard(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const gameRef = doc(db, "games", roomCode);
  await updateDoc(gameRef, {
    phase: "leaderboard" as Phase,
    resultsAcknowledgedBy: [],
    // Keep leaderboardAcknowledgedBy so players who already clicked OK (while others were on results) stay on "Waiting for others"
    updatedAt: serverTimestamp(),
  });
}

/** Add current player to resultsAcknowledgedBy; that player sees leaderboard immediately. Advances phase when everyone has acknowledged. */
export async function acknowledgeResults(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const playerId = getOrCreatePlayerId();
  const gameRef = doc(db, "games", roomCode);
  await updateDoc(gameRef, {
    resultsAcknowledgedBy: arrayUnion(playerId),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(gameRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const phase = data.phase as Phase;
  const playerOrder = (data.playerOrder as string[]) ?? [];
  const acknowledged = (data.resultsAcknowledgedBy as string[] | undefined) ?? [];
  const effectiveCount = acknowledged.includes(playerId) ? acknowledged.length : acknowledged.length + 1;
  if (phase === "results" && playerOrder.length > 0 && effectiveCount >= playerOrder.length) {
    await advanceToLeaderboard(roomCode);
  }
}

export async function advanceTurnOrEnd(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const gameRef = doc(db, "games", roomCode);
  const roomRef = doc(db, "rooms", roomCode);
  const snap = await getDoc(gameRef);
  if (!snap.exists()) throw new Error("Game not found");
  const game = snap.data() as GameData;
  const next = getNextTurnState(game);
  if (next.gameOver) {
    await updateDoc(roomRef, { status: "ended" });
    return;
  }
  await updateDoc(gameRef, {
    roundIndex: next.roundIndex,
    turnIndex: next.turnIndex,
    phase: "describe" as Phase,
    referenceColor: randomHex(),
    description: "",
    guesses: {},
    leaderboardAcknowledgedBy: [],
    updatedAt: serverTimestamp(),
  });
}

/** Add current player to leaderboardAcknowledgedBy; that player sees "waiting for others" immediately. Advances phase when everyone has acknowledged. */
export async function acknowledgeLeaderboard(roomCode: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase not configured");
  const playerId = getOrCreatePlayerId();
  const gameRef = doc(db, "games", roomCode);
  await updateDoc(gameRef, {
    leaderboardAcknowledgedBy: arrayUnion(playerId),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(gameRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const phase = data.phase as Phase;
  const playerOrder = (data.playerOrder as string[]) ?? [];
  const acknowledged = (data.leaderboardAcknowledgedBy as string[] | undefined) ?? [];
  const effectiveCount = acknowledged.includes(playerId) ? acknowledged.length : acknowledged.length + 1;
  if (phase === "leaderboard" && playerOrder.length > 0 && effectiveCount >= playerOrder.length) {
    await advanceTurnOrEnd(roomCode);
  }
}

export function subscribeRoom(
  roomCode: string,
  onUpdate: (data: RoomSnapshot | null) => void
): Unsubscribe {
  const db = getDb();
  if (!db) {
    onUpdate(null);
    return () => {};
  }
  return onSnapshot(doc(db, "rooms", roomCode), (snap) => {
    if (!snap.exists()) {
      onUpdate(null);
      return;
    }
    const d = snap.data();
    onUpdate({
      code: d.code ?? roomCode,
      hostId: d.hostId ?? "",
      playerIds: d.playerIds ?? [],
      playerNames: d.playerNames ?? {},
      status: d.status ?? "waiting",
      endedByLeave: d.endedByLeave === true,
    });
  });
}

export function subscribeGame(
  roomCode: string,
  onUpdate: (data: GameSnapshot | null) => void
): Unsubscribe {
  const db = getDb();
  if (!db) {
    onUpdate(null);
    return () => {};
  }
  return onSnapshot(doc(db, "games", roomCode), (snap) => {
    if (!snap.exists()) {
      onUpdate(null);
      return;
    }
    const d = snap.data();
    onUpdate({
      roomCode: d.roomCode ?? roomCode,
      playerOrder: d.playerOrder ?? [],
      roundIndex: d.roundIndex ?? 0,
      turnIndex: d.turnIndex ?? 0,
      phase: d.phase ?? "describe",
      referenceColor: d.referenceColor ?? "#000000",
      description: d.description,
      guesses: d.guesses ?? {},
      scores: d.scores ?? {},
      describerBonus: d.describerBonus,
      resultsAcknowledgedBy: d.resultsAcknowledgedBy ?? [],
      leaderboardAcknowledgedBy: d.leaderboardAcknowledgedBy ?? [],
      updatedAt: d.updatedAt,
    });
  });
}

export {
  getCurrentDescriberId,
  isDescriber,
  allNonDescriberPlayersHaveGuessed,
  getNextTurnState,
  MIN_PLAYERS,
  MAX_PLAYERS,
  TOTAL_ROUNDS,
};
