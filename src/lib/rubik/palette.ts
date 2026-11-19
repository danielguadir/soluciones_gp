import { FaceId } from "./types";

/**
 * Single source of truth for sticker colors.
 * Shared by the 2D circular SVG renderer and the 3D WebGL renderer so that
 * both views paint exactly the same color for the same FaceId.
 */
export const FACE_PALETTE: Readonly<
  Record<FaceId, { readonly fill: string; readonly stroke: string; readonly label: string }>
> = {
  U: { fill: "#facc15", stroke: "#fef08a", label: "Superior (U)" },
  D: { fill: "#ef4444", stroke: "#fca5a5", label: "Inferior (D)" },
  L: { fill: "#3b82f6", stroke: "#93c5fd", label: "Izquierda (L)" },
  R: { fill: "#ec4899", stroke: "#f9a8d4", label: "Derecha (R)" },
  F: { fill: "#22c55e", stroke: "#86efac", label: "Frontal (F)" },
  B: { fill: "#06b6d4", stroke: "#67e8f9", label: "Posterior (B)" },
};
