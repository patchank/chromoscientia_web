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
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  limit,
  Timestamp,
} from "firebase/firestore";
import { createRoomApi, NICKNAME_TAKEN_ERROR } from "@chromoscientia/shared";
import { getDb } from "./firebase";
import { getOrCreatePlayerId } from "./playerId";

/** Local type for the Firestore API we pass to createRoomApi (defined here so build works regardless of shared package version). */
interface FirestoreAdapter {
  doc: (db: unknown, collectionPath: string, ...pathSegments: string[]) => unknown;
  setDoc: (ref: unknown, data: unknown) => Promise<void>;
  getDoc: (ref: unknown) => Promise<{ exists: () => boolean; data: () => Record<string, unknown> }>;
  updateDoc: (ref: unknown, data: unknown) => Promise<void>;
  deleteDoc: (ref: unknown) => Promise<void>;
  onSnapshot: (ref: unknown, callback: (snap: { exists: () => boolean; data: () => Record<string, unknown> }) => void) => () => void;
  serverTimestamp: () => unknown;
  arrayUnion: (...args: unknown[]) => unknown;
  collection: (db: unknown, path: string) => unknown;
  query: (...args: unknown[]) => unknown;
  where: (field: string, op: string, value: unknown) => unknown;
  getDocs: (q: unknown) => Promise<{ empty: boolean; docs: Array<{ id: string; ref: unknown }> }>;
  writeBatch: (db: unknown) => { delete: (ref: unknown) => void; commit: () => Promise<void> };
  limit: (n: number) => unknown;
  Timestamp: { fromMillis: (ms: number) => unknown };
}

const firestoreAdapter = {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  limit,
  Timestamp,
} as FirestoreAdapter;

const roomApi = createRoomApi(getDb, getOrCreatePlayerId, firestoreAdapter);

export { NICKNAME_TAKEN_ERROR };
export type { RoomSnapshot, GameSnapshot } from "@chromoscientia/shared";

export const createRoom = roomApi.createRoom;
export const joinRoom = roomApi.joinRoom;
export const leaveRoom = roomApi.leaveRoom;
export const endGameForAll = roomApi.endGameForAll;
export const startGame = roomApi.startGame;
export const playAgain = roomApi.playAgain;
export const submitDescription = roomApi.submitDescription;
export const submitGuess = roomApi.submitGuess;
export const advanceToResults = roomApi.advanceToResults;
export const advanceToLeaderboard = roomApi.advanceToLeaderboard;
export const acknowledgeResults = roomApi.acknowledgeResults;
export const advanceTurnOrEnd = roomApi.advanceTurnOrEnd;
export const acknowledgeLeaderboard = roomApi.acknowledgeLeaderboard;
export const subscribeRoom = roomApi.subscribeRoom;
export const subscribeGame = roomApi.subscribeGame;

export {
  getCurrentDescriberId,
  isDescriber,
  allNonDescriberPlayersHaveGuessed,
  getNextTurnState,
  MIN_PLAYERS,
  MAX_PLAYERS,
  TOTAL_ROUNDS,
} from "@chromoscientia/game-core";
