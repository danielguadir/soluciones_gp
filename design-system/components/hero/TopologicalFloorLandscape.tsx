"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface TopologicalFloorLandscapeProps {
  className?: string;
}

/**
 * Creates a soft circular particle glow texture for antialiased, glowing point dots.
 */
function createDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.22, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.52, "rgba(255, 255, 255, 0.35)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * TopologicalFloorLandscape:
 * Full-width 3D digital topological floor made of glowing particle points & subtle CAD contours.
 *
 * Mathematically synchronized with the energy curves of `inicio1_pw.png`:
 * - Left flank (X < 0): Follows the cyber-blue digital stream with deep navy, electric blue & cyan.
 * - Center nexus (X ≈ 0): Concentrates at the central starburst flare directly beneath the Rubik's Cube.
 * - Right flank (X > 0): Soars upward following the neon lime-green / emerald arrow trajectory.
 * - Completely static: Zero animation loop overhead (0% GPU/CPU idle drain, 60 FPS fluid scroll).
 */
export function TopologicalFloorLandscape({ className = "w-full h-full" }: TopologicalFloorLandscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 480;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 90);
    // Elevated perspective looking down and across the topological landscape
    camera.position.set(0, 4.8, 15.2);
    camera.lookAt(0, 0.25, 3.4);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // 3. Dot Texture for soft point glow
    const dotTexture = createDotTexture();

    // 4. Mathematical Topological Terrain Generation
    const COLS = 120; // Lateral span across the entire screen
    const ROWS = 56;  // Depth from foreground near camera towards the horizon
    const totalPoints = COLS * ROWS;

    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    // Lateral line segments for subtle CAD contour lines
    const lineIndices: number[] = [];

    let pIdx = 0;
    let cIdx = 0;

    for (let r = 0; r < ROWS; r++) {
      const tz = r / (ROWS - 1);
      // Z depth from near foreground (z = -1.5) to distant horizon (z = 16.5)
      const z = tz * 18.0 - 1.5;

      for (let c = 0; c < COLS; c++) {
        const tx = c / (COLS - 1);
        // X lateral position spanning full screen (-23 to +23 in world units)
        const x = (tx - 0.5) * 46.0;

        // --- Topological Elevation Mathematically Mapped to inicio1_pw.png ---
        // A) Left Wave Crest (Under Left Text Column & Gears):
        // Peaks at x ≈ -9.5, z ≈ 6.2 with cyber-blue wave elevation
        const dLeft = Math.hypot((x + 9.5) / 6.2, (z - 6.2) / 4.4);
        const hLeft = 2.35 * Math.exp(-0.5 * dLeft * dLeft);

        // B) Center Nexus Platform (Under Rubik's Cube & Starburst Flare):
        // Focal convergence point where blue and green energy streams meet
        const dCenter = Math.hypot(x / 4.8, (z - 5.0) / 3.6);
        const hCenter = 1.35 * Math.exp(-0.5 * dCenter * dCenter);

        // C) Right Ascending Wave Crest (Under 2D Projection & Soaring Green Arrow):
        // Follows the ascending trajectory of the arrow, rising higher (Y ≈ 3.85) and sweeping upward
        const dRight = Math.hypot((x - 11.2) / 6.8, (z - (5.2 - 0.22 * (x - 11.2))) / 4.6);
        const hRight = 3.85 * Math.exp(-0.5 * dRight * dRight);

        // D) Gentle Harmonic Undulation across the terrain
        const ripple = 0.38 * Math.sin(x * 0.25 - 0.18 * z + 0.8) * Math.cos(0.18 * x + 0.22 * z);

        // E) Lateral and Horizon Edge Tapering for smooth visual dissipation
        const taperX = Math.exp(-Math.pow(Math.abs(x) / 21.0, 4));
        const taperZ = Math.exp(-Math.pow(Math.max(0, z - 13.5) / 3.8, 2));

        const y = (hLeft + hCenter + hRight + ripple) * taperX * taperZ - 1.78;

        positions[pIdx] = x;
        positions[pIdx + 1] = y;
        positions[pIdx + 2] = z;
        pIdx += 3;

        // --- Color Gradient Synchronized with inicio1_pw.png ---
        // Normalized elevation for vertical tone mapping
        const normY = Math.max(0, Math.min(1, (y + 1.78) / 3.8));

        let red = 0.04;
        let green = 0.15;
        let blue = 0.32;

        if (x < -2.5) {
          // --- LEFT FLANK: Cyber Blue & Electric Cyan Stream ---
          if (normY < 0.35) {
            // Deep slate navy to royal cyan
            const t = normY / 0.35;
            red = 0.03 + t * 0.04;
            green = 0.12 + t * 0.38;
            blue = 0.26 + t * 0.52;
          } else if (normY < 0.75) {
            // Royal cyan to cyber cyan neon
            const t = (normY - 0.35) / 0.40;
            red = 0.07 + t * 0.15;
            green = 0.50 + t * 0.26;
            blue = 0.78 + t * 0.20;
          } else {
            // Luminous crest highlight
            const t = (normY - 0.75) / 0.25;
            red = 0.22 + t * 0.76;
            green = 0.76 + t * 0.24;
            blue = 0.98 + t * 0.02;
          }
        } else if (x <= 2.5) {
          // --- CENTER NEXUS: Convergent Starburst Flare ---
          // Intense white-cyan focal core under the Rubik's Cube
          const t = normY;
          red = 0.15 + t * 0.82;
          green = 0.65 + t * 0.35;
          blue = 0.92 + t * 0.08;
        } else {
          // --- RIGHT FLANK: Neon Lime & Vibrant Emerald Stream ---
          // Transition: Cyan-Lime -> Chartreuse -> Neon Emerald -> Forest Green
          const xProgress = Math.min(1, (x - 2.5) / 16.0);

          if (normY < 0.35) {
            // Deep navy-emerald base
            const t = normY / 0.35;
            red = 0.03 + t * 0.12;
            green = 0.18 + t * 0.45;
            blue = 0.18 - t * 0.08;
          } else if (normY < 0.75) {
            // Neon lime-green / chartreuse body
            const t = (normY - 0.35) / 0.40;
            red = 0.15 + t * (0.45 + xProgress * 0.15);
            green = 0.63 + t * 0.34;
            blue = 0.10 - t * 0.04;
          } else {
            // Radiant yellow-green / white-lime crest
            const t = (normY - 0.75) / 0.25;
            red = 0.60 + t * 0.38;
            green = 0.97 + t * 0.03;
            blue = 0.08 + t * 0.65;
          }
        }

        colors[cIdx] = red;
        colors[cIdx + 1] = green;
        colors[cIdx + 2] = blue;
        cIdx += 3;

        // Build horizontal contour line segments
        const currentIdx = r * COLS + c;
        if (c < COLS - 1) {
          lineIndices.push(currentIdx, currentIdx + 1);
        }
      }
    }

    // 5. Point Cloud Mesh
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.17,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointCloud);

    // 6. Subtle CAD Contour Wireframe Lines
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    linesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    linesGeometry.setIndex(lineIndices);

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.11,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const contourLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(contourLines);

    // 7. Initial Static Render (0 animation loop overhead)
    const renderOnce = () => {
      renderer.render(scene, camera);
    };
    renderOnce();

    // 8. Responsive Resize Observer (re-renders only on real window/container resize)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          width = cr.width;
          height = cr.height;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderOnce();
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none select-none" />
    </div>
  );
}

export default TopologicalFloorLandscape;
