import { STICKER_METADATA } from "./engine";
import { BaseMove, FaceId } from "./types";

export type BundleId = "TOP" | "LEFT" | "RIGHT";

export interface CircleOrbit {
  readonly id: string;
  readonly bundle: BundleId;
  readonly ringIndex: 0 | 1 | 2;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
}

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface Sticker2DPosition {
  readonly index: number;
  readonly face: FaceId;
  readonly x: number;
  readonly y: number;
  /** The two circle orbits whose intersection defines this sticker's 2D position */
  readonly orbitA: string;
  readonly orbitB: string;
}

export const SVG_VIEWBOX_SIZE = 600;
export const SVG_CENTER: Point2D = { x: 300, y: 308 };

const BUNDLE_OFFSET = 92;
export const RING_RADII: readonly [number, number, number] = [116, 140, 164];

/**
 * Centers of the 3 symmetric circle bundles (120 degrees apart).
 * - TOP:   -90 deg (active rim orbit bundle for U / D moves)
 * - LEFT:  +150 deg (active rim orbit bundle for F / B moves)
 * - RIGHT: +30 deg (active rim orbit bundle for R / L moves)
 */
export const BUNDLE_CENTERS: Record<BundleId, Point2D> = {
  TOP: {
    x: SVG_CENTER.x,
    y: SVG_CENTER.y - BUNDLE_OFFSET,
  },
  LEFT: {
    x: SVG_CENTER.x + BUNDLE_OFFSET * Math.cos((150 * Math.PI) / 180),
    y: SVG_CENTER.y + BUNDLE_OFFSET * Math.sin((150 * Math.PI) / 180),
  },
  RIGHT: {
    x: SVG_CENTER.x + BUNDLE_OFFSET * Math.cos((30 * Math.PI) / 180),
    y: SVG_CENTER.y + BUNDLE_OFFSET * Math.sin((30 * Math.PI) / 180),
  },
};

/**
 * The 9 circular trajectories (3 bundles x 3 concentric rings).
 */
export const CIRCLE_ORBITS: readonly CircleOrbit[] = (() => {
  const bundles: BundleId[] = ["TOP", "LEFT", "RIGHT"];
  const list: CircleOrbit[] = [];

  for (const bundle of bundles) {
    const center = BUNDLE_CENTERS[bundle];
    for (let i = 0; i < 3; i++) {
      const ringIndex = i as 0 | 1 | 2;
      list.push({
        id: `${bundle}-${ringIndex}`,
        bundle,
        ringIndex,
        cx: center.x,
        cy: center.y,
        r: RING_RADII[ringIndex],
      });
    }
  }
  return list;
})();

/**
 * Computes the two intersection points of Circle(C1, r1) and Circle(C2, r2),
 * and selects either the inner (closer to SVG_CENTER) or outer (farther from SVG_CENTER) point.
 */
function intersectCircles(
  c1: Point2D,
  r1: number,
  c2: Point2D,
  r2: number,
  chooseInner: boolean
): Point2D {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.hypot(dx, dy);

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = Math.max(0, r1 * r1 - a * a);
  const h = Math.sqrt(hSq);

  const mx = c1.x + (a * dx) / d;
  const my = c1.y + (a * dy) / d;

  const rx = (-dy * h) / d;
  const ry = (dx * h) / d;

  const p1: Point2D = { x: mx + rx, y: my + ry };
  const p2: Point2D = { x: mx - rx, y: my - ry };

  const dist1 = Math.hypot(p1.x - SVG_CENTER.x, p1.y - SVG_CENTER.y);
  const dist2 = Math.hypot(p2.x - SVG_CENTER.x, p2.y - SVG_CENTER.y);

  if (chooseInner) {
    return dist1 <= dist2 ? p1 : p2;
  }
  return dist1 > dist2 ? p1 : p2;
}

function signedCoordToRing(val: number): 0 | 1 | 2 {
  if (val > 0) return 0;
  if (val < 0) return 2;
  return 1;
}

/**
 * Maps each face to its active orbit bundle and the two intersecting bundles that form its 3x3 cluster.
 */
export const FACE_BUNDLE_MAP: Record<
  FaceId,
  {
    activeBundle: BundleId;
    gridBundles: readonly [BundleId, BundleId];
    isInnerCluster: boolean;
  }
> = {
  U: { activeBundle: "TOP", gridBundles: ["LEFT", "RIGHT"], isInnerCluster: true },
  D: { activeBundle: "TOP", gridBundles: ["LEFT", "RIGHT"], isInnerCluster: false },
  F: { activeBundle: "LEFT", gridBundles: ["TOP", "RIGHT"], isInnerCluster: true },
  B: { activeBundle: "LEFT", gridBundles: ["TOP", "RIGHT"], isInnerCluster: false },
  R: { activeBundle: "RIGHT", gridBundles: ["TOP", "LEFT"], isInnerCluster: true },
  L: { activeBundle: "RIGHT", gridBundles: ["TOP", "LEFT"], isInnerCluster: false },
};

/**
 * Returns the exact concentric ring index (0, 1, 2) for a sticker on `face`
 * with 3D coordinates `(x, y, z)` so that every rim 4-cycle of every move (U, D, L, R, F, B)
 * orbits at a strictly invariant radius R_k around its active bundle center.
 */
function getStickerRingIndices(
  face: FaceId,
  x: -1 | 0 | 1,
  y: -1 | 0 | 1,
  z: -1 | 0 | 1
): { bA: BundleId; rA: 0 | 1 | 2; bB: BundleId; rB: 0 | 1 | 2 } {
  switch (face) {
    case "U":
      return {
        bA: "LEFT",
        rA: signedCoordToRing(x),
        bB: "RIGHT",
        rB: signedCoordToRing(z),
      };
    case "D":
      return {
        bA: "LEFT",
        rA: signedCoordToRing(-x),
        bB: "RIGHT",
        rB: signedCoordToRing(-z),
      };
    case "F":
      return {
        bA: "TOP",
        rA: signedCoordToRing(x),
        bB: "RIGHT",
        rB: signedCoordToRing(-y),
      };
    case "B":
      return {
        bA: "TOP",
        rA: signedCoordToRing(-x),
        bB: "RIGHT",
        rB: signedCoordToRing(y),
      };
    case "R":
      return {
        bA: "TOP",
        rA: signedCoordToRing(-z),
        bB: "LEFT",
        rB: signedCoordToRing(-y),
      };
    case "L":
      return {
        bA: "TOP",
        rA: signedCoordToRing(z),
        bB: "LEFT",
        rB: signedCoordToRing(y),
      };
  }
}

/**
 * Precomputes the exact 2D rest coordinates for all 54 stickers (indices 0..53).
 * Every sticker lies at the exact geometric intersection of two circles from `CIRCLE_ORBITS`.
 */
export const STICKER_2D_POSITIONS: readonly Sticker2DPosition[] = (() => {
  return STICKER_METADATA.map((sticker) => {
    const { x, y, z } = sticker.position3D;
    const config = FACE_BUNDLE_MAP[sticker.face];
    const { bA, rA, bB, rB } = getStickerRingIndices(sticker.face, x, y, z);

    const pt = intersectCircles(
      BUNDLE_CENTERS[bA],
      RING_RADII[rA],
      BUNDLE_CENTERS[bB],
      RING_RADII[rB],
      config.isInnerCluster
    );

    return {
      index: sticker.index,
      face: sticker.face,
      x: pt.x,
      y: pt.y,
      orbitA: `${bA}-${rA}`,
      orbitB: `${bB}-${rB}`,
    };
  });
})();

/**
 * Geometric center of each of the 6 face clusters (the position of its center sticker).
 */
export const FACE_CLUSTER_CENTERS: Record<FaceId, Point2D> = (() => {
  const result = {} as Record<FaceId, Point2D>;
  const faces: FaceId[] = ["U", "D", "L", "R", "F", "B"];
  for (let i = 0; i < faces.length; i++) {
    const centerStickerIdx = i * 9 + 4;
    const pos = STICKER_2D_POSITIONS[centerStickerIdx];
    result[faces[i]] = { x: pos.x, y: pos.y };
  }
  return result;
})();

/**
 * Interpolates a sticker's 2D position during an animated move (`activeFace`) at progress `t` in [0, 1].
 * - Stationary stickers remain fixed.
 * - Stickers on the active face rotate around that face's center sticker.
 * - The 12 rim stickers travel at constant radius along their exact concentric circle in the active bundle.
 */
export function interpolateStickerPosition(
  srcIndex: number,
  destIndex: number,
  activeFace: BaseMove,
  t: number
): Point2D {
  const srcPos = STICKER_2D_POSITIONS[srcIndex];
  if (srcIndex === destIndex || t <= 0) {
    return { x: srcPos.x, y: srcPos.y };
  }
  const destPos = STICKER_2D_POSITIONS[destIndex];
  if (t >= 1) {
    return { x: destPos.x, y: destPos.y };
  }

  const stickerMeta = STICKER_METADATA[srcIndex];
  const pivot: Point2D =
    stickerMeta.face === activeFace
      ? FACE_CLUSTER_CENTERS[activeFace]
      : BUNDLE_CENTERS[FACE_BUNDLE_MAP[activeFace].activeBundle];

  const dx0 = srcPos.x - pivot.x;
  const dy0 = srcPos.y - pivot.y;
  const dx1 = destPos.x - pivot.x;
  const dy1 = destPos.y - pivot.y;

  const r0 = Math.hypot(dx0, dy0);
  const r1 = Math.hypot(dx1, dy1);

  const angle0 = Math.atan2(dy0, dx0);
  const angle1 = Math.atan2(dy1, dx1);

  let delta = angle1 - angle0;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;

  const currentAngle = angle0 + delta * t;
  const currentRadius = r0 + (r1 - r0) * t;

  return {
    x: pivot.x + currentRadius * Math.cos(currentAngle),
    y: pivot.y + currentRadius * Math.sin(currentAngle),
  };
}
