/**
 * Pure game rules. No Firebase, no platform APIs.
 */
import type { Game, GameData, NextTurnState, PlayerId } from "./types";
export declare const MIN_PLAYERS = 3;
export declare const MAX_PLAYERS = 8;
export declare const TOTAL_ROUNDS = 3;
/**
 * Current describer's player id (from playerOrder[turnIndex]).
 */
export declare function getCurrentDescriberId(game: Game | GameData): PlayerId;
/**
 * True if the given player is the current describer (and thus should see Describe screen).
 */
export declare function isDescriber(game: Game | GameData, playerId: PlayerId): boolean;
/**
 * True when every player except the current describer has submitted a guess.
 */
export declare function allNonDescriberPlayersHaveGuessed(game: Game | GameData): boolean;
/**
 * Compute the next turn/round state after leaderboard.
 * If game has more turns: next turnIndex (and possibly next round). Else game over.
 */
export declare function getNextTurnState(game: Game | GameData): NextTurnState;
/**
 * Shuffle array (Fisher–Yates). Used for initial playerOrder.
 */
export declare function shuffle<T>(array: T[]): T[];
