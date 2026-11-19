import { STICKER_METADATA } from "./engine";
import { BaseMove, FaceId, Move, Vector3D } from "./types";

/**
 * Pure 3D projection of the cube state (no Three.js dependency).
 *
 * Axis convention (shared with engine.ts):
 *   +X = R, -X = L, +Y = U, -Y = D, +Z = F, -Z = B
 *
 * Sticker slot `i` is drawn at its cubie position `position3D` pushed outwards
 * along `normal3D` by STICKER_OFFSET, and painted with `state[i]`.
 * During a transition for move M, every slot in the moving layer is rotated
 * around M's outward axis by `layerAngle(M, progress)`. At progress = 1 that
 * rotation lands slot `src` exactly on slot `MOVE_PERMUTATIONS[M][src]`,
 * which is what the automated sync tests verify.
 */

export type Vec3 = readonly [number, number, number];

export const STICKER_OFFSET = 0.505;

export const FACE_AXIS: Readonly<Record<FaceId, Vec3>> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  L: [-1, 0, 0],
  R: [1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
};

/** The 26 visible cubie centers (the hidden core at the origin is omitted). */
export const CUBIE_POSITIONS: readonly Vec3[] = (() => {
  const list: Vec3[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        list.push([x, y, z]);
      }
    }
  }
  return list;
})();

export function baseFaceOf(move: Move): BaseMove {
  return move[0] as BaseMove;
}

/** Quarter turns of a move, clockwise as seen from outside the face. */
export function quarterTurns(move: Move): 1 | -1 | 2 {
  if (move.endsWith("2")) return 2;
  if (move.endsWith("'")) return -1;
  return 1;
}

/**
 * Right-handed rotation angle (radians) about the face's outward axis.
 * A clockwise quarter turn seen from outside is -PI/2.
 */
export function layerAngle(move: Move, progress: number): number {
  return (-Math.PI / 2) * quarterTurns(move) * progress;
}

export function isInLayer(position: Vec3 | Vector3D, move: Move): boolean {
  const axis = FACE_AXIS[baseFaceOf(move)];
  const p: Vec3 = Array.isArray(position)
    ? (position as Vec3)
    : [(position as Vector3D).x, (position as Vector3D).y, (position as Vector3D).z];
  return p[0] * axis[0] + p[1] * axis[1] + p[2] * axis[2] === 1;
}

/** Rodrigues rotation of v around unit axis k by angle theta. */
export function rotateVec(v: Vec3, k: Vec3, theta: number): Vec3 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const cx = k[1] * v[2] - k[2] * v[1];
  const cy = k[2] * v[0] - k[0] * v[2];
  const cz = k[0] * v[1] - k[1] * v[0];
  return [
    v[0] * c + cx * s + k[0] * dot * (1 - c),
    v[1] * c + cy * s + k[1] * dot * (1 - c),
    v[2] * c + cz * s + k[2] * dot * (1 - c),
  ];
}

/** Quaternion [x, y, z, w] for a rotation of theta around unit axis k. */
export function axisAngleQuaternion(k: Vec3, theta: number): readonly [number, number, number, number] {
  const h = theta / 2;
  const s = Math.sin(h);
  return [k[0] * s, k[1] * s, k[2] * s, Math.cos(h)];
}

export const IDENTITY_QUATERNION = [0, 0, 0, 1] as const;

export interface LayerTransition {
  readonly move: Move;
  readonly progress: number;
}

/** Layer rotation applied to an object located at `position` during `transition`. */
export function layerQuaternion(
  position: Vec3 | Vector3D,
  transition: LayerTransition | null
): readonly [number, number, number, number] {
  if (!transition || !isInLayer(position, transition.move)) return IDENTITY_QUATERNION;
  return axisAngleQuaternion(
    FACE_AXIS[baseFaceOf(transition.move)],
    layerAngle(transition.move, transition.progress)
  );
}

/** Rest pose (before any layer rotation) of sticker slot `index`. */
export function stickerRestPose(index: number): { center: Vec3; normal: Vec3 } {
  const m = STICKER_METADATA[index];
  const p = m.position3D;
  const n = m.normal3D;
  return {
    center: [
      p.x + n.x * STICKER_OFFSET,
      p.y + n.y * STICKER_OFFSET,
      p.z + n.z * STICKER_OFFSET,
    ],
    normal: [n.x, n.y, n.z],
  };
}

/** World pose of sticker slot `index` at the given transition (used for sync verification). */
export function stickerWorldPose(
  index: number,
  transition: LayerTransition | null
): { center: Vec3; normal: Vec3 } {
  const rest = stickerRestPose(index);
  const m = STICKER_METADATA[index];
  if (!transition || !isInLayer(m.position3D, transition.move)) return rest;
  const axis = FACE_AXIS[baseFaceOf(transition.move)];
  const theta = layerAngle(transition.move, transition.progress);
  return {
    center: rotateVec(rest.center, axis, theta),
    normal: rotateVec(rest.normal, axis, theta),
  };
}

/** Euler rotation that orients a +Z-facing plane so it faces `normal`. */
export function planeEulerForNormal(normal: Vector3D): readonly [number, number, number] {
  if (normal.x === 1) return [0, Math.PI / 2, 0];
  if (normal.x === -1) return [0, -Math.PI / 2, 0];
  if (normal.y === 1) return [-Math.PI / 2, 0, 0];
  if (normal.y === -1) return [Math.PI / 2, 0, 0];
  if (normal.z === -1) return [0, Math.PI, 0];
  return [0, 0, 0];
}
