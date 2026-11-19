import assert from "node:assert/strict";
import {
  ALL_MOVES,
  applyMove,
  applySequence,
  BASE_MOVE_CYCLES,
  createSolvedCube,
  FACES,
  generateScramble,
  invertMove,
  isCubeSolved,
  MOVE_PERMUTATIONS,
  STICKER_METADATA,
  validateCubeInvariants,
} from "../engine";
import {
  BUNDLE_CENTERS,
  CIRCLE_ORBITS,
  FACE_BUNDLE_MAP,
  interpolateStickerPosition,
  STICKER_2D_POSITIONS,
} from "../circularGeometry";
import { Move } from "../types";

export interface TestResult {
  readonly name: string;
  readonly passed: boolean;
  readonly details?: string;
}

export function runRubikEngineTestSuite(): TestResult[] {
  const results: TestResult[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({
        name,
        passed: false,
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 1. Structural anatomy: 54 stickers, 6 centers, 12 edges (24 stickers), 8 corners (24 stickers)
  test("1. Anatomía 3x3x3: 54 posiciones, 6 centros, 12 aristas (24), 8 esquinas (24)", () => {
    assert.equal(STICKER_METADATA.length, 54);
    const centers = STICKER_METADATA.filter((s) => s.role === "center");
    const edges = STICKER_METADATA.filter((s) => s.role === "edge");
    const corners = STICKER_METADATA.filter((s) => s.role === "corner");

    assert.equal(centers.length, 6, "Debe haber 6 centros");
    assert.equal(edges.length, 24, "Debe haber 24 pegatinas de arista (12 aristas)");
    assert.equal(corners.length, 24, "Debe haber 24 pegatinas de esquina (8 esquinas)");

    const solved = createSolvedCube();
    assert.equal(isCubeSolved(solved), true);
    const report = validateCubeInvariants(solved);
    assert.equal(report.valid, true);
  });

  // 2. Order 4 identity: 4 consecutive 90-degree turns of any face return to initial state
  test("2. Identidad de orden 4: 4 giros consecutivos de 90° (M^4 = I) restauran el estado", () => {
    const baseState = applySequence(createSolvedCube(), ["R", "U", "F'"]);

    for (const face of FACES) {
      let current = baseState;
      for (let i = 0; i < 4; i++) {
        current = applyMove(current, face);
        if (i < 3) {
          assert.notDeepEqual(
            current,
            baseState,
            `El giro ${face} no debe ser identidad en ${i + 1} pasos`
          );
        }
      }
      assert.deepEqual(
        current,
        baseState,
        `4 giros de ${face} deben restaurar el estado inicial`
      );

      // Also test 4 inverse turns (M')^4 = I
      const inv = `${face}'` as Move;
      let currentInv = baseState;
      for (let i = 0; i < 4; i++) {
        currentInv = applyMove(currentInv, inv);
      }
      assert.deepEqual(currentInv, baseState);
    }
  });

  // 3. Inverse identity: any move followed by its inverse restores state
  test("3. Inverso exacto: todo movimiento seguido de su inverso (M * M' = I) restaura el estado", () => {
    const startState = applySequence(createSolvedCube(), ["U", "R", "F", "L'"]);

    for (const move of ALL_MOVES) {
      const inv = invertMove(move);
      const moved = applyMove(startState, move);
      assert.notDeepEqual(moved, startState);
      const restored = applyMove(moved, inv);
      assert.deepEqual(
        restored,
        startState,
        `El movimiento ${move} seguido de ${inv} no restauró el estado`
      );
    }
  });

  // 4. Double turns consistency: M2 === M * M and (M2)^2 === I
  test("4. Consistencia de dobles giros: M2 = M * M y (M2)^2 = I", () => {
    const solved = createSolvedCube();
    for (const face of FACES) {
      const doubleMove = `${face}2` as Move;
      const viaDouble = applyMove(solved, doubleMove);
      const viaTwice = applySequence(solved, [face, face]);
      assert.deepEqual(viaDouble, viaTwice);

      const backToSolved = applyMove(viaDouble, doubleMove);
      assert.deepEqual(backToSolved, solved);
    }
  });

  // 5. Conservation of 54 stickers and color counts across complex sequences
  test("5. Conservación invariante de las 54 pegatinas y 9 de cada color", () => {
    let state = createSolvedCube();
    const scramble = generateScramble(40, () => 0.42);

    for (const move of scramble) {
      state = applyMove(state, move);
      const report = validateCubeInvariants(state);
      assert.equal(
        report.valid,
        true,
        `Invariante violado tras ${move}: ${report.errors.join(", ")}`
      );
      assert.equal(report.totalStickers, 54);
      assert.equal(report.centersIntact, true);
    }
  });

  // 6. Scramble and step-by-step Undo consistency
  test("6. Consistencia de mezcla (Scramble) y pila de Deshacer (Undo)", () => {
    const solved = createSolvedCube();
    const scramble = generateScramble(25);
    const history: Move[] = [];

    let current = solved;
    for (const m of scramble) {
      current = applyMove(current, m);
      history.push(m);
    }
    assert.equal(isCubeSolved(current), false);

    // Undo all moves in reverse LIFO order
    while (history.length > 0) {
      const lastMove = history.pop()!;
      current = applyMove(current, invertMove(lastMove));
    }

    assert.equal(isCubeSolved(current), true);
    assert.deepEqual(current, solved);
  });

  // 7. Group theory benchmark: (R U R' U')^6 = I and T-Perm^2 = I
  test("7. Verificación de teoría de grupos: orden 6 de [R, U] y orden 2 de T-Perm", () => {
    const solved = createSolvedCube();
    const commutator: Move[] = ["R", "U", "R'", "U'"];
    let state = solved;

    for (let i = 1; i <= 6; i++) {
      state = applySequence(state, commutator);
      if (i < 6) {
        assert.equal(isCubeSolved(state), false);
      }
    }
    assert.equal(isCubeSolved(state), true);

    const tPerm: Move[] = [
      "R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'",
    ];
    const once = applySequence(solved, tPerm);
    assert.equal(isCubeSolved(once), false);
    const twice = applySequence(once, tPerm);
    assert.equal(isCubeSolved(twice), true);
  });

  // 8. 2D Circular Geometry & Orbital Radius Invariance
  test("8. Geometría circular 2D: 9 órbitas, 54 intersecciones únicas y radio invariante en giros", () => {
    assert.equal(CIRCLE_ORBITS.length, 9);
    assert.equal(STICKER_2D_POSITIONS.length, 54);

    // Every sticker must have 5 disjoint 4-cycles per base move
    for (const face of FACES) {
      assert.equal(BASE_MOVE_CYCLES[face].length, 5);
    }

    // All 54 2D positions must be distinct and well-separated
    for (let i = 0; i < 54; i++) {
      for (let j = i + 1; j < 54; j++) {
        const dist = Math.hypot(
          STICKER_2D_POSITIONS[i].x - STICKER_2D_POSITIONS[j].x,
          STICKER_2D_POSITIONS[i].y - STICKER_2D_POSITIONS[j].y
        );
        assert.ok(
          dist > 10,
          `Pegatinas ${i} y ${j} están demasiado cerca (${dist.toFixed(2)}px)`
        );
      }
    }

    // For every base move, all 12 rim stickers must orbit at constant radius around the active bundle center
    for (const face of FACES) {
      const perm = MOVE_PERMUTATIONS[face];
      const bundleCenter = BUNDLE_CENTERS[FACE_BUNDLE_MAP[face].activeBundle];

      for (let src = 0; src < 54; src++) {
        const dest = perm[src];
        if (src === dest) continue;

        const meta = STICKER_METADATA[src];
        if (meta.face !== face) {
          const p0 = STICKER_2D_POSITIONS[src];
          const p1 = STICKER_2D_POSITIONS[dest];
          const r0 = Math.hypot(p0.x - bundleCenter.x, p0.y - bundleCenter.y);
          const r1 = Math.hypot(p1.x - bundleCenter.x, p1.y - bundleCenter.y);
          assert.ok(
            Math.abs(r0 - r1) < 1e-6,
            `El sticker periférico ${src} -> ${dest} en giro ${face} cambió de radio (${r0} vs ${r1})`
          );

          // Mid-animation interpolation (t = 0.5) must also stay on the exact circle radius r0
          const mid = interpolateStickerPosition(src, dest, face, 0.5);
          const rMid = Math.hypot(mid.x - bundleCenter.x, mid.y - bundleCenter.y);
          assert.ok(
            Math.abs(rMid - r0) < 1e-6,
            `Interpolación a t=0.5 se desvió de la circunferencia (${rMid} vs ${r0})`
          );
        }
      }
    }
  });

  return results;
}
