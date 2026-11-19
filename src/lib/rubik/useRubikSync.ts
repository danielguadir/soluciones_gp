"use client";

import { useSyncExternalStore } from "react";
import { RubikController } from "./controller";
import { CubeState, Move } from "./types";
import { LayerTransition } from "./projection3D";

export interface RubikSyncState {
  readonly cubeState: CubeState;
  readonly transition: LayerTransition | null;
  readonly history: readonly Move[];
  readonly isSolved: boolean;
  readonly isBusy: boolean;
  readonly queueLength: number;
}

/**
 * React 18 hook to subscribe to the central RubikController.
 * Ensures tear-free, perfectly synchronized updates across all 2D and 3D visualizers.
 */
export function useRubikSync(controller: RubikController): RubikSyncState {
  const cubeState = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState
  );

  const transition = useSyncExternalStore(
    controller.subscribe,
    controller.getTransition,
    () => null
  );

  const history = useSyncExternalStore(
    controller.subscribe,
    controller.getHistory,
    () => []
  );

  const isSolved = useSyncExternalStore(
    controller.subscribe,
    controller.isSolved,
    () => true
  );

  const isBusy = useSyncExternalStore(
    controller.subscribe,
    controller.isBusy,
    () => false
  );

  const queueLength = useSyncExternalStore(
    controller.subscribe,
    () => controller.getQueueLength(),
    () => 0
  );

  return {
    cubeState,
    transition,
    history,
    isSolved,
    isBusy,
    queueLength,
  };
}
