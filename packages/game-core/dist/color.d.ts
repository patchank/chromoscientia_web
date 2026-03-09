/**
 * Color utilities: random hex, hex to Lab, Delta E, and scoring.
 * Uses Delta E 2000 for perceptual distance.
 */
export interface LabColor {
    L: number;
    A: number;
    B: number;
}
/**
 * Generate a random color in #000000–#FFFFFF.
 */
export declare function randomHex(): string;
/**
 * Convert hex to Lab. Returns object in delta-e format { L, A, B }.
 */
export declare function hexToLab(hex: string): LabColor;
/**
 * Delta E 2000 between two hex colors.
 */
export declare function deltaE(hex1: string, hex2: string): number;
export interface RankedGuess {
    playerId: string;
    color: string;
    distance: number;
    points: number;
}
export interface GuessScoringOptions {
    pointsFirst?: number;
    pointsSecond?: number;
    pointsThird?: number;
    minPlayersForSecond?: number;
    minPlayersForThird?: number;
}
/**
 * Rank guesses by distance to reference, assign points by rank.
 * Defaults: 1st = 5 pts, 2nd = 3 pts (if 4+ players), 3rd = 1 pt (if 6+ players).
 */
export declare function rankGuessesAndAssignPoints(referenceHex: string, guesses: Record<string, {
    color: string;
}>, playerCount: number, options?: GuessScoringOptions): RankedGuess[];
