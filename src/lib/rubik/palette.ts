import { FaceId } from "./types";

/**
 * Single source of truth for sticker colors.
 * Shared by the 2D circular SVG renderer and the 3D WebGL renderer so that
 * both views paint exactly the same color for the same FaceId.
 *
 * Tailored to the Impulso GP technological identity:
 * - Pure White (#ffffff): Superior (U)
 * - Titanium Metallic Silver (#94a3b8): Frontal (F)
 * - Luminous Electric Blue (#0066ff): Derecha (R)
 * - Cyber Neon Cyan (#00d2ff): Posterior (B)
 * - Deep Tech Cobalt Navy (#1e3a8a): Izquierda (L)
 * - Graphite Slate (#334155): Inferior (D)
 */
export const FACE_PALETTE: Readonly<
  Record<FaceId, { readonly fill: string; readonly stroke: string; readonly label: string }>
> = {
  U: { fill: "#ffffff", stroke: "#e2e8f0", label: "Superior (U)" },
  D: { fill: "#334155", stroke: "#64748b", label: "Inferior (D)" },
  L: { fill: "#1e3a8a", stroke: "#3b82f6", label: "Izquierda (L)" },
  R: { fill: "#0066ff", stroke: "#60a5fa", label: "Derecha (R)" },
  F: { fill: "#94a3b8", stroke: "#cbd5e1", label: "Frontal (F)" },
  B: { fill: "#00d2ff", stroke: "#67e8f9", label: "Posterior (B)" },
};
