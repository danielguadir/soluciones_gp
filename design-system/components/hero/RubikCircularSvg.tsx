"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FACES,
  MOVE_PERMUTATIONS,
  STICKER_METADATA,
} from "@/lib/rubik/engine";
import {
  CIRCLE_ORBITS,
  FACE_BUNDLE_MAP,
  FACE_CLUSTER_CENTERS,
  interpolateStickerPosition,
  Point2D,
  STICKER_2D_POSITIONS,
  SVG_VIEWBOX_SIZE,
} from "@/lib/rubik/circularGeometry";
import { BaseMove, FaceId } from "@/lib/rubik/types";
import { FACE_PALETTE } from "@/lib/rubik/palette";
import { RubikController } from "@/lib/rubik/controller";
import { useRubikSync } from "@/lib/rubik/useRubikSync";
import { baseFaceOf } from "@/lib/rubik/projection3D";

export interface RubikCircularHandle {
  triggerDemoSequence: () => void;
  scramble: () => void;
  undo: () => void;
  reset: () => void;
  turn: (face: BaseMove, isInverse?: boolean) => void;
}

export interface RubikCircularSvgProps {
  controller?: RubikController;
  showControls?: boolean;
  showHeader?: boolean;
  hoveredFace?: FaceId | null;
  onHoverFace?: (face: FaceId | null) => void;
  counterClockwiseMode?: boolean;
  onToggleCounterClockwise?: () => void;
  className?: string;
}

export const RubikCircularSvg = forwardRef<RubikCircularHandle, RubikCircularSvgProps>(
  function RubikCircularSvg(
    {
      controller: externalController,
      showControls = false,
      showHeader = true,
      hoveredFace: externalHoveredFace,
      onHoverFace: externalOnHoverFace,
      counterClockwiseMode: externalCounterClockwiseMode,
      onToggleCounterClockwise: externalOnToggleCounterClockwise,
      className,
    },
    ref
  ) {
    // Internal fallback controller if none provided
    const internalControllerRef = useRef<RubikController | null>(null);
    if (!internalControllerRef.current) {
      internalControllerRef.current = new RubikController();
    }
    const controller = externalController ?? internalControllerRef.current;

    // Synchronized state hook
    const { cubeState, transition, history, isSolved, isBusy } = useRubikSync(controller);

    // Local UI state for standalone usage
    const [localHoveredFace, setLocalHoveredFace] = useState<FaceId | null>(null);
    const [localCounterClockwise, setLocalCounterClockwise] = useState(false);

    const hoveredFace = externalHoveredFace !== undefined ? externalHoveredFace : localHoveredFace;
    const setHoveredFace = externalOnHoverFace ?? setLocalHoveredFace;

    const counterClockwiseMode =
      externalCounterClockwiseMode !== undefined
        ? externalCounterClockwiseMode
        : localCounterClockwise;
    const toggleCounterClockwise =
      externalOnToggleCounterClockwise ??
      (() => setLocalCounterClockwise((prev) => !prev));

    // Expose imperative API for parent callers
    useImperativeHandle(
      ref,
      () => ({
        triggerDemoSequence: () => controller.triggerDemoSequence(),
        scramble: () => controller.scramble(),
        undo: () => controller.undo(),
        reset: () => controller.reset(),
        turn: (face: BaseMove, isInverse = false) => controller.turn(face, isInverse),
      }),
      [controller]
    );

    // Compute current 2D positions of all 54 stickers
    const currentPositions: readonly Point2D[] = useMemo(() => {
      if (!transition) {
        return STICKER_2D_POSITIONS;
      }

      const activeMove = transition.move;
      const baseFace = baseFaceOf(activeMove);
      const perm = MOVE_PERMUTATIONS[activeMove];

      return STICKER_2D_POSITIONS.map((_, index) => {
        const destIndex = perm[index];
        return interpolateStickerPosition(
          index,
          destIndex,
          baseFace,
          transition.progress
        );
      });
    }, [transition]);

    // Active bundle highlight based on currently rotating face or hovered face
    const activeFace = transition ? baseFaceOf(transition.move) : hoveredFace;
    const activeBundle = activeFace ? FACE_BUNDLE_MAP[activeFace]?.activeBundle : null;

    const handleFaceTurn = useCallback(
      (face: BaseMove, shiftKey = false) => {
        const isInverse = shiftKey ? !counterClockwiseMode : counterClockwiseMode;
        controller.turn(face, isInverse);
      },
      [controller, counterClockwiseMode]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const key = e.key.toUpperCase();
        if (["U", "D", "L", "R", "F", "B"].includes(key)) {
          e.preventDefault();
          handleFaceTurn(key as BaseMove, e.shiftKey);
        }
      },
      [handleFaceTurn]
    );

    return (
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Simulador matemático circular del Cubo de Rubik 3x3x3. Proyección de 9 órbitas continuas."
        className={
          className !== undefined
            ? `relative w-full flex flex-col items-center select-none outline-none ${className}`
            : "relative w-full max-w-[500px] mx-auto flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded-3xl p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(15,23,42,0.9)]"
        }
      >
        {/* Status header bar */}
        {showHeader && (
          <div className="w-full flex items-center justify-between px-2 mb-1 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSolved
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]"
                }`}
              />
              <span className="font-semibold text-slate-300 tracking-wide text-[11px] sm:text-xs">
                {isSolved
                  ? "Estado Canónico Resuelto (54/54)"
                  : `Movimientos: ${history.length}`}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
              Grupo S₅₄ · 9 Órbitas
            </span>
          </div>
        )}

        {/* Interactive SVG Canvas */}
        <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center touch-manipulation">
          <svg
            viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Proyección circular de 9 órbitas y 54 posiciones del cubo de Rubik"
          >
            <defs>
              <radialGradient id="rubikAmbientGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.16" />
                <stop offset="65%" stopColor="#6366f1" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient mathematical backdrop */}
            <circle
              cx={SVG_VIEWBOX_SIZE / 2}
              cy={SVG_VIEWBOX_SIZE / 2}
              r={260}
              fill="url(#rubikAmbientGlow)"
            />

            {/* 9 Circular Orbital Trajectories */}
            <g className="pointer-events-none">
              {CIRCLE_ORBITS.map((orbit) => {
                const isHighlighted = activeBundle === orbit.bundle;
                return (
                  <circle
                    key={orbit.id}
                    cx={orbit.cx}
                    cy={orbit.cy}
                    r={orbit.r}
                    fill="none"
                    stroke={isHighlighted ? "#60a5fa" : "#64748b"}
                    strokeOpacity={isHighlighted ? 0.75 : 0.28}
                    strokeWidth={isHighlighted ? 2 : 1.2}
                    className="transition-colors duration-200"
                  />
                );
              })}
            </g>

            {/* Clickable Face Cluster Hit Zones (6 Faces) */}
            <g>
              {FACES.map((face) => {
                const center = FACE_CLUSTER_CENTERS[face];
                const isHovered = hoveredFace === face;
                return (
                  <g
                    key={`cluster-${face}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFaceTurn(face, e.shiftKey);
                    }}
                    onMouseEnter={() => setHoveredFace(face)}
                    onMouseLeave={() => setHoveredFace(null)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={-1}
                    aria-label={`Girar capa ${FACE_PALETTE[face].label}`}
                  >
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r={44}
                      fill={FACE_PALETTE[face].fill}
                      fillOpacity={isHovered ? 0.14 : 0.02}
                      stroke={FACE_PALETTE[face].fill}
                      strokeOpacity={isHovered ? 0.5 : 0}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                  </g>
                );
              })}
            </g>

            {/* 54 Colored Sticker Nodes */}
            <g>
              {STICKER_METADATA.map((meta) => {
                const colorFace = cubeState[meta.index];
                const palette = FACE_PALETTE[colorFace];
                const pt = currentPositions[meta.index];
                const isCenter = meta.role === "center";
                const isDarkSticker = ["#1e3a8a", "#334155", "#0066ff"].includes(palette.fill);

                return (
                  <g
                    key={meta.index}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFaceTurn(meta.face, e.shiftKey);
                    }}
                    onMouseEnter={() => setHoveredFace(meta.face)}
                    onMouseLeave={() => setHoveredFace(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isCenter ? 10.5 : 9}
                      fill={palette.fill}
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                    <circle
                      r={isCenter ? 10.5 : 9}
                      fill="none"
                      stroke={palette.stroke}
                      strokeOpacity={0.7}
                      strokeWidth={1}
                    />
                    {isCenter && (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isDarkSticker ? "#ffffff" : "#0f172a"}
                        fontSize="9"
                        fontWeight="800"
                        className="pointer-events-none select-none"
                      >
                        {meta.face}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Optional Embedded Controls for Standalone Mode */}
        {showControls && (
          <div className="w-full flex flex-col gap-2.5 mt-2">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {FACES.map((face) => (
                  <button
                    key={face}
                    type="button"
                    onClick={() => handleFaceTurn(face)}
                    onMouseEnter={() => setHoveredFace(face)}
                    onMouseLeave={() => setHoveredFace(null)}
                    title={`Girar capa ${FACE_PALETTE[face].label}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 hover:border-blue-400/50 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: FACE_PALETTE[face].fill }}
                    />
                    <span>{counterClockwiseMode ? `${face}'` : face}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleCounterClockwise}
                aria-pressed={counterClockwiseMode}
                title="Alternar sentido horario (90°) / antihorario (-90°)"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  counterClockwiseMode
                    ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-200"
                    : "bg-slate-800/60 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {counterClockwiseMode ? "↺ Antihorario" : "↻ Horario"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => controller.scramble()}
                disabled={isBusy}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 border border-blue-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>⇄</span>
                <span>Mezclar</span>
              </button>

              <button
                type="button"
                onClick={() => controller.undo()}
                disabled={history.length === 0 || isBusy}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>↶</span>
                <span>Deshacer</span>
              </button>

              <button
                type="button"
                onClick={() => controller.reset()}
                disabled={isSolved && history.length === 0}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>⟲</span>
                <span>Reiniciar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default RubikCircularSvg;
