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
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
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
 * Full-width 3D digital topological floor made of glowing particle points in smooth,
 * undulating terrain waves.
 *
 * Characteristics:
 * - Spans the entire screen width (full viewport background).
 * - Static: rendered with high-precision perspective with zero ongoing CPU/GPU loop.
 * - Gentle topological elevation hills & valleys mimicking digital terrain / topography.
 * - Cyber cyan, electric blue, and luminous crest highlights matching Impulso GP colors.
 */
export function TopologicalFloorLandscape({ className = "w-full h-full" }: TopologicalFloorLandscapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 450;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    // Elevated perspective looking across the topological landscape
    camera.position.set(0, 4.6, 15.0);
    camera.lookAt(0, 0.2, 3.2);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // 3. Dot Texture
    const dotTexture = createDotTexture();

    // 4. Mathematical Topological Terrain Generation
    // Grid of columns (X) and rows (Z)
    const COLS = 120; // Lateral breadth spanning wide across the screen
    const ROWS = 56;  // Depth from near foreground to distant horizon
    const totalPoints = COLS * ROWS;

    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    let pIdx = 0;
    let cIdx = 0;

    for (let r = 0; r < ROWS; r++) {
      // Z depth from foreground near camera towards the horizon
      const tz = r / (ROWS - 1);
      const z = tz * 18.0 - 1.5;

      for (let c = 0; c < COLS; c++) {
        // X lateral position spanning full screen
        const tx = c / (COLS - 1);
        const x = (tx - 0.5) * 46.0;

        // --- Smooth Topological Wave Elevation Function ---
        // A) Primary prominent wave crest (center-right, echoing reference image ridge)
        const d1 = Math.hypot((x - 2.8) / 5.8, (z - 5.2) / 4.0);
        const h1 = 3.85 * Math.exp(-0.5 * d1 * d1);

        // B) Secondary rolling wave crest on the left
        const d2 = Math.hypot((x + 9.5) / 6.4, (z - 7.2) / 4.8);
        const h2 = 2.45 * Math.exp(-0.5 * d2 * d2);

        // C) Tertiary wave crest on the far right
        const d3 = Math.hypot((x - 12.8) / 5.2, (z - 8.5) / 4.2);
        const h3 = 1.85 * Math.exp(-0.5 * d3 * d3);

        // D) Gentle harmonic undulating swell across the whole terrain
        const ripple = 0.52 * Math.sin(x * 0.28 + 1.2) * Math.cos(z * 0.26 - 0.4);

        // E) Lateral and horizon tapering for smooth edge dissipation
        const taperX = Math.exp(-Math.pow(Math.abs(x) / 21.0, 4));
        const taperZ = Math.exp(-Math.pow(Math.max(0, z - 13.5) / 3.8, 2));

        const y = (h1 + h2 + h3 + ripple) * taperX * taperZ - 1.85;

        // Position
        positions[pIdx] = x;
        positions[pIdx + 1] = y;
        positions[pIdx + 2] = z;
        pIdx += 3;

        // --- Color Gradient based on Elevation ---
        // Normalizes elevation to [0, 1]
        const normY = Math.max(0, Math.min(1, (y + 1.85) / 3.6));

        let red = 0.05;
        let green = 0.15;
        let blue = 0.32;

        if (normY < 0.28) {
          // Deep slate navy to cyan-blue
          const t = normY / 0.28;
          red = 0.04 + t * 0.04;
          green = 0.14 + t * 0.38;
          blue = 0.28 + t * 0.52;
        } else if (normY < 0.72) {
          // Cyan-blue to cyber cyan neon
          const t = (normY - 0.28) / 0.44;
          red = 0.08 + t * 0.14;
          green = 0.52 + t * 0.22;
          blue = 0.80 + t * 0.17;
        } else {
          // Luminous crest: cyber cyan to brilliant white-cyan glow
          const t = (normY - 0.72) / 0.28;
          red = 0.22 + t * 0.75;
          green = 0.74 + t * 0.26;
          blue = 0.97 + t * 0.03;
        }

        // Subtle lateral green tint on far right to harmonize with brand energy streak
        if (x > 5.0) {
          const greenFactor = Math.min(1, (x - 5.0) / 12.0) * 0.22;
          green = Math.min(1, green + greenFactor);
        }

        colors[cIdx] = red;
        colors[cIdx + 1] = green;
        colors[cIdx + 2] = blue;
        cIdx += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.165,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Initial Static Render
    const renderOnce = () => {
      renderer.render(scene, camera);
    };
    renderOnce();

    // 5. Responsive Resize Observer (re-renders only on actual container resize)
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

    // 6. Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
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
