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
                  roughness={0.25}
                  metalness={0.08}
                  emissive={isFaceHovered ? 0x3b82f6 : 0x000000}
                  emissiveIntensity={isFaceHovered ? 0.35 : 0}
                />
              </mesh>
            );
          })}
        </group>
      ))}
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
