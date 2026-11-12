import * as THREE from "../vendor/three/three.module.min.js";
import { RoomEnvironment } from "../vendor/three/RoomEnvironment.js";

/**
 * Escalera helicoidal 3D en acero inoxidable cepillado y vidrio templado
 * renderizada con Three.js PBR (RoomEnvironment) y sincronizada con el scroll.
 */
export class HelicalStaircase3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      mode: options.mode || "finished",
      steps: options.steps || 20,
      sweepAngle: options.sweepAngle || Math.PI * 1.48,
      baseAngle: options.baseAngle ?? -0.85,
      scrollTurns: options.scrollTurns ?? 1.15,
      cameraXOffset: options.cameraXOffset ?? -0.55,
      cameraYOffset: options.cameraYOffset ?? 0.25,
      cameraDistance: options.cameraDistance ?? 7.8,
      scale: options.scale ?? 1.0,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ...options
    };

    this.mode = this.options.mode;
    this.scrollProgress = 0;
    this.currentAngle = this.options.baseAngle;
    this.targetAngle = this.options.baseAngle;
    this.pointerX = 0;
    this.pointerY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;
    this.isVisible = true;
    this.rafId = null;
    this.needsRender = true;
    this.disposed = false;

    this._init();
  }

  _init() {
    if (!this.canvas) return;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch {
      this.canvas.dataset.fallback = "true";
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();

    // Estudio metálico PBR monocromo con reflejos suaves de acero cepillado
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    this.envRT = pmrem.fromScene(roomEnv, 0.04);
    this.scene.environment = this.envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const width = Math.max(1, this.canvas.clientWidth || 800);
    const height = Math.max(1, this.canvas.clientHeight || 600);
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 60);
    this.camera.position.set(
      this.options.cameraXOffset,
      this.options.cameraYOffset,
      this.options.cameraDistance
    );
    this.camera.lookAt(this.options.cameraXOffset * 0.45, 0.0, 0);

    this._setupLights();
    this._buildStaircase();
    this.setMode(this.mode);
    this.resize();

    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize, { passive: true });

    if ("IntersectionObserver" in window) {
      this._observer = new IntersectionObserver(
        (entries) => {
          this.isVisible = Boolean(entries[0]?.isIntersecting);
          if (this.isVisible && this.needsRender) {
            this._scheduleTick();
          }
        },
        { threshold: 0.02 }
      );
      this._observer.observe(this.canvas);
    }

    this._scheduleTick();
  }

  _setupLights() {
    // Luz cenital de atrio oscuro + contra-luz cálida de taller para perfilar aristas
    const ambient = new THREE.AmbientLight(0xd8dde6, 0.35);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.8);
    keyLight.position.set(4.5, 7.2, 5.4);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcdd7e6, 2.2);
    rimLight.position.set(-6.0, 3.0, -4.5);
    this.scene.add(rimLight);

    const underFill = new THREE.PointLight(0xffffff, 1.1, 16);
    underFill.position.set(1.2, -3.5, 3.2);
    this.scene.add(underFill);
  }

  _createHelicalRibbonGeometry(radius, height, sweep, width, depth, segments = 96, yOffset = 0) {
    const geom = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const indices = [];

    const hw = width / 2;
    const hd = depth / 2;
    const cross = [
      [-hw, -hd],
      [hw, -hd],
      [hw, hd],
      [-hw, hd]
    ];

    // Cada cara de la viga con sus propias normales para brillos metálicos limpios
    for (let face = 0; face < 4; face++) {
      const [ax, ay] = cross[face];
      const [bx, by] = cross[(face + 1) % 4];
      const baseVertex = positions.length / 3;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const theta = t * sweep;
        const y = (t - 0.5) * height + yOffset;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const pushPt = (ox, oy) => {
          const r = radius + ox;
          positions.push(r * cos, y + oy, r * sin);
        };

        pushPt(ax, ay);
        pushPt(bx, by);

        // Normal aproximada perpendicular en sección radial/vertical
        const nx = by - ay;
        const ny = -(bx - ax);
        const nLen = Math.hypot(nx, ny) || 1;
        const rNorm = nx / nLen;
        const yNorm = ny / nLen;

        normals.push(rNorm * cos, yNorm, rNorm * sin);
        normals.push(rNorm * cos, yNorm, rNorm * sin);
      }

      for (let i = 0; i < segments; i++) {
        const a = baseVertex + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, d, a, d, c);
      }
    }

    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geom.setIndex(indices);
    return geom;
  }

  _createSectorTreadGeometry(innerR, outerR, angleWidth, thickness = 0.048) {
    const shape = new THREE.Shape();
    const half = angleWidth / 2;
    const segs = 10;

    for (let i = 0; i <= segs; i++) {
      const a = -half + (i / segs) * angleWidth;
      const x = outerR * Math.cos(a);
      const y = outerR * Math.sin(a);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    for (let i = segs; i >= 0; i--) {
      const a = -half + (i / segs) * angleWidth;
      shape.lineTo(innerR * Math.cos(a), innerR * Math.sin(a));
    }
    shape.closePath();

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006
    });
    extrude.rotateX(-Math.PI / 2);
    extrude.translate(0, -thickness / 2, 0);
    return extrude;
  }

  _createHelixCurve(radius, height, sweep, yOffset = 0, pointsCount = 96) {
    const pts = [];
    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const theta = t * sweep;
      const y = (t - 0.5) * height + yOffset;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)));
    }
    return new THREE.CatmullRomCurve3(pts);
  }

  _buildStaircase() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.scale.setScalar(this.options.scale);
    this.scene.add(this.rootGroup);

    this.finishedGroup = new THREE.Group();
    this.steelGroup = new THREE.Group();
    this.wireframeGroup = new THREE.Group();

    this.rootGroup.add(this.steelGroup);
    this.rootGroup.add(this.finishedGroup);
    this.rootGroup.add(this.wireframeGroup);

    const R_IN = 1.05;
    const R_OUT = 2.48;
    const HEIGHT = 5.4;
    const SWEEP = this.options.sweepAngle;
    const STEPS = this.options.steps;

    // Materiales reales Ferrari / Taller de autor
    const brushedSteelMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d8df,
      metalness: 0.94,
      roughness: 0.24,
      clearcoat: 0.15,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.55
    });

    const darkSteelShadowMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b3f47,
      metalness: 0.88,
      roughness: 0.34,
      envMapIntensity: 1.25
    });

    const polishedRailMat = new THREE.MeshPhysicalMaterial({
      color: 0xeff2f6,
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 0.4,
      envMapIntensity: 1.7
    });

    const glassTreadMat = new THREE.MeshPhysicalMaterial({
      color: 0xd9e6ea,
      metalness: 0.08,
      roughness: 0.07,
      transparent: true,
      opacity: 0.42,
      reflectivity: 0.9,
      envMapIntensity: 1.65,
      side: THREE.DoubleSide
    });

    const glassBalustradeMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfdbe0,
      metalness: 0.05,
      roughness: 0.06,
      transparent: true,
      opacity: 0.22,
      envMapIntensity: 1.4,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const wireLineMat = new THREE.LineBasicMaterial({
      color: 0xd8dce4,
      transparent: true,
      opacity: 0.68
    });

    const wireSubMat = new THREE.LineBasicMaterial({
      color: 0x6f7582,
      transparent: true,
      opacity: 0.42
    });

    // 1. Zancas metálicas helicoidales (interior y exterior)
    const outerStringerGeom = this._createHelicalRibbonGeometry(R_OUT, HEIGHT, SWEEP, 0.09, 0.42, 110, 0);
    const innerStringerGeom = this._createHelicalRibbonGeometry(R_IN, HEIGHT, SWEEP, 0.08, 0.38, 110, 0);

    const outerStringer = new THREE.Mesh(outerStringerGeom, brushedSteelMat);
    const innerStringer = new THREE.Mesh(innerStringerGeom, darkSteelShadowMat);
    this.steelGroup.add(outerStringer, innerStringer);

    // 2. Pasamanos tubulares continuos en acero inoxidable pulido
    const outerRailCurve = this._createHelixCurve(R_OUT, HEIGHT, SWEEP, 1.06, 96);
    const innerRailCurve = this._createHelixCurve(R_IN, HEIGHT, SWEEP, 1.04, 96);
    const outerRail = new THREE.Mesh(new THREE.TubeGeometry(outerRailCurve, 96, 0.036, 14, false), polishedRailMat);
    const innerRail = new THREE.Mesh(new THREE.TubeGeometry(innerRailCurve, 96, 0.032, 12, false), brushedSteelMat);
    this.steelGroup.add(outerRail, innerRail);

    // 3. Montantes verticales de arranque y remate + cartelas metálicas bajo peldaños
    const stepAngle = SWEEP / STEPS;
    const treadGeom = this._createSectorTreadGeometry(R_IN + 0.05, R_OUT - 0.05, stepAngle * 0.94, 0.048);
    const cleatGeom = new THREE.BoxGeometry(R_OUT - R_IN - 0.04, 0.042, 0.065);
    const pinGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.04, 8);

    for (let i = 0; i < STEPS; i++) {
      const t = (i + 0.5) / STEPS;
      const theta = t * SWEEP;
      const y = (t - 0.5) * HEIGHT;

      // Soporte metálico soldado en acero (visible en fase taller y acabada)
      const cleat = new THREE.Mesh(cleatGeom, brushedSteelMat);
      const midR = (R_IN + R_OUT) / 2;
      cleat.position.set(midR * Math.cos(theta), y - 0.038, midR * Math.sin(theta));
      cleat.rotation.y = -theta;
      this.steelGroup.add(cleat);

      // Botones / fijaciones puntuales de vidrio en zancas
      if (i % 2 === 0 || i === STEPS - 1) {
        const postOut = new THREE.Mesh(pinGeom, brushedSteelMat);
        postOut.position.set(R_OUT * Math.cos(theta), y + 0.54, R_OUT * Math.sin(theta));
        this.steelGroup.add(postOut);
      }

      // Peldaño de vidrio templado laminado
      const tread = new THREE.Mesh(treadGeom, glassTreadMat);
      tread.position.set(0, y, 0);
      tread.rotation.y = -theta;
      this.finishedGroup.add(tread);

      // Perfil de wireframe técnico monocromo (Fase 01)
      const wireEdges = new THREE.EdgesGeometry(treadGeom, 25);
      const wireTread = new THREE.LineSegments(wireEdges, wireLineMat);
      wireTread.position.set(0, y, 0);
      wireTread.rotation.y = -theta;
      this.wireframeGroup.add(wireTread);
    }

    // 4. Barandilla continua de vidrio laminado curvo
    const outerGlassGeom = this._createHelicalRibbonGeometry(R_OUT, HEIGHT, SWEEP, 0.022, 0.86, 96, 0.61);
    const innerGlassGeom = this._createHelicalRibbonGeometry(R_IN, HEIGHT, SWEEP, 0.02, 0.84, 96, 0.59);
    const outerGlass = new THREE.Mesh(outerGlassGeom, glassBalustradeMat);
    const innerGlass = new THREE.Mesh(innerGlassGeom, glassBalustradeMat);
    this.finishedGroup.add(outerGlass, innerGlass);

    // 5. Elementos de estudio técnico / plano CAD (Fase 01 monocromo arquitectónico)
    const wireOuter = new THREE.LineSegments(new THREE.EdgesGeometry(outerStringerGeom, 22), wireLineMat);
    const wireInner = new THREE.LineSegments(new THREE.EdgesGeometry(innerStringerGeom, 22), wireSubMat);
    const wireRailOut = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(outerRailCurve.getPoints(96)),
      wireLineMat
    );
    const wireRailIn = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(innerRailCurve.getPoints(96)),
      wireSubMat
    );

    // Anillos concéntricos de replanteo en planta (sin color neón)
    const ringPts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(R_OUT * Math.cos(a), -HEIGHT / 2 - 0.15, R_OUT * Math.sin(a)));
    }
    const baseRing = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), wireSubMat);

    // Eje vertical central de replanteo
    const axisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -HEIGHT / 2 - 0.35, 0),
      new THREE.Vector3(0, HEIGHT / 2 + 1.15, 0)
    ]);
    const axisLine = new THREE.Line(axisGeom, wireSubMat);

    this.wireframeGroup.add(wireOuter, wireInner, wireRailOut, wireRailIn, baseRing, axisLine);
  }

  setMode(mode) {
    this.mode = mode;
    if (!this.steelGroup || !this.finishedGroup || !this.wireframeGroup) return;

    if (mode === "cad") {
      this.wireframeGroup.visible = true;
      this.steelGroup.visible = false;
      this.finishedGroup.visible = false;
    } else if (mode === "steel") {
      this.wireframeGroup.visible = false;
      this.steelGroup.visible = true;
      this.finishedGroup.visible = false;
    } else {
      this.wireframeGroup.visible = false;
      this.steelGroup.visible = true;
      this.finishedGroup.visible = true;
    }
    this.needsRender = true;
    this._scheduleTick();
  }

  setScrollProgress(progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    this.scrollProgress = clamped;

    if (this.options.reducedMotion) {
      this.targetAngle = this.options.baseAngle;
      this.needsRender = true;
      this._scheduleTick();
      return;
    }

    this.targetAngle = this.options.baseAngle + clamped * Math.PI * 2 * this.options.scrollTurns;
    this.needsRender = true;
    this._scheduleTick();
  }

  setPointerTilt(nx, ny) {
    if (this.options.reducedMotion) return;
    this.pointerX = Math.max(-1, Math.min(1, nx));
    this.pointerY = Math.max(-1, Math.min(1, ny));
    this.needsRender = true;
    this._scheduleTick();
  }

  resize() {
    if (!this.renderer || !this.canvas || !this.camera) return;
    const width = Math.max(1, this.canvas.clientWidth || this.canvas.parentElement?.clientWidth || 800);
    const height = Math.max(1, this.canvas.clientHeight || this.canvas.parentElement?.clientHeight || 600);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
    this._scheduleTick();
  }

  _scheduleTick() {
    if (this.disposed || this.rafId !== null) return;
    this.rafId = window.requestAnimationFrame(() => this._tick());
  }

  _tick() {
    this.rafId = null;
    if (this.disposed || !this.renderer || !this.scene || !this.camera || !this.rootGroup) return;

    const dAngle = this.targetAngle - this.currentAngle;
    const dTiltX = this.pointerX * 0.08 - this.currentTiltX;
    const dTiltY = this.pointerY * 0.05 - this.currentTiltY;

    this.currentAngle += dAngle * 0.14;
    this.currentTiltX += dTiltX * 0.12;
    this.currentTiltY += dTiltY * 0.12;

    this.rootGroup.rotation.y = this.currentAngle + this.currentTiltX;
    this.rootGroup.rotation.x = 0.08 + this.currentTiltY;

    if (this.isVisible) {
      this.renderer.render(this.scene, this.camera);
    }

    const stillMoving =
      Math.abs(dAngle) > 0.0008 ||
      Math.abs(dTiltX) > 0.0005 ||
      Math.abs(dTiltY) > 0.0005;

    if (stillMoving && this.isVisible && !this.options.reducedMotion) {
      this._scheduleTick();
    } else {
      this.currentAngle = this.targetAngle;
      this.needsRender = false;
      if (this.isVisible) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  dispose() {
    this.disposed = true;
    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this._onResize);
    if (this._observer) this._observer.disconnect();
    if (this.envRT) this.envRT.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
