import {
  BaseMove,
  CubeInvariantReport,
  CubeState,
  FaceId,
  Move,
  StickerMetadata,
  StickerRole,
  Vector3D,
} from "./types";

export const FACES: readonly FaceId[] = ["U", "D", "L", "R", "F", "B"] as const;

export const ALL_MOVES: readonly Move[] = [
  "U", "U'", "U2",
  "D", "D'", "D2",
  "L", "L'", "L2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "B", "B'", "B2",
] as const;

/**
 * Outward normal vector and 2D local basis (right, down) in 3D space
 * for each of the 6 faces when looking directly at the face from outside.
 */
const FACE_BASIS: Record<
  FaceId,
  { normal: Vector3D; right: Vector3D; down: Vector3D }
> = {
  U: {
    normal: { x: 0, y: 1, z: 0 },
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: 0, z: 1 },
  },
  D: {
    normal: { x: 0, y: -1, z: 0 },
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: 0, z: -1 },
  },
  L: {
    normal: { x: -1, y: 0, z: 0 },
    right: { x: 0, y: 0, z: 1 },
    down: { x: 0, y: -1, z: 0 },
  },
  R: {
    normal: { x: 1, y: 0, z: 0 },
    right: { x: 0, y: 0, z: -1 },
    down: { x: 0, y: -1, z: 0 },
  },
  F: {
    normal: { x: 0, y: 0, z: 1 },
    right: { x: 1, y: 0, z: 0 },
    down: { x: 0, y: -1, z: 0 },
  },
  B: {
    normal: { x: 0, y: 0, z: -1 },
    right: { x: -1, y: 0, z: 0 },
    down: { x: 0, y: -1, z: 0 },
  },
};

function determineRole(row: 0 | 1 | 2, col: 0 | 1 | 2): StickerRole {
  if (row === 1 && col === 1) return "center";
  if (row === 1 || col === 1) return "edge";
  return "corner";
}

function toCoord(n: number): -1 | 0 | 1 {
  if (n < 0) return -1;
  if (n > 0) return 1;
  return 0;
}

/**
 * Generates canonical metadata for all 54 stickers (indices 0..53),
 * including 3D coordinates and normals for 3D-2D mathematical isomorphism.
 */
export const STICKER_METADATA: readonly StickerMetadata[] = (() => {
  const list: StickerMetadata[] = [];
  let globalIdx = 0;

  for (const face of FACES) {
    const basis = FACE_BASIS[face];
    for (let localIndex = 0; localIndex < 9; localIndex++) {
      const row = Math.floor(localIndex / 3) as 0 | 1 | 2;
      const col = (localIndex % 3) as 0 | 1 | 2;
      const u = col - 1; // -1, 0, 1 along `right`
      const v = row - 1; // -1, 0, 1 along `down`

      const position3D: Vector3D = {
        x: toCoord(basis.normal.x + u * basis.right.x + v * basis.down.x),
        y: toCoord(basis.normal.y + u * basis.right.y + v * basis.down.y),
        z: toCoord(basis.normal.z + u * basis.right.z + v * basis.down.z),
      };

      list.push({
        index: globalIdx,
        face,
        localIndex,
        row,
        col,
        role: determineRole(row, col),
        position3D,
        normal3D: basis.normal,
      });
      globalIdx++;
    }
  }
  return list;
})();

/**
 * Rotates a 3D integer vector by 90 degrees clockwise when looking
 * down the given outward normal axis (right-hand angle = -90 deg around `axis`).
 */
function rotateVector90CW(vec: Vector3D, axis: Vector3D): Vector3D {
  // Rodrigues' rotation formula for theta = -pi/2 around unit axis k:
  // v_rot = (k . v) k - (k x v)
  const dot = axis.x * vec.x + axis.y * vec.y + axis.z * vec.z;
  const crossX = axis.y * vec.z - axis.z * vec.y;
  const crossY = axis.z * vec.x - axis.x * vec.z;
  const crossZ = axis.x * vec.y - axis.y * vec.x;

  return {
    x: toCoord(dot * axis.x - crossX),
    y: toCoord(dot * axis.y - crossY),
    z: toCoord(dot * axis.z - crossZ),
  };
}

function vectorKey(pos: Vector3D, norm: Vector3D): string {
  return `${pos.x},${pos.y},${pos.z}|${norm.x},${norm.y},${norm.z}`;
}

const STICKER_LOOKUP: ReadonlyMap<string, number> = (() => {
  const map = new Map<string, number>();
  for (const s of STICKER_METADATA) {
    map.set(vectorKey(s.position3D, s.normal3D), s.index);
  }
  return map;
})();

/**
 * Computes the permutation table `perm` of length 54 for a 90° clockwise base move,
 * where `newState[destIndex] = oldState[srcIndex]` is represented as `destOf[srcIndex] = destIndex`.
 */
function buildBasePermutation(face: BaseMove): readonly number[] {
  const axis = FACE_BASIS[face].normal;
  const destOf = new Array<number>(54);

  for (const sticker of STICKER_METADATA) {
    const dot =
      sticker.position3D.x * axis.x +
      sticker.position3D.y * axis.y +
      sticker.position3D.z * axis.z;

    if (dot === 1) {
      const nextPos = rotateVector90CW(sticker.position3D, axis);
      const nextNorm = rotateVector90CW(sticker.normal3D, axis);
      const targetIdx = STICKER_LOOKUP.get(vectorKey(nextPos, nextNorm));
      if (targetIdx === undefined) {
        throw new Error(`Invalid 3D rotation mapping for sticker ${sticker.index}`);
      }
      destOf[sticker.index] = targetIdx;
    } else {
      destOf[sticker.index] = sticker.index;
    }
  }

  return destOf;
}

function composePermutations(
  p1: readonly number[],
  p2: readonly number[]
): readonly number[] {
  // Applies p1 followed by p2: destOf[i] = p2[p1[i]]
  return p1.map((intermediate) => p2[intermediate]);
}

/**
 * Precomputed permutation tables for all 18 moves (`destOf[srcIndex] = destIndex`).
 */
export const MOVE_PERMUTATIONS: Record<Move, readonly number[]> = (() => {
  const result = {} as Record<Move, readonly number[]>;

  for (const face of FACES) {
    const cw = buildBasePermutation(face);
    const double = composePermutations(cw, cw);
    const ccw = composePermutations(double, cw);

    result[face] = cw;
    result[`${face}2` as Move] = double;
    result[`${face}'` as Move] = ccw;
  }

  return result;
})();

/**
 * Extracts disjoint 4-cycles of sticker indices moved by a 90° clockwise face rotation.
 * Each base move consists of 5 disjoint 4-cycles (20 moving stickers: 8 on the face, 12 on the rim).
 */
export const BASE_MOVE_CYCLES: Record<BaseMove, readonly (readonly [number, number, number, number])[]> = (() => {
  const cyclesByFace = {} as Record<BaseMove, readonly (readonly [number, number, number, number])[]>;

  for (const face of FACES) {
    const perm = MOVE_PERMUTATIONS[face];
    const visited = new Set<number>();
    const cycles: (readonly [number, number, number, number])[] = [];

    for (let i = 0; i < 54; i++) {
      if (visited.has(i) || perm[i] === i) continue;
      const i1 = perm[i];
      const i2 = perm[i1];
      const i3 = perm[i2];
      visited.add(i);
      visited.add(i1);
      visited.add(i2);
      visited.add(i3);
      cycles.push([i, i1, i2, i3]);
    }
    cyclesByFace[face] = cycles;
  }

  return cyclesByFace;
})();

/**
 * Creates a fresh solved 3x3x3 Rubik's cube state (54 stickers).
 */
export function createSolvedCube(): CubeState {
  return STICKER_METADATA.map((s) => s.face);
}

/**
 * Applies a single move (`U`, `U'`, `U2`, etc.) and returns a new immutable CubeState.
 */
export function applyMove(state: CubeState, move: Move): CubeState {
  const perm = MOVE_PERMUTATIONS[move];
  if (!perm) {
    throw new Error(`Unsupported Rubik move: ${move}`);
  }
  const next = new Array<FaceId>(54);
  for (let src = 0; src < 54; src++) {
    next[perm[src]] = state[src];
  }
  return next;
}

/**
 * Applies an ordered sequence of moves to a CubeState.
 */
export function applySequence(
  state: CubeState,
  moves: readonly Move[]
): CubeState {
  return moves.reduce((acc, m) => applyMove(acc, m), state);
}

/**
 * Returns the algebraic inverse of any move (`U` -> `U'`, `U'` -> `U`, `U2` -> `U2`).
 */
export function invertMove(move: Move): Move {
  if (move.endsWith("2")) return move;
  if (move.endsWith("'")) return move.slice(0, 1) as BaseMove;
  return `${move}'` as Move;
}

/**
 * Checks whether a CubeState is in the canonical solved configuration.
 */
export function isCubeSolved(state: CubeState): boolean {
  if (state.length !== 54) return false;
  for (let i = 0; i < 54; i++) {
    if (state[i] !== STICKER_METADATA[i].face) {
      return false;
    }
  }
  return true;
}

/**
 * Verifies group and physical invariants of a 3x3x3 CubeState:
 * - Total of 54 stickers
 * - Exactly 9 stickers of each of the 6 colors
 * - All 6 face centers remain invariant
 */
export function validateCubeInvariants(state: CubeState): CubeInvariantReport {
  const errors: string[] = [];
  const colorCounts: Record<FaceId, number> = {
    U: 0,
    D: 0,
    L: 0,
    R: 0,
    F: 0,
    B: 0,
  };

  if (state.length !== 54) {
    errors.push(`Expected 54 stickers, got ${state.length}`);
  }

  for (let i = 0; i < state.length; i++) {
    const color = state[i];
    if (color in colorCounts) {
      colorCounts[color]++;
    } else {
      errors.push(`Invalid color "${String(color)}" at index ${i}`);
    }
  }

  for (const face of FACES) {
    if (colorCounts[face] !== 9) {
      errors.push(`Color ${face} count is ${colorCounts[face]}, expected 9`);
    }
  }

  let centersIntact = true;
  for (let fIdx = 0; fIdx < FACES.length; fIdx++) {
    const centerStickerIdx = fIdx * 9 + 4;
    if (state[centerStickerIdx] !== FACES[fIdx]) {
      centersIntact = false;
      errors.push(
        `Center at index ${centerStickerIdx} mutated to ${state[centerStickerIdx]}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    totalStickers: state.length,
    colorCounts,
    centersIntact,
    errors,
  };
}

/**
 * Generates a non-redundant scramble sequence of the given length
 * (avoids consecutive moves on the same face).
 */
export function generateScramble(
  length = 12,
  rng: () => number = Math.random
): Move[] {
  const suffixes = ["", "'"] as const;
  const sequence: Move[] = [];
  let lastFace: FaceId | null = null;

  for (let i = 0; i < length; i++) {
    const availableFaces = FACES.filter((f) => f !== lastFace);
    const face =
      availableFaces[Math.floor(rng() * availableFaces.length)] ?? "U";
    const suffix = suffixes[Math.floor(rng() * suffixes.length)] ?? "";
    sequence.push(`${face}${suffix}` as Move);
    lastFace = face;
  }

  return sequence;
}
