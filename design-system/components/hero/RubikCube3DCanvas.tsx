"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RubikController } from "@/lib/rubik/controller";
import { useRubikSync } from "@/lib/rubik/useRubikSync";
import {
  axisAngleQuaternion,
  baseFaceOf,
  CUBIE_POSITIONS,
  FACE_AXIS,
  isInLayer,
  layerAngle,
  planeEulerForNormal,
  rotateVec,
  STICKER_OFFSET,
  Vec3,
} from "@/lib/rubik/projection3D";
import { STICKER_METADATA } from "@/lib/rubik/engine";
import { FACE_PALETTE } from "@/lib/rubik/palette";
import { FaceId, StickerMetadata } from "@/lib/rubik/types";

export interface RubikCube3DCanvasProps {
  controller: RubikController;
  onHoverFace?: (face: FaceId | null) => void;
  hoveredFace?: FaceId | null;
  counterClockwise?: boolean;
  className?: string;
}

/** Pre-maps each cubie coordinate to the stickers that reside on it */
interface CubieData {
  readonly pos0: Vec3;
  readonly key: string;
  readonly stickers: readonly StickerMetadata[];
}

function buildCubieData(): readonly CubieData[] {
  return CUBIE_POSITIONS.map((pos) => {
    const key = `${pos[0]},${pos[1]},${pos[2]}`;
    const stickers = STICKER_METADATA.filter(
      (m) =>
        m.position3D.x === pos[0] &&
        m.position3D.y === pos[1] &&
        m.position3D.z === pos[2]
    );
    return { pos0: pos, key, stickers };
  });
}

const CUBIES_STATIC_DATA = buildCubieData();

/**
 * Camera and Orbit Controls with smooth damping and bounds.
 */
function DampedCameraControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 3.8;
    controls.maxDistance = 8.0;
    controls.rotateSpeed = 0.9;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}

/**
 * Renders the 26 physical cubies and their 54 stickers.
 * Rotates moving layers during transitions at 60-120 FPS via useFrame.
 */
function RubikScene({
  controller,
  onHoverFace,
  hoveredFace,
  counterClockwise,
}: {
  controller: RubikController;
  onHoverFace?: (face: FaceId | null) => void;
  hoveredFace?: FaceId | null;
  counterClockwise?: boolean;
}) {
  const { cubeState } = useRubikSync(controller);
  const cubieRefs = useRef<Array<THREE.Group | null>>([]);

  // Shared reusable geometries and materials for performance
  const cubieGeometry = useMemo(() => new THREE.BoxGeometry(0.92, 0.92, 0.92), []);
  const cubieBodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.45,
        metalness: 0.2,
      }),
    []
  );

  const stickerGeometry = useMemo(() => new THREE.PlaneGeometry(0.82, 0.82), []);

  // Update transforms of the 26 cubies at render rate
  useFrame(() => {
    const transition = controller.getTransition();

    for (let i = 0; i < CUBIES_STATIC_DATA.length; i++) {
      const group = cubieRefs.current[i];
      if (!group) continue;

      const { pos0 } = CUBIES_STATIC_DATA[i];

      if (transition && isInLayer(pos0, transition.move)) {
        const face = baseFaceOf(transition.move);
        const axis = FACE_AXIS[face];
        const theta = layerAngle(transition.move, transition.progress);

        const currentPos = rotateVec(pos0, axis, theta);
        const q = axisAngleQuaternion(axis, theta);

        group.position.set(currentPos[0], currentPos[1], currentPos[2]);
        group.quaternion.set(q[0], q[1], q[2], q[3]);
      } else {
        group.position.set(pos0[0], pos0[1], pos0[2]);
        group.quaternion.set(0, 0, 0, 1);
      }
    }
  });

  // Clean up geometries on unmount
  useEffect(() => {
    return () => {
      cubieGeometry.dispose();
      cubieBodyMaterial.dispose();
      stickerGeometry.dispose();
    };
  }, [cubieGeometry, cubieBodyMaterial, stickerGeometry]);

  return (
    <group>
      {CUBIES_STATIC_DATA.map((cubie, cubieIdx) => (
        <group
          key={cubie.key}
          ref={(el) => {
            cubieRefs.current[cubieIdx] = el;
          }}
          position={[cubie.pos0[0], cubie.pos0[1], cubie.pos0[2]]}
        >
          {/* Dark cubie body */}
          <mesh
            geometry={cubieGeometry}
            material={cubieBodyMaterial}
            castShadow
            receiveShadow
          />

          {/* Outward sticker faces */}
          {cubie.stickers.map((meta) => {
            const stickerColor = FACE_PALETTE[cubeState[meta.index]].fill;
            const isFaceHovered = hoveredFace === meta.face;
            const euler = planeEulerForNormal(meta.normal3D);

            const isBlueNeon = stickerColor === "#0066ff";
            const isCyanNeon = stickerColor === "#00d2ff";

            return (
              <mesh
                key={meta.index}
                geometry={stickerGeometry}
                position={[
                  meta.normal3D.x * STICKER_OFFSET,
                  meta.normal3D.y * STICKER_OFFSET,
                  meta.normal3D.z * STICKER_OFFSET,
                ]}
                rotation={[euler[0], euler[1], euler[2]]}
                onClick={(e) => {
                  e.stopPropagation();
                  controller.turn(meta.face, counterClockwise);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  onHoverFace?.(meta.face);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  onHoverFace?.(null);
                }}
              >
                <meshStandardMaterial
                  color={stickerColor}
                  roughness={stickerColor === "#ffffff" ? 0.15 : stickerColor === "#94a3b8" ? 0.3 : 0.25}
                  metalness={stickerColor === "#94a3b8" ? 0.35 : 0.08}
                  emissive={
                    isFaceHovered
                      ? 0x38bdf8
                      : isBlueNeon
                      ? 0x0044cc
                      : isCyanNeon
                      ? 0x005577
                      : 0x000000
                  }
                  emissiveIntensity={
                    isFaceHovered ? 0.5 : isBlueNeon ? 0.3 : isCyanNeon ? 0.2 : 0
                  }
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * Active 3D Orbital Ring with a revolving luminous photon/satellite around the Rubik's Cube.
 */
function OrbitalRing3D() {
  const satelliteRef = useRef<THREE.Mesh>(null);
  const ringRotation = useMemo<[number, number, number]>(() => [0.45, 0.25, -0.28], []);

  const linePoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 3.5, 2.1, 0, 2 * Math.PI, false, 0);
    const pts = curve.getPoints(96);
    return pts.map((p) => new THREE.Vector3(p.x, 0, p.y));
  }, []);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
  }, []);

  const lineLoop = useMemo(() => {
    return new THREE.LineLoop(lineGeometry, lineMaterial);
  }, [lineGeometry, lineMaterial]);

  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [lineGeometry, lineMaterial]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.75;
    if (satelliteRef.current) {
      const angle = t % (2 * Math.PI);
      const x = 3.5 * Math.cos(angle);
      const z = 2.1 * Math.sin(angle);
      const v = new THREE.Vector3(x, 0, z);
      v.applyEuler(new THREE.Euler(ringRotation[0], ringRotation[1], ringRotation[2]));
      satelliteRef.current.position.copy(v);
    }
  });

  return (
    <group>
      <primitive object={lineLoop} rotation={ringRotation} />
      <mesh ref={satelliteRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" />
        <pointLight color="#38bdf8" intensity={1.8} distance={2.5} />
      </mesh>
    </group>
  );
}

/**
 * 3D Checkerboard CAD Floor ("Piso en Cuadros 3D")
 * Directly derived from the user's project architecture and tailored for Impulso GP:
 * - Static floor where the Rubik's Cube rests at [0, -2.15, 0]
 * - Base floor plane with subtle tech navy material
 * - Dual grid lines (minor 1x1 in cyan-blue, master 2x2 in neon cyan)
 * - Alternating solid checker tiles (dark slate / tech navy)
 * - Soft radial contact shadow and ambient grounding glow
 */
function PisoEnCuadros3D({ position = [0, -2.15, 0] }: { position?: [number, number, number] }) {
  // Precompute 1x1 alternating checker tiles (checkerboard pattern)
  const checkerTiles = useMemo(() => {
    const tiles: [number, number][] = [];
    for (let ix = -8; ix < 8; ix++) {
      for (let iz = -8; iz < 8; iz++) {
        if ((ix + iz) % 2 === 0) {
          tiles.push([ix + 0.5, iz + 0.5]);
        }
      }
    }
    return tiles;
  }, []);

  const cellColor = "#1e3a8a";   // Electric tech navy
  const sectionColor = "#0284c7"; // Cyan blue
  const majorColor = "#38bdf8";   // Cyber neon cyan
  const tileColor = "#0f172a";    // Dark slate tile

  return (
    <group position={position}>
      {/* Subtle radial ground disc with soft alpha so background stars and waves remain visible */}
      <mesh position={[0, -0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 36]} />
        <meshBasicMaterial color="#070d1e" transparent opacity={0.35} />
      </mesh>

      {/* Minor 1x1 CAD grid lines */}
      <gridHelper args={[18, 18, sectionColor, cellColor]} position={[0, 0.001, 0]} />

      {/* Master 2x2 CAD grid lines */}
      <gridHelper args={[18, 9, majorColor, sectionColor]} position={[0, 0.003, 0]} />

      {/* Solid alternating checker tiles ("Piso en cuadritos") */}
      {checkerTiles.map(([tx, tz], idx) => (
        <mesh key={idx} position={[tx, -0.002, tz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.96, 0.96]} />
          <meshBasicMaterial color={tileColor} transparent opacity={0.42} />
        </mesh>
      ))}

      {/* Soft contact shadow directly under the Rubik's cube */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.0, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Luminous cyan grounding reflection glow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function RubikCube3DCanvas({
  controller,
  onHoverFace,
  hoveredFace,
  counterClockwise,
  className = "w-full h-full min-h-[340px] sm:min-h-[400px]",
}: RubikCube3DCanvasProps) {
  return (
    <div className={`relative ${className} select-none cursor-grab active:cursor-grabbing`}>
      <Canvas
        camera={{ position: [3.8, 3.2, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Crisp Enterprise 3-point Lighting */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[6, 8, 7]} intensity={1.15} />
        <directionalLight position={[-6, -4, -6]} intensity={0.4} color="#93c5fd" />
        <directionalLight position={[0, 6, -6]} intensity={0.3} color="#f8fafc" />

        {/* 3D Checkerboard CAD Floor resting beneath the Cube */}
        <PisoEnCuadros3D />

        {/* Active 3D Orbital Ring with Revolving Satellite Photon */}
        <OrbitalRing3D />

        {/* 3D Rubik Scene */}
        <RubikScene
          controller={controller}
          onHoverFace={onHoverFace}
          hoveredFace={hoveredFace}
          counterClockwise={counterClockwise}
        />

        {/* Orbit Camera Controls */}
        <DampedCameraControls />
      </Canvas>
    </div>
  );
}

export default RubikCube3DCanvas;
