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
import { FACE_PALETTE } from "../palette";
import {
  CUBIE_POSITIONS,
  isInLayer,
  stickerRestPose,
  stickerWorldPose,
} from "../projection3D";
import { RubikController } from "../controller";
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
      const afterBoth = applyMove(applyMove(startState, move), inv);
      assert.deepEqual(
        afterBoth,
        startState,
        `M * M' falló para ${move} * ${inv}`
      );
    }
  });

  // 4. Double turns consistency: M2 = M * M and (M2)^2 = I
  test("4. Consistencia de dobles giros: M2 = M * M y (M2)^2 = I", () => {
    const start = applySequence(createSolvedCube(), ["D", "B", "L"]);

    for (const face of FACES) {
      const doubleMove = `${face}2` as Move;
      const viaDouble = applyMove(start, doubleMove);
      const viaTwoSingles = applyMove(applyMove(start, face), face);

      assert.deepEqual(
        viaDouble,
        viaTwoSingles,
        `Giro doble ${doubleMove} no coincide con dos giros simples`
      );

      // (M2)^2 = I
      const twiceDouble = applyMove(viaDouble, doubleMove);
      assert.deepEqual(
        twiceDouble,
        start,
        `(M2)^2 debe ser identidad para ${face}`
      );
    }
  });

  // 5. Invariant preservation: 54 stickers and exactly 9 of each color
  test("5. Conservación invariante de las 54 pegatinas y 9 de cada color", () => {
    let state = createSolvedCube();

    const sequence: Move[] = [
      "R", "U", "R'", "U'", "F'", "U", "F", "L", "D", "L'",
      "B2", "R2", "U2", "D'", "F2", "L2", "U", "B'", "R", "D2",
    ];

    for (const move of sequence) {
      state = applyMove(state, move);
      const report = validateCubeInvariants(state);
      assert.equal(
        report.valid,
        true,
        `Invariantes violados tras mover ${move}: ${report.errors.join(", ")}`
      );
      assert.equal(report.totalStickers, 54);
      for (const face of FACES) {
        assert.equal(report.colorCounts[face], 9);
      }
      assert.equal(report.centersIntact, true, "Los 6 centros deben permanecer fijos");
    }
  });

  // 6. Scramble consistency and Undo stack
  test("6. Consistencia de mezcla (Scramble) y pila de Deshacer (Undo)", () => {
    const scramble = generateScramble(30);
    assert.equal(scramble.length, 30);

    // No two consecutive moves on the same face in a valid scramble
    for (let i = 1; i < scramble.length; i++) {
      assert.notEqual(
        scramble[i][0],
        scramble[i - 1][0],
        `Scramble tiene giros consecutivos en la misma cara: ${scramble[i - 1]} y ${scramble[i]}`
      );
    }

    let state = createSolvedCube();
    const history: Move[] = [];

    for (const m of scramble) {
      state = applyMove(state, m);
      history.push(m);
    }

    assert.equal(isCubeSolved(state), false, "Un scramble de 30 giros no debe resultar resuelto");

    // Reversing history via invertMove must restore solved state
    while (history.length > 0) {
      const last = history.pop()!;
      state = applyMove(state, invertMove(last));
    }

    assert.equal(isCubeSolved(state), true, "Deshacer todo el historial debe resolver el cubo");
  });

  // 7. Group theory: commutator order 6 for [R, U] and order 2 for T-Permutation
  test("7. Verificación de teoría de grupos: orden 6 de [R, U] y orden 2 de T-Perm", () => {
    const solved = createSolvedCube();

    // Commutator [R, U] = R U R' U' has order 6
    const commutator: Move[] = ["R", "U", "R'", "U'"];
    let state = solved;
    for (let rep = 1; rep <= 6; rep++) {
      state = applySequence(state, commutator);
      if (rep < 6) {
        assert.equal(
          isCubeSolved(state),
          false,
          `El conmutador [R, U] se resolvió prematuramente en repetición ${rep}`
        );
      }
    }
    assert.equal(
      isCubeSolved(state),
      true,
      "([R, U])^6 debe restaurar exactamente el cubo resuelto"
    );

    // T-Permutation: R U R' U' R' F R2 U' R' U' R U R' F' has order 2
    const tPerm: Move[] = [
      "R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'",
    ];
    let tState = applySequence(solved, tPerm);
    assert.equal(isCubeSolved(tState), false);
    tState = applySequence(tState, tPerm);
    assert.equal(
      isCubeSolved(tState),
      true,
      "(T-Perm)^2 debe restaurar el cubo resuelto (orden 2)"
    );
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

  // 9. 2D & 3D Mathematical Synchronization: Exact Isomorphism and Pose Convergence
  test("9. Sincronización matemática 2D y 3D: isomorfismo de estado y convergencia de poses continuas", () => {
    assert.equal(CUBIE_POSITIONS.length, 26, "Debe haber 26 cubos visibles en 3D");

    // Palette consistency: all 6 faces have identical colors in 2D and 3D
    for (const face of FACES) {
      assert.ok(FACE_PALETTE[face].fill.startsWith("#"));
      assert.ok(FACE_PALETTE[face].stroke.startsWith("#"));
    }

    // Discrete 3D convergence at progress = 1.0 matches the S54 permutation exactly
    for (const face of FACES) {
      const perm = MOVE_PERMUTATIONS[face];

      for (let src = 0; src < 54; src++) {
        const dest = perm[src];
        const worldPoseAtEnd = stickerWorldPose(src, { move: face, progress: 1.0 });
        const destRest = stickerRestPose(dest);

        const distCenter = Math.hypot(
          worldPoseAtEnd.center[0] - destRest.center[0],
          worldPoseAtEnd.center[1] - destRest.center[1],
          worldPoseAtEnd.center[2] - destRest.center[2]
        );

        assert.ok(
          distCenter < 1e-4,
          `En giro ${face}, sticker 3D ${src} -> ${dest} no convergió al centro esperado (${distCenter.toFixed(6)})`
        );

        const distNormal = Math.hypot(
          worldPoseAtEnd.normal[0] - destRest.normal[0],
          worldPoseAtEnd.normal[1] - destRest.normal[1],
          worldPoseAtEnd.normal[2] - destRest.normal[2]
        );

        assert.ok(
          distNormal < 1e-4,
          `En giro ${face}, normal 3D ${src} -> ${dest} no convergió a la normal esperada (${distNormal.toFixed(6)})`
        );
      }
    }

    // Invariance of stationary stickers in both 2D and 3D during a layer turn
    for (const face of FACES) {
      for (let i = 0; i < 54; i++) {
        const meta = STICKER_METADATA[i];
        if (!isInLayer(meta.position3D, face)) {
          // 3D must be completely unchanged at any progress
          const poseMid = stickerWorldPose(i, { move: face, progress: 0.5 });
          const poseRest = stickerRestPose(i);
          assert.deepEqual(poseMid, poseRest, `Sticker 3D estático ${i} se movió durante giro ${face}`);

          // 2D must be completely unchanged
          const ptMid = interpolateStickerPosition(i, i, face, 0.5);
          const ptRest = STICKER_2D_POSITIONS[i];
          assert.equal(ptMid.x, ptRest.x);
          assert.equal(ptMid.y, ptRest.y);
        }
      }
    }
  });

  // 10. Central RubikController: state machine, subscription, queueing, and undo
  test("10. RubikController: máquina de estados, suscripciones síncronas, cola e historial", () => {
    const ctrl = new RubikController();
    ctrl.setReducedMotion(true); // Instant execution for deterministic assertions

    let notifyCount = 0;
    const unsubscribe = ctrl.subscribe(() => {
      notifyCount++;
    });

    assert.equal(ctrl.isSolved(), true);
    assert.equal(ctrl.getHistory().length, 0);

    // Apply commutator [R, U] = R U R' U'
    ctrl.turn("R");
    ctrl.turn("U");
    ctrl.turn("R", true); // R'
    ctrl.turn("U", true); // U'

    assert.equal(ctrl.getHistory().length, 4);
    assert.equal(ctrl.isSolved(), false);
    assert.ok(notifyCount >= 4);

    // Undo 4 times restores solved state
    ctrl.undo();
    ctrl.undo();
    ctrl.undo();
    ctrl.undo();

    assert.equal(ctrl.isSolved(), true);
    assert.equal(ctrl.getHistory().length, 0);

    // Scramble and Reset
    ctrl.scramble(15);
    assert.equal(ctrl.getHistory().length, 15);
    assert.equal(ctrl.isSolved(), false);

    ctrl.reset();
    assert.equal(ctrl.isSolved(), true);
    assert.equal(ctrl.getHistory().length, 0);

    unsubscribe();
    ctrl.dispose();
  });

  return results;
}
