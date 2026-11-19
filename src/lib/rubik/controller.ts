import {
  applyMove,
  createSolvedCube,
  generateScramble,
  invertMove,
  isCubeSolved,
} from "./engine";
import { LayerTransition } from "./projection3D";
import { BaseMove, CubeState, Move } from "./types";

export interface EnqueueOptions {
  durationMs?: number;
  recordInHistory?: boolean;
}

interface QueuedMove {
  readonly move: Move;
  readonly durationMs: number;
  readonly recordInHistory: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Unified, framework-agnostic mathematical state and animation controller
 * for the Rubik's Cube.
 *
 * Coordinates both the 2D circular projection and the 3D WebGL cube through
 * an observable pattern, guaranteeing identical state ($S_{54}$) and
 * mathematically synchronized rotational transitions at all times.
 */
export class RubikController {
  private state: CubeState = createSolvedCube();
  private history: Move[] = [];
  private transition: LayerTransition | null = null;
  private queue: QueuedMove[] = [];
  private listeners: Set<() => void> = new Set();
  private rafId: number | null = null;
  private reducedMotion = false;
  private isDisposed = false;

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getState = this.getState.bind(this);
    this.getTransition = this.getTransition.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.isSolved = this.isSolved.bind(this);
    this.isBusy = this.isBusy.bind(this);
  }

  // --- Subscription API (compatible with React useSyncExternalStore) ---

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    if (this.isDisposed) return;
    for (const listener of this.listeners) {
      listener();
    }
  }

  // --- Getters ---

  public getState(): CubeState {
    return this.state;
  }

  public getHistory(): readonly Move[] {
    return this.history;
  }

  public getTransition(): LayerTransition | null {
    return this.transition;
  }

  public isSolved(): boolean {
    return isCubeSolved(this.state);
  }

  public isBusy(): boolean {
    return this.transition !== null || this.queue.length > 0;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  // --- Configuration ---

  public setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
  }

  // --- Actions ---

  /**
   * Turns a single face by 90 degrees (or -90 if isInverse is true).
   */
  public turn(face: BaseMove, isInverse = false, durationMs = 380): void {
    const move: Move = isInverse ? (`${face}'` as Move) : face;
    this.enqueueMoves([move], { durationMs, recordInHistory: true });
  }

  /**
   * Enqueues a sequence of moves to be executed sequentially.
   */
  public enqueueMoves(moves: readonly Move[], options: EnqueueOptions = {}): void {
    if (this.isDisposed || moves.length === 0) return;

    const durationMs = options.durationMs ?? 380;
    const recordInHistory = options.recordInHistory ?? true;

    for (const move of moves) {
      this.queue.push({ move, durationMs, recordInHistory });
    }

    if (this.transition === null) {
      this.processQueue();
    }
  }

  /**
   * Instant move execution (bypasses transition animation).
   */
  public applyInstant(move: Move, recordInHistory = true): void {
    this.state = applyMove(this.state, move);
    if (recordInHistory) {
      this.history.push(move);
    }
    this.notify();
  }

  /**
   * Scrambles the cube with a sequence of valid moves.
   */
  public scramble(length = 20): void {
    this.stopAnimation();
    this.queue = [];
    const scrambleMoves = generateScramble(length);

    if (this.reducedMotion) {
      for (const m of scrambleMoves) {
        this.state = applyMove(this.state, m);
      }
      this.history.push(...scrambleMoves);
      this.notify();
      return;
    }

    // Play scramble briskly so user sees the rapid transformation
    this.enqueueMoves(scrambleMoves, { durationMs: 140, recordInHistory: true });
  }

  /**
   * Undoes the last performed move by applying its mathematical inverse.
   */
  public undo(): void {
    if (this.history.length === 0 || this.isBusy()) return;

    const lastMove = this.history[this.history.length - 1];
    const inverse = invertMove(lastMove);

    // Apply inverse and pop from history upon completion
    this.queue.push({
      move: inverse,
      durationMs: 320,
      recordInHistory: false,
    });

    this.history.pop();
    this.processQueue();
  }

  /**
   * Resets the cube to the solved state immediately.
   */
  public reset(): void {
    this.stopAnimation();
    this.queue = [];
    this.state = createSolvedCube();
    this.history = [];
    this.transition = null;
    this.notify();
  }

  /**
   * Triggers an elegant mathematical demonstration sequence:
   * Commutator [R, U] = R U R' U', demonstrating group action without disruption.
   */
  public triggerDemoSequence(): void {
    if (this.isBusy()) return;
    const commutator: readonly Move[] = ["R", "U", "R'", "U'"];
    this.enqueueMoves(commutator, { durationMs: 360, recordInHistory: true });
  }

  // --- Animation Loop ---

  private processQueue(): void {
    if (this.isDisposed || this.transition !== null) return;

    if (this.queue.length === 0) {
      this.notify();
      return;
    }

    const item = this.queue.shift()!;

    if (this.reducedMotion) {
      this.state = applyMove(this.state, item.move);
      if (item.recordInHistory) {
        this.history.push(item.move);
      }
      this.notify();
      // Process remaining instantly
      if (this.queue.length > 0) {
        this.processQueue();
      }
      return;
    }

    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    const durationMs = Math.max(50, item.durationMs);

    const step = (now: number) => {
      if (this.isDisposed) return;

      const elapsed = now - startTime;
      const rawProgress = Math.min(1, Math.max(0, elapsed / durationMs));
      const easedProgress = easeInOutCubic(rawProgress);

      if (rawProgress < 1) {
        this.transition = {
          move: item.move,
          progress: easedProgress,
        };
        this.notify();
        this.rafId = requestAnimationFrame(step);
      } else {
        // Commit discrete permutation
        this.state = applyMove(this.state, item.move);
        if (item.recordInHistory) {
          this.history.push(item.move);
        }
        this.transition = null;
        this.notify();
        this.processQueue();
      }
    };

    if (typeof requestAnimationFrame !== "undefined") {
      this.rafId = requestAnimationFrame(step);
    } else {
      // Non-browser fallback
      this.state = applyMove(this.state, item.move);
      if (item.recordInHistory) {
        this.history.push(item.move);
      }
      this.notify();
    }
  }

  private stopAnimation(): void {
    if (this.rafId !== null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.transition = null;
  }

  public dispose(): void {
    this.isDisposed = true;
    this.stopAnimation();
    this.queue = [];
    this.listeners.clear();
  }
}
