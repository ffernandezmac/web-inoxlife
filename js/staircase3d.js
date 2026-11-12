import * as THREE from "../vendor/three/three.module.min.js";

/**
 * Genera un mapa de estudio de alto contraste (tiras softbox blancas sobre negro profundo)
 * para lograr reflejos anisótropos reales de acero inoxidable cepillado y pulido espejo.
 */
function createStainlessStudioEnv(renderer) {
  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Fondo oscuro de taller/atrio
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0.0, "#1d2026");
  baseGrad.addColorStop(0.42, "#0b0c0e");
  baseGrad.addColorStop(0.55, "#15171b");
  baseGrad.addColorStop(1.0, "#07080a");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Softboxes principales verticales y horizontales que dibujan reflejos de acero inox
  const drawStrip = (x, y, w, h, peakColor, edgeColor = "rgba(255,255,255,0)") => {
    const g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0.0, edgeColor);
    g.addColorStop(0.18, peakColor);
    g.addColorStop(0.82, peakColor);
    g.addColorStop(1.0, edgeColor);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  };

  drawStrip(34, 18, 68, 128, "rgba(255,255,255,0.96)");
  drawStrip(168, 12, 46, 150, "rgba(232,238,247,0.88)");
  drawStrip(292, 26, 84, 108, "rgba(255,252,245,0.95)");
  drawStrip(424, 34, 42, 130, "rgba(215,224,236,0.78)");

  // Tira cenital continua cálida-neutra y rebote sutil inferior
  const topBand = ctx.createLinearGradient(0, 0, 0, 44);
  topBand.addColorStop(0, "rgba(255,255,255,0.9)");
  topBand.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = topBand;
  ctx.fillRect(0, 0, width, 44);

  const floorBand = ctx.createLinearGradient(0, 175, 0, 230);
  floorBand.addColorStop(0, "rgba(180,190,205,0)");
  floorBand.addColorStop(0.5, "rgba(180,190,205,0.22)");
  floorBand.addColorStop(1, "rgba(180,190,205,0)");
  ctx.fillStyle = floorBand;
  ctx.fillRect(0, 175, width, 55);

  const equirect = new THREE.CanvasTexture(canvas);
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  equirect.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(equirect);
  equirect.dispose();
  pmrem.dispose();
  return envRT;
}

/**
 * Textura direccional de grano fino de acero inoxidable cepillado (roughness + bump).
 */
function createBrushedSteelMap() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgb(138,138,138)";
  ctx.fillRect(0, 0, size, size);

  // Trazos longitudinales finos de esmerilado satinado
  for (let i = 0; i < 1800; i++) {
    const y = (i * 73) % size;
    const x = (i * 139) % size;
    const len = 30 + ((i * 29) % 140);
    const v = 95 + ((i * 53) % 95);
    ctx.strokeStyle = `rgba(${v},${v},${v},0.28)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function createMaterialPalette(brushedMap) {
  return {
    brushedSteel: new THREE.MeshPhysicalMaterial({
      color: 0xe8edf3,
      metalness: 0.98,
      roughness: 0.26,
      roughnessMap: brushedMap,
      bumpMap: brushedMap,
      bumpScale: 0.0045,
      clearcoat: 0.25,
      clearcoatRoughness: 0.18,
      envMapIntensity: 2.15
    }),
    mirrorSteel: new THREE.MeshPhysicalMaterial({
      color: 0xf7f9fc,
      metalness: 1.0,
      roughness: 0.07,
      clearcoat: 0.45,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.45
    }),
    darkSteel: new THREE.MeshPhysicalMaterial({
      color: 0x7c838e,
      metalness: 0.95,
      roughness: 0.3,
      roughnessMap: brushedMap,
      bumpMap: brushedMap,
      bumpScale: 0.003,
      envMapIntensity: 1.7
    }),
    temperedGlass: new THREE.MeshPhysicalMaterial({
      color: 0xd9ecea,
      metalness: 0.12,
      roughness: 0.04,
      transparent: true,
      opacity: 0.32,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.2,
      side: THREE.DoubleSide
    }),
    glassEdgeBalustrade: new THREE.MeshPhysicalMaterial({
      color: 0xd0e2e4,
      metalness: 0.08,
      roughness: 0.05,
      transparent: true,
      opacity: 0.18,
      clearcoat: 0.9,
      envMapIntensity: 1.8,
      side: THREE.DoubleSide,
      depthWrite: false
    }),
    wirePrimary: new THREE.LineBasicMaterial({
      color: 0xe2e5eb,
      transparent: true,
      opacity: 0.72
    }),
    wireSecondary: new THREE.LineBasicMaterial({
      color: 0x737986,
      transparent: true,
      opacity: 0.44
    })
  };
}

/**
 * Base común para escenas 3D arquitectónicas sincronizadas con scroll y viewport.
 */
class BaseScrollStage3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      mode: options.mode || "finished",
      baseAngle: options.baseAngle ?? -0.85,
      scrollTurns: options.scrollTurns ?? 1.0,
      cameraXOffset: options.cameraXOffset ?? 0,
      cameraYOffset: options.cameraYOffset ?? 0.2,
      cameraDistance: options.cameraDistance ?? 8.2,
      scale: options.scale ?? 1.0,
      basePitch: options.basePitch ?? 0.08,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ...options
    };

    this.mode = this.options.mode;
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
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.envRT = createStainlessStudioEnv(this.renderer);
    this.scene.environment = this.envRT.texture;

    this.brushedMap = createBrushedSteelMap();
    this.mats = createMaterialPalette(this.brushedMap);

    const width = Math.max(1, this.canvas.clientWidth || 800);
    const height = Math.max(1, this.canvas.clientHeight || 600);
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 60);
    this.camera.position.set(
      this.options.cameraXOffset,
      this.options.cameraYOffset,
      this.options.cameraDistance
    );
    this.camera.lookAt(this.options.cameraXOffset * 0.45, 0, 0);

    this._setupLights();

    this.rootGroup = new THREE.Group();
    this.rootGroup.scale.setScalar(this.options.scale);
    this.scene.add(this.rootGroup);

    this.wireframeGroup = new THREE.Group();
    this.steelGroup = new THREE.Group();
    this.finishedGroup = new THREE.Group();
    this.rootGroup.add(this.steelGroup, this.finishedGroup, this.wireframeGroup);

    this._buildGeometry();
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
    this.scene.add(new THREE.AmbientLight(0xd9e0ea, 0.25));

    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(5.5, 8.0, 5.5);
    this.scene.add(key);

    const coolRim = new THREE.DirectionalLight(0xd8e4f2, 2.4);
    coolRim.position.set(-6.5, 3.5, -5.0);
    this.scene.add(coolRim);

    const kick = new THREE.DirectionalLight(0xffffff, 1.4);
    kick.position.set(0.5, -5.0, 4.5);
    this.scene.add(kick);
  }

  _buildGeometry() {
    // Implementado por subclases
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
    this.rootGroup.rotation.x = this.options.basePitch + this.currentTiltY;

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
    if (this.brushedMap) this.brushedMap.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}

/**
 * 1. ESCALERA HELICOIDAL 3D EN ACERO INOXIDABLE Y VIDRIO (Hero Portada)
 */
export class HelicalStaircase3D extends BaseScrollStage3D {
  _createHelicalRibbonGeometry(radius, height, sweep, width, depth, segments = 110, yOffset = 0) {
    const geom = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const hw = width / 2;
    const hd = depth / 2;
    const cross = [
      [-hw, -hd],
      [hw, -hd],
      [hw, hd],
      [-hw, hd]
    ];

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

        positions.push((radius + ax) * cos, y + ay, (radius + ax) * sin);
        positions.push((radius + bx) * cos, y + by, (radius + bx) * sin);

        const nx = by - ay;
        const ny = -(bx - ax);
        const nLen = Math.hypot(nx, ny) || 1;
        normals.push((nx / nLen) * cos, ny / nLen, (nx / nLen) * sin);
        normals.push((nx / nLen) * cos, ny / nLen, (nx / nLen) * sin);

        uvs.push(t * 6, 0, t * 6, 1);
      }

      for (let i = 0; i < segments; i++) {
        const a = baseVertex + i * 2;
        indices.push(a, a + 1, a + 3, a, a + 3, a + 2);
      }
    }

    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
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
      bevelSize: 0.005,
      bevelThickness: 0.005
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

  _buildGeometry() {
    const R_IN = 1.05;
    const R_OUT = 2.48;
    const HEIGHT = 5.4;
    const SWEEP = this.options.sweepAngle || Math.PI * 1.48;
    const STEPS = this.options.steps || 20;

    // Zancas principales de acero inoxidable cepillado + pletinas espejo de remate
    const outerStringerGeom = this._createHelicalRibbonGeometry(R_OUT, HEIGHT, SWEEP, 0.095, 0.44, 110, 0);
    const innerStringerGeom = this._createHelicalRibbonGeometry(R_IN, HEIGHT, SWEEP, 0.085, 0.4, 110, 0);
    const outerTrimGeom = this._createHelicalRibbonGeometry(R_OUT + 0.048, HEIGHT, SWEEP, 0.014, 0.08, 110, 0.21);

    this.steelGroup.add(
      new THREE.Mesh(outerStringerGeom, this.mats.brushedSteel),
      new THREE.Mesh(innerStringerGeom, this.mats.darkSteel),
      new THREE.Mesh(outerTrimGeom, this.mats.mirrorSteel)
    );

    // Pasamanos tubulares Ø50mm y varillas tensoras horizontales en espejo inox
    const outerRailCurve = this._createHelixCurve(R_OUT, HEIGHT, SWEEP, 1.08, 96);
    const innerRailCurve = this._createHelixCurve(R_IN, HEIGHT, SWEEP, 1.06, 96);
    const midBar1 = this._createHelixCurve(R_OUT + 0.01, HEIGHT, SWEEP, 0.55, 84);
    const midBar2 = this._createHelixCurve(R_OUT + 0.01, HEIGHT, SWEEP, 0.81, 84);

    this.steelGroup.add(
      new THREE.Mesh(new THREE.TubeGeometry(outerRailCurve, 96, 0.038, 16, false), this.mats.mirrorSteel),
      new THREE.Mesh(new THREE.TubeGeometry(innerRailCurve, 96, 0.034, 14, false), this.mats.brushedSteel),
      new THREE.Mesh(new THREE.TubeGeometry(midBar1, 84, 0.011, 8, false), this.mats.mirrorSteel),
      new THREE.Mesh(new THREE.TubeGeometry(midBar2, 84, 0.011, 8, false), this.mats.mirrorSteel)
    );

    // Cartelas de apoyo, montantes pulidos, botones punto-vidrio y peldaños laminados
    const stepAngle = SWEEP / STEPS;
    const treadGeom = this._createSectorTreadGeometry(R_IN + 0.05, R_OUT - 0.05, stepAngle * 0.94, 0.048);
    const cleatGeom = new THREE.BoxGeometry(R_OUT - R_IN - 0.04, 0.044, 0.072);
    const postGeom = new THREE.CylinderGeometry(0.022, 0.022, 1.06, 12);
    const pinHeadGeom = new THREE.CylinderGeometry(0.028, 0.028, 0.03, 12);
    pinHeadGeom.rotateZ(Math.PI / 2);

    for (let i = 0; i < STEPS; i++) {
      const t = (i + 0.5) / STEPS;
      const theta = t * SWEEP;
      const y = (t - 0.5) * HEIGHT;

      const cleat = new THREE.Mesh(cleatGeom, this.mats.brushedSteel);
      const midR = (R_IN + R_OUT) / 2;
      cleat.position.set(midR * Math.cos(theta), y - 0.04, midR * Math.sin(theta));
      cleat.rotation.y = -theta;
      this.steelGroup.add(cleat);

      // Fijaciones puntuales espejo exteriores a lo largo de la zanca
      const pin = new THREE.Mesh(pinHeadGeom, this.mats.mirrorSteel);
      pin.position.set((R_OUT + 0.055) * Math.cos(theta), y - 0.02, (R_OUT + 0.055) * Math.sin(theta));
      pin.rotation.y = -theta;
      this.steelGroup.add(pin);

      if (i % 2 === 0 || i === STEPS - 1) {
        const post = new THREE.Mesh(postGeom, this.mats.mirrorSteel);
        post.position.set(R_OUT * Math.cos(theta), y + 0.55, R_OUT * Math.sin(theta));
        this.steelGroup.add(post);
      }

      const tread = new THREE.Mesh(treadGeom, this.mats.temperedGlass);
      tread.position.set(0, y, 0);
      tread.rotation.y = -theta;
      this.finishedGroup.add(tread);
    }

    const outerGlassGeom = this._createHelicalRibbonGeometry(R_OUT, HEIGHT, SWEEP, 0.02, 0.84, 96, 0.62);
    const innerGlassGeom = this._createHelicalRibbonGeometry(R_IN, HEIGHT, SWEEP, 0.02, 0.82, 96, 0.6);
    this.finishedGroup.add(
      new THREE.Mesh(outerGlassGeom, this.mats.glassEdgeBalustrade),
      new THREE.Mesh(innerGlassGeom, this.mats.glassEdgeBalustrade)
    );
  }
}

/**
 * 2. MARQUESINA ARQUITECTÓNICA VOLADA EN ACERO INOXIDABLE Y VIDRIO (Scrollytelling)
 * Elemento distinto al Hero: costillas curvadas aligeradas, tirantes tensores y cubierta de vidrio.
 */
export class CanopyStructure3D extends BaseScrollStage3D {
  constructor(canvas, options = {}) {
    super(canvas, {
      baseAngle: options.baseAngle ?? -0.58,
      scrollTurns: options.scrollTurns ?? 0.68,
      cameraXOffset: options.cameraXOffset ?? 0,
      cameraYOffset: options.cameraYOffset ?? 0.45,
      cameraDistance: options.cameraDistance ?? 8.9,
      basePitch: options.basePitch ?? 0.14,
      scale: options.scale ?? 0.94,
      ...options
    });
  }

  _createCurvedCantileverRibGeometry() {
    const shape = new THREE.Shape();
    // Costilla volada desde muro trasero (x=0) hasta vuelo delantero (x=3.1)
    shape.moveTo(0, -0.52);
    shape.lineTo(0.18, -0.52);
    shape.bezierCurveTo(0.85, -0.44, 2.05, -0.18, 3.15, -0.05);
    shape.lineTo(3.15, 0.06);
    shape.bezierCurveTo(2.1, 0.14, 1.0, 0.18, 0, 0.18);
    shape.closePath();

    // Tres aligeramientos circulares mecanizados en el alma de la costilla
    const holeCenters = [
      [0.52, -0.14, 0.14],
      [1.18, -0.09, 0.1],
      [1.82, -0.04, 0.065]
    ];
    for (const [cx, cy, r] of holeCenters) {
      const hole = new THREE.Path();
      hole.absarc(cx, cy, r, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006
    });
    geom.translate(-1.35, 0, -0.03);
    return geom;
  }

  _addWireMesh(geom, primary = true) {
    const edges = new THREE.EdgesGeometry(geom, 24);
    const segs = new THREE.LineSegments(edges, primary ? this.mats.wirePrimary : this.mats.wireSecondary);
    return segs;
  }

  _buildGeometry() {
    const ribZs = [-2.25, -0.75, 0.75, 2.25];
    const ribGeom = this._createCurvedCantileverRibGeometry();

    // 1. Pórtico trasero y viga maestra de anclaje en AISI 316L
    const spineBeamGeom = new THREE.BoxGeometry(0.16, 0.24, 5.1);
    const spineBeam = new THREE.Mesh(spineBeamGeom, this.mats.brushedSteel);
    spineBeam.position.set(-1.35, -0.16, 0);
    this.steelGroup.add(spineBeam);

    const wSpine = this._addWireMesh(spineBeamGeom, true);
    wSpine.position.copy(spineBeam.position);
    this.wireframeGroup.add(wSpine);

    // Dos pilares verticales de soporte muro / pórtico
    const colGeom = new THREE.BoxGeometry(0.18, 2.55, 0.18);
    for (const zPos of [-2.25, 2.25]) {
      const col = new THREE.Mesh(colGeom, this.mats.darkSteel);
      col.position.set(-1.38, -0.12, zPos);
      this.steelGroup.add(col);

      const wCol = this._addWireMesh(colGeom, false);
      wCol.position.copy(col.position);
      this.wireframeGroup.add(wCol);
    }

    // Placa de anclaje superior para tirantes
    const anchorPlateGeom = new THREE.BoxGeometry(0.08, 0.16, 0.24);
    const rodPinGeom = new THREE.CylinderGeometry(0.028, 0.028, 0.12, 12);
    rodPinGeom.rotateX(Math.PI / 2);

    // 2. 4 Costillas curvadas aligeradas + 4 tirantes tensores en acero pulido
    for (const zPos of ribZs) {
      const rib = new THREE.Mesh(ribGeom, this.mats.brushedSteel);
      rib.position.set(0, 0, zPos);
      this.steelGroup.add(rib);

      const wRib = this._addWireMesh(ribGeom, true);
      wRib.position.copy(rib.position);
      this.wireframeGroup.add(wRib);

      // Cartela superior de anclaje en pilar/fachada
      const plate = new THREE.Mesh(anchorPlateGeom, this.mats.mirrorSteel);
      plate.position.set(-1.33, 1.04, zPos);
      this.steelGroup.add(plate);

      // Tirante tensor inclinado desde y=1.04, x=-1.30 hasta punta delantera x=1.45, y=0.04
      const startPt = new THREE.Vector3(-1.3, 1.04, zPos);
      const endPt = new THREE.Vector3(1.42, 0.06, zPos);
      const rodVec = new THREE.Vector3().subVectors(endPt, startPt);
      const rodLen = rodVec.length();
      const rodGeom = new THREE.CylinderGeometry(0.017, 0.017, rodLen, 12);
      const rodMesh = new THREE.Mesh(rodGeom, this.mats.mirrorSteel);
      rodMesh.position.copy(startPt).addScaledVector(rodVec, 0.5);
      rodMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rodVec.clone().normalize());
      this.steelGroup.add(rodMesh);

      // Tensor / horquilla mecanizada en mitad del tirante
      const turnbuckleGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.22, 12);
      const tbMesh = new THREE.Mesh(turnbuckleGeom, this.mats.mirrorSteel);
      tbMesh.position.copy(startPt).addScaledVector(rodVec, 0.84);
      tbMesh.quaternion.copy(rodMesh.quaternion);
      this.steelGroup.add(tbMesh);

      const pinFront = new THREE.Mesh(rodPinGeom, this.mats.mirrorSteel);
      pinFront.position.copy(endPt);
      this.steelGroup.add(pinFront);

      // Línea CAD del tirante
      const wRod = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([startPt, endPt]),
        this.mats.wirePrimary
      );
      this.wireframeGroup.add(wRod);
    }

    // 3. Correas tubulares transversales y botones puntuales (arañas) de soporte de vidrio
    const purlinXs = [-0.95, 0.15, 1.32];
    const purlinGeom = new THREE.CylinderGeometry(0.026, 0.026, 4.9, 14);
    purlinGeom.rotateX(Math.PI / 2);

    const standoffGeom = new THREE.CylinderGeometry(0.032, 0.022, 0.08, 12);

    for (let i = 0; i < purlinXs.length; i++) {
      const px = purlinXs[i];
      const py = 0.2 - i * 0.055;
      const purlin = new THREE.Mesh(purlinGeom, this.mats.mirrorSteel);
      purlin.position.set(px, py, 0);
      this.steelGroup.add(purlin);

      const wPurlin = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(px, py, -2.45),
          new THREE.Vector3(px, py, 2.45)
        ]),
        this.mats.wireSecondary
      );
      this.wireframeGroup.add(wPurlin);

      for (const zPos of ribZs) {
        const standoff = new THREE.Mesh(standoffGeom, this.mats.mirrorSteel);
        standoff.position.set(px, py + 0.04, zPos);
        this.steelGroup.add(standoff);
      }
    }

    // 4. Paños de vidrio laminado templado de cubierta (Fase III / Acabada)
    const panelGeom = new THREE.BoxGeometry(3.26, 0.034, 1.46);
    const panelZs = [-1.5, 0, 1.5];
    for (const pz of panelZs) {
      const glassPanel = new THREE.Mesh(panelGeom, this.mats.temperedGlass);
      glassPanel.position.set(0.24, 0.22, pz);
      glassPanel.rotation.z = -0.055;
      this.finishedGroup.add(glassPanel);

      const wPanel = this._addWireMesh(panelGeom, false);
      wPanel.position.copy(glassPanel.position);
      wPanel.rotation.copy(glassPanel.rotation);
      this.wireframeGroup.add(wPanel);
    }

    // Marco perimetral CAD de replanteo en planta
    const baseFrame = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.55, -0.58, -2.55),
        new THREE.Vector3(1.9, -0.58, -2.55),
        new THREE.Vector3(1.9, -0.58, 2.55),
        new THREE.Vector3(-1.55, -0.58, 2.55)
      ]),
      this.mats.wireSecondary
    );
    this.wireframeGroup.add(baseFrame);
  }
}
