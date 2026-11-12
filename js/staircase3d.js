/**
 * Motor 3D procedural sin dependencias para escalera helicoidal en acero inoxidable y vidrio.
 * Dibuja zancas curvadas metálicas con sombreado especular dinámico, peldaños de vidrio laminado,
 * montantes y pasamanos continuos. Se sincroniza con el scroll de página y respeta
 * `prefers-reduced-motion` y visibilidad en viewport mediante IntersectionObserver.
 */

export class HelicalStaircase3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.options = {
      steps: options.steps ?? 20,
      turns: options.turns ?? 0.92,
      innerRadius: options.innerRadius ?? 0.56,
      outerRadius: options.outerRadius ?? 1.56,
      height: options.height ?? 3.3,
      tiltX: options.tiltX ?? 0.28,
      baseAngle: options.baseAngle ?? -0.65,
      mode: options.mode ?? "finished", // 'cad' | 'steel' | 'finished'
      scrollSpanMultiplier: options.scrollSpanMultiplier ?? Math.PI * 2.2,
      centerOffsetX: options.centerOffsetX ?? 0.14,
      scaleFactor: options.scaleFactor ?? 0.25,
      onAngleChange: options.onAngleChange ?? null
    };

    this.currentAngle = this.options.baseAngle;
    this.targetAngle = this.options.baseAngle;
    this.pointerOffsetX = 0;
    this.pointerOffsetY = 0;
    this.isVisible = true;
    this.rafId = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.handleResize = this.resize.bind(this);
    this.tick = this.renderLoop.bind(this);

    this.resize();
    this.observeVisibility();
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.draw();
  }

  setMode(mode) {
    if (this.options.mode !== mode) {
      this.options.mode = mode;
      if (this.reducedMotion || !this.rafId) {
        this.draw();
      }
    }
  }

  setScrollProgress(progress) {
    const clamped = Math.min(1, Math.max(0, progress));
    if (this.reducedMotion) {
      this.currentAngle = this.options.baseAngle;
      this.targetAngle = this.options.baseAngle;
      return;
    }
    this.targetAngle = this.options.baseAngle + clamped * this.options.scrollSpanMultiplier;
    this.ensureRunning();
  }

  setPointerTilt(nx, ny) {
    if (this.reducedMotion) return;
    this.pointerOffsetX = nx * 0.18;
    this.pointerOffsetY = ny * 0.08;
    this.ensureRunning();
  }

  observeVisibility() {
    if (!("IntersectionObserver" in window)) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.reducedMotion) {
            this.ensureRunning();
          }
        });
      },
      { threshold: 0.02 }
    );
    this.observer.observe(this.canvas);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  ensureRunning() {
    if (this.rafId || this.reducedMotion || !this.isVisible) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  renderLoop() {
    if (!this.isVisible || this.reducedMotion) {
      this.rafId = null;
      return;
    }

    const diff = this.targetAngle - this.currentAngle;
    if (Math.abs(diff) > 0.0008) {
      this.currentAngle += diff * 0.12;
      this.draw();
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.currentAngle = this.targetAngle;
      this.draw();
      this.rafId = null;
    }
  }

  project(p, yaw, pitch) {
    // Rotación alrededor del eje Y (giro de la escalera al hacer scroll)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = p.x * cosY - p.z * sinY;
    const z1 = p.x * sinY + p.z * cosY;

    // Inclinación arquitectónica de cámara en X
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    const y2 = p.y * cosX - z1 * sinX;
    const z2 = p.y * sinX + z1 * cosX;

    const camDist = 5.4;
    const fov = Math.min(this.width, this.height) * this.options.scaleFactor * 3.1;
    const zDepth = z2 + camDist;
    const scale = fov / Math.max(0.8, zDepth);

    const cx = this.width * (0.5 + this.options.centerOffsetX);
    const cy = this.height * 0.51;

    return {
      x: cx + x1 * scale,
      y: cy - y2 * scale,
      z: zDepth,
      rx: x1,
      ry: y2,
      rz: z2
    };
  }

  draw() {
    if (!this.width || !this.height) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const yaw = this.currentAngle + this.pointerOffsetX;
    const pitch = this.options.tiltX + this.pointerOffsetY;
    const mode = this.options.mode;

    if (typeof this.options.onAngleChange === "function") {
      const deg = Math.round((((this.currentAngle - this.options.baseAngle) * 180) / Math.PI) % 360);
      this.options.onAngleChange(deg < 0 ? deg + 360 : deg);
    }

    const { steps, turns, innerRadius, outerRadius, height } = this.options;
    const totalTheta = Math.PI * 2 * turns;
    const stepAngle = totalTheta / steps;
    const stepRise = height / steps;
    const yStart = -height * 0.5;
    const stringerDepth = 0.24;

    // Halo ambiental sutil bajo la escalera
    const cx = this.width * (0.5 + this.options.centerOffsetX);
    const cy = this.height * 0.52;
    const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(this.width, this.height) * 0.48);
    if (mode === "cad") {
      halo.addColorStop(0, "rgba(56, 189, 248, 0.14)");
      halo.addColorStop(1, "rgba(14, 17, 22, 0)");
    } else {
      halo.addColorStop(0, "rgba(210, 225, 242, 0.12)");
      halo.addColorStop(0.55, "rgba(120, 145, 175, 0.04)");
      halo.addColorStop(1, "rgba(14, 15, 18, 0)");
    }
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, this.width, this.height);

    const drawables = [];

    // 1. Eje central / núcleo sutil en modo CAD y referencias radiales de cota
    if (mode === "cad") {
      const axisBot = this.project({ x: 0, y: yStart - 0.3, z: 0 }, yaw, pitch);
      const axisTop = this.project({ x: 0, y: -yStart + 0.4, z: 0 }, yaw, pitch);
      drawables.push({
        z: 6.2,
        type: "line",
        p1: axisBot,
        p2: axisTop,
        stroke: "rgba(56, 189, 248, 0.45)",
        width: 1.2,
        dash: [6, 6]
      });
    }

    // 2. Zancas helicoidales (cinta metálica interior y exterior en AISI 316L)
    const stringerSegments = steps * 2;
    const segTheta = totalTheta / stringerSegments;
    const segRise = height / stringerSegments;

    [innerRadius, outerRadius].forEach((radius, rIdx) => {
      const isOuter = rIdx === 1;
      for (let i = 0; i < stringerSegments; i++) {
        const t0 = i * segTheta;
        const t1 = (i + 1) * segTheta;
        const y0 = yStart + i * segRise;
        const y1 = yStart + (i + 1) * segRise;

        const pA = this.project({ x: Math.cos(t0) * radius, y: y0, z: Math.sin(t0) * radius }, yaw, pitch);
        const pB = this.project({ x: Math.cos(t1) * radius, y: y1, z: Math.sin(t1) * radius }, yaw, pitch);
        const pC = this.project(
          { x: Math.cos(t1) * radius, y: y1 - stringerDepth, z: Math.sin(t1) * radius },
          yaw,
          pitch
        );
        const pD = this.project(
          { x: Math.cos(t0) * radius, y: y0 - stringerDepth, z: Math.sin(t0) * radius },
          yaw,
          pitch
        );

        const avgZ = (pA.z + pB.z + pC.z + pD.z) * 0.25;
        // Normal aproximada mirando hacia la dirección radial tras rotación
        const midAngle = (t0 + t1) * 0.5 + yaw;
        const lightDot = Math.cos(midAngle - 0.85) * 0.5 + 0.5;

        let fill = "transparent";
        let stroke = "rgba(255,255,255,0.22)";

        if (mode === "cad") {
          fill = "rgba(56, 189, 248, 0.05)";
          stroke = "rgba(125, 211, 252, 0.72)";
        } else if (mode === "steel") {
          const lum = Math.round(52 + lightDot * (isOuter ? 165 : 130));
          fill = `rgb(${lum}, ${lum + 3}, ${lum + 8})`;
          stroke = `rgba(255, 255, 255, ${0.28 + lightDot * 0.35})`;
        } else {
          // Modo acabado espejo/cepillado monumental
          const lum = Math.round(44 + Math.pow(lightDot, 1.35) * (isOuter ? 188 : 145));
          fill = `rgb(${lum}, ${lum + 4}, ${lum + 10})`;
          stroke = `rgba(240, 246, 255, ${0.22 + lightDot * 0.42})`;
        }

        drawables.push({
          z: avgZ,
          type: "quad",
          pts: [pA, pB, pC, pD],
          fill,
          stroke,
          lineWidth: mode === "cad" ? 1 : 0.75
        });

        // Pasamanos superior tubular en acero inoxidable
        const railHeight = 0.84;
        const r0 = this.project(
          { x: Math.cos(t0) * radius, y: y0 + railHeight, z: Math.sin(t0) * radius },
          yaw,
          pitch
        );
        const r1 = this.project(
          { x: Math.cos(t1) * radius, y: y1 + railHeight, z: Math.sin(t1) * radius },
          yaw,
          pitch
        );
        drawables.push({
          z: (r0.z + r1.z) * 0.5 - 0.03,
          type: "line",
          p1: r0,
          p2: r1,
          stroke:
            mode === "cad"
              ? "rgba(186, 230, 253, 0.9)"
              : `rgba(${Math.round(165 + lightDot * 88)}, ${Math.round(172 + lightDot * 82)}, 255, 0.95)`,
          width: isOuter ? 3.2 : 2.3
        });

        // Paño de barandilla en vidrio estructural (solo modo 'finished')
        if (mode === "finished" && i % 2 === 0) {
          const gA = this.project(
            { x: Math.cos(t0) * radius, y: y0 + 0.08, z: Math.sin(t0) * radius },
            yaw,
            pitch
          );
          const gB = this.project(
            { x: Math.cos(t1) * radius, y: y1 + 0.08, z: Math.sin(t1) * radius },
            yaw,
            pitch
          );
          drawables.push({
            z: (gA.z + gB.z + r0.z + r1.z) * 0.25 + 0.01,
            type: "quad",
            pts: [r0, r1, gB, gA],
            fill: `rgba(195, 224, 245, ${0.06 + lightDot * 0.08})`,
            stroke: "rgba(220, 238, 255, 0.22)",
            lineWidth: 0.65
          });
        }
      }
    });

    // 3. Peldaños (vidrio laminado / estructura metálica en taller) + montantes puntuales
    for (let s = 0; s < steps; s++) {
      const a0 = s * stepAngle;
      const a1 = a0 + stepAngle * 0.92;
      const y = yStart + s * stepRise;

      const pIn0 = this.project({ x: Math.cos(a0) * innerRadius, y, z: Math.sin(a0) * innerRadius }, yaw, pitch);
      const pOut0 = this.project({ x: Math.cos(a0) * outerRadius, y, z: Math.sin(a0) * outerRadius }, yaw, pitch);
      const pOut1 = this.project({ x: Math.cos(a1) * outerRadius, y, z: Math.sin(a1) * outerRadius }, yaw, pitch);
      const pIn1 = this.project({ x: Math.cos(a1) * innerRadius, y, z: Math.sin(a1) * innerRadius }, yaw, pitch);

      const avgZ = (pIn0.z + pOut0.z + pOut1.z + pIn1.z) * 0.25;
      const midAngle = (a0 + a1) * 0.5 + yaw;
      const spec = Math.cos(midAngle - 0.6) * 0.5 + 0.5;

      if (mode === "cad") {
        drawables.push({
          z: avgZ,
          type: "quad",
          pts: [pIn0, pOut0, pOut1, pIn1],
          fill: "rgba(56, 189, 248, 0.08)",
          stroke: "rgba(125, 211, 252, 0.85)",
          lineWidth: 1
        });
      } else if (mode === "steel") {
        // En fase taller se muestran las ménsulas/zancas soporte y bastidor metálico del peldaño
        drawables.push({
          z: avgZ,
          type: "quad",
          pts: [pIn0, pOut0, pOut1, pIn1],
          fill: `rgba(145, 152, 165, ${0.22 + spec * 0.2})`,
          stroke: `rgba(235, 240, 248, ${0.45 + spec * 0.35})`,
          lineWidth: 1.15
        });
      } else {
        // Peldaño de vidrio laminado templado con canto luminoso
        drawables.push({
          z: avgZ,
          type: "quad",
          pts: [pIn0, pOut0, pOut1, pIn1],
          fill: `rgba(185, 224, 248, ${0.14 + spec * 0.16})`,
          stroke: `rgba(225, 244, 255, ${0.52 + spec * 0.42})`,
          lineWidth: 1.25
        });
      }

      // Montantes verticales cada 2 peldaños
      if (s % 2 === 0) {
        const postBot = this.project({ x: Math.cos(a0) * outerRadius, y, z: Math.sin(a0) * outerRadius }, yaw, pitch);
        const postTop = this.project(
          { x: Math.cos(a0) * outerRadius, y: y + 0.84, z: Math.sin(a0) * outerRadius },
          yaw,
          pitch
        );
        drawables.push({
          z: (postBot.z + postTop.z) * 0.5,
          type: "line",
          p1: postBot,
          p2: postTop,
          stroke: mode === "cad" ? "rgba(56, 189, 248, 0.55)" : "rgba(220, 226, 236, 0.65)",
          width: mode === "cad" ? 1 : 1.5
        });
      }
    }

    // Ordenación de atrás hacia delante (Painter's Algorithm)
    drawables.sort((a, b) => b.z - a.z);

    for (const item of drawables) {
      if (item.type === "quad") {
        ctx.beginPath();
        ctx.moveTo(item.pts[0].x, item.pts[0].y);
        for (let i = 1; i < item.pts.length; i++) {
          ctx.lineTo(item.pts[i].x, item.pts[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = item.fill;
        ctx.fill();
        ctx.lineWidth = item.lineWidth;
        ctx.strokeStyle = item.stroke;
        ctx.stroke();
      } else if (item.type === "line") {
        ctx.beginPath();
        if (item.dash) ctx.setLineDash(item.dash);
        else ctx.setLineDash([]);
        ctx.moveTo(item.p1.x, item.p1.y);
        ctx.lineTo(item.p2.x, item.p2.y);
        ctx.lineWidth = item.width;
        ctx.lineCap = "round";
        ctx.strokeStyle = item.stroke;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.observer) this.observer.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
