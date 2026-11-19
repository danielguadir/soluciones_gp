/**
 * Strict mathematical types for the 3x3x3 Rubik's Cube engine
 * and its 2D circular orbital projection.
 */

export type FaceId = "U" | "D" | "L" | "R" | "F" | "B";

export type BaseMove = FaceId;
export type InverseMove = `${FaceId}'`;
export type DoubleMove = `${FaceId}2`;
export type Move = BaseMove | InverseMove | DoubleMove;

export type StickerRole = "center" | "edge" | "corner";

export interface Vector3D {
  readonly x: -1 | 0 | 1;
  readonly y: -1 | 0 | 1;
  readonly z: -1 | 0 | 1;
}

export interface StickerMetadata {
  readonly index: number; // 0..53
  readonly face: FaceId;
  readonly localIndex: number; // 0..8 within face
  readonly row: 0 | 1 | 2;
  readonly col: 0 | 1 | 2;
  readonly role: StickerRole;
  readonly position3D: Vector3D;
  readonly normal3D: Vector3D;
}

/**
 * Immutable representation of the 54 sticker colors of a 3x3x3 cube.
 * Each entry at index `i` holds the original FaceId color currently occupying position `i`.
 */
export type CubeState = readonly FaceId[];

export interface CubeInvariantReport {
  readonly valid: boolean;
  readonly totalStickers: number;
  readonly colorCounts: Record<FaceId, number>;
  readonly centersIntact: boolean;
  readonly errors: string[];
}
