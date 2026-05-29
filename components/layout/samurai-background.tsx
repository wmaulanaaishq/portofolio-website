"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

function isWebGLAvailable(): boolean {
  try {
    const testCanvas = document.createElement("canvas")
    const gl =
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl")
    if (gl) {
      // Force lose context to free it immediately
      const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")
      if (ext) ext.loseContext()
      return true
    }
    return false
  } catch {
    return false
  }
}

export function SamuraiBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Small delay to let other canvas contexts settle
    const initTimeout = setTimeout(() => {
      initScene()
    }, 500)

    let destroyed = false
    let cleanupFn: (() => void) | null = null

    async function initScene() {
      if (destroyed) return

      // Check WebGL availability
      if (!isWebGLAvailable()) {
        console.warn("WebGL not available, skipping samurai background")
        setWebglFailed(true)
        return
      }

      try {
        if (destroyed) return

        // ── Renderer with error handling ──
        let renderer: THREE.WebGLRenderer
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: false, // Reduce GPU load
            alpha: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
          })
        } catch (err) {
          console.warn("Failed to create WebGL renderer:", err)
          setWebglFailed(true)
          return
        }

        // Check if context was actually created
        if (!renderer.getContext()) {
          console.warn("WebGL context is null after renderer creation")
          renderer.dispose()
          setWebglFailed(true)
          return
        }

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        renderer.setClearColor(0x000000, 0)

        // Handle context loss
        const canvas = renderer.domElement
        canvas.addEventListener("webglcontextlost", (e: Event) => {
          e.preventDefault()
          console.warn("WebGL context lost")
        })
        canvas.addEventListener("webglcontextrestored", () => {
          console.log("WebGL context restored")
        })

        container?.appendChild(canvas)
        Object.assign(canvas.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
        })

        // ── Scene ──
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x010510, 0.18)

        // ── Camera ──
        const camera = new THREE.PerspectiveCamera(
          55,
          window.innerWidth / window.innerHeight,
          0.1,
          200
        )
        camera.position.set(0, 1.6, 6.5)
        camera.lookAt(0, 1.2, 0)

        // ── Mouse Parallax ──
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
        const onMouseMove = (e: MouseEvent) => {
          mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
          mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener("mousemove", onMouseMove)

        // ══════════════════════════════════════
        //  LIGHTS
        // ══════════════════════════════════════
        const ambient = new THREE.AmbientLight(0x0a0820, 0.6)
        scene.add(ambient)

        const rimRight = new THREE.PointLight(0x00ffe5, 6, 12)
        rimRight.position.set(3.5, 3, -3)
        scene.add(rimRight)

        const rimLeft = new THREE.PointLight(0x7b2dff, 5, 12)
        rimLeft.position.set(-3.5, 2.5, -2.5)
        scene.add(rimLeft)

        const groundBounce = new THREE.PointLight(0xff00aa, 2.5, 8)
        groundBounce.position.set(0, -0.8, 1.5)
        scene.add(groundBounce)

        const keyLight = new THREE.DirectionalLight(0x8ab4ff, 1.8)
        keyLight.position.set(-2, 5, 4)
        keyLight.castShadow = true
        keyLight.shadow.mapSize.setScalar(1024) // Reduced from 2048
        keyLight.shadow.camera.near = 0.5
        keyLight.shadow.camera.far = 25
        keyLight.shadow.camera.left = -6
        keyLight.shadow.camera.right = 6
        keyLight.shadow.camera.top = 8
        keyLight.shadow.camera.bottom = -2
        keyLight.shadow.bias = -0.001
        scene.add(keyLight)

        const orb = new THREE.PointLight(0x00d4ff, 0, 6)
        orb.position.set(0.4, 1.8, 0.3)
        scene.add(orb)

        // ══════════════════════════════════════
        //  MATERIALS
        // ══════════════════════════════════════
        const armorMat = new THREE.MeshStandardMaterial({
          color: 0x0d0d18,
          metalness: 0.95,
          roughness: 0.15,
          envMapIntensity: 2.0,
        })

        const glowArmorMat = new THREE.MeshStandardMaterial({
          color: 0x050510,
          metalness: 0.9,
          roughness: 0.2,
          emissive: new THREE.Color(0x00ffe5),
          emissiveIntensity: 0.12,
        })

        const cloakMat = new THREE.MeshStandardMaterial({
          color: 0x08051a,
          metalness: 0.1,
          roughness: 0.92,
          side: THREE.DoubleSide,
        })

        const sashMat = new THREE.MeshStandardMaterial({
          color: 0x1a0035,
          metalness: 0.3,
          roughness: 0.6,
          emissive: new THREE.Color(0x4400aa),
          emissiveIntensity: 0.2,
        })

        const faceMat = new THREE.MeshStandardMaterial({
          color: 0x111118,
          metalness: 0.8,
          roughness: 0.25,
          emissive: new THREE.Color(0x001133),
          emissiveIntensity: 0.3,
        })

        const eyeGlowMat = new THREE.MeshStandardMaterial({
          color: 0x00ffe5,
          emissive: new THREE.Color(0x00ffe5),
          emissiveIntensity: 3.0,
          metalness: 0.0,
          roughness: 0.0,
        })

        const goldTrimMat = new THREE.MeshStandardMaterial({
          color: 0xffd060,
          metalness: 1.0,
          roughness: 0.08,
          emissive: new THREE.Color(0x553300),
          emissiveIntensity: 0.3,
        })

        // ══════════════════════════════════════
        //  SAMURAI CONSTRUCTION
        // ══════════════════════════════════════
        const samuraiRoot = new THREE.Group()
        samuraiRoot.position.set(0.55, 0, 0)
        scene.add(samuraiRoot)

        function addPart(
          geometry: THREE.BufferGeometry,
          material: THREE.Material,
          parent: THREE.Object3D,
          pos?: [number, number, number],
          rot?: [number, number, number],
          scale?: [number, number, number]
        ) {
          const m = new THREE.Mesh(geometry, material)
          m.position.set(...(pos || [0, 0, 0]))
          if (rot) m.rotation.set(...rot)
          if (scale) m.scale.set(...scale)
          m.castShadow = true
          m.receiveShadow = true
          parent.add(m)
          return m
        }

        // ── LEGS ──
        const legGroup = new THREE.Group()
        samuraiRoot.add(legGroup)

        addPart(new THREE.CylinderGeometry(0.13, 0.11, 1.0, 8), armorMat, legGroup, [-0.2, 0.5, 0])
        addPart(new THREE.CylinderGeometry(0.11, 0.09, 0.9, 8), armorMat, legGroup, [-0.2, -0.05, 0])
        addPart(new THREE.BoxGeometry(0.28, 0.08, 0.35), armorMat, legGroup, [-0.2, 0.1, 0])
        addPart(new THREE.CylinderGeometry(0.13, 0.11, 1.0, 8), armorMat, legGroup, [0.2, 0.5, 0])
        addPart(new THREE.CylinderGeometry(0.11, 0.09, 0.9, 8), armorMat, legGroup, [0.2, -0.05, 0])
        addPart(new THREE.BoxGeometry(0.28, 0.08, 0.35), armorMat, legGroup, [0.2, 0.1, 0])
        addPart(new THREE.BoxGeometry(0.22, 0.06, 0.38), armorMat, legGroup, [-0.2, -0.5, 0.04])
        addPart(new THREE.BoxGeometry(0.22, 0.06, 0.38), armorMat, legGroup, [0.2, -0.5, 0.04])

        // ── TORSO ──
        const torsoGroup = new THREE.Group()
        torsoGroup.position.set(0, 1.05, 0)
        samuraiRoot.add(torsoGroup)

        addPart(new THREE.CylinderGeometry(0.28, 0.24, 1.0, 10), armorMat, torsoGroup, [0, 0, 0])
        for (let i = -1; i <= 1; i++) {
          addPart(
            new THREE.BoxGeometry(0.18, 0.32, 0.1),
            glowArmorMat,
            torsoGroup,
            [i * 0.19, 0.1, 0.26],
            [0, 0, 0]
          )
        }
        addPart(new THREE.BoxGeometry(0.72, 0.12, 0.38), armorMat, torsoGroup, [0, 0.42, 0])

        // ── SHOULDERS ──
        const lShoulder = new THREE.Group()
        lShoulder.position.set(-0.52, 0.52, 0)
        torsoGroup.add(lShoulder)
        addPart(new THREE.BoxGeometry(0.38, 0.44, 0.3), glowArmorMat, lShoulder, [0, 0, 0], [0, 0, 0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, lShoulder, [0, 0.25, 0], [0, 0, 0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, lShoulder, [0, 0.1, 0], [0, 0, 0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, lShoulder, [0, -0.05, 0], [0, 0, 0.12])

        const rShoulder = new THREE.Group()
        rShoulder.position.set(0.52, 0.52, 0)
        torsoGroup.add(rShoulder)
        addPart(new THREE.BoxGeometry(0.38, 0.44, 0.3), glowArmorMat, rShoulder, [0, 0, 0], [0, 0, -0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, rShoulder, [0, 0.25, 0], [0, 0, -0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, rShoulder, [0, 0.1, 0], [0, 0, -0.12])
        addPart(new THREE.BoxGeometry(0.42, 0.06, 0.34), armorMat, rShoulder, [0, -0.05, 0], [0, 0, -0.12])

        // ── ARMS ──
        addPart(new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8), armorMat, torsoGroup, [-0.42, 0, 0], [0, 0, 0.35])
        addPart(new THREE.CylinderGeometry(0.09, 0.08, 0.55, 8), armorMat, torsoGroup, [-0.72, -0.28, 0], [0, 0, 0.2])
        addPart(new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8), armorMat, torsoGroup, [0.42, 0, 0], [0, 0, -0.35])
        addPart(new THREE.CylinderGeometry(0.09, 0.08, 0.55, 8), armorMat, torsoGroup, [0.72, -0.28, 0], [0, 0, -0.2])

        // Gauntlets
        addPart(new THREE.CylinderGeometry(0.11, 0.09, 0.22, 8), glowArmorMat, torsoGroup, [-0.96, -0.5, 0], [0, 0, 0.2])
        addPart(new THREE.CylinderGeometry(0.11, 0.09, 0.22, 8), glowArmorMat, torsoGroup, [0.96, -0.5, 0], [0, 0, -0.2])

        // ── SASH / OBI ──
        addPart(new THREE.CylinderGeometry(0.295, 0.285, 0.24, 12), sashMat, torsoGroup, [0, -0.38, 0])
        addPart(new THREE.BoxGeometry(0.22, 0.22, 0.12), sashMat, torsoGroup, [0, -0.38, 0.3])

        // ── NECK ──
        addPart(new THREE.CylinderGeometry(0.1, 0.12, 0.22, 8), faceMat, torsoGroup, [0, 0.62, 0])

        // ── HEAD ──
        const headGroup = new THREE.Group()
        headGroup.position.set(0, 1.72, 0)
        samuraiRoot.add(headGroup)

        addPart(new THREE.SphereGeometry(0.22, 12, 10), faceMat, headGroup, [0, 0, 0])

        const menpoGroup = new THREE.Group()
        headGroup.add(menpoGroup)
        menpoGroup.position.set(0, -0.04, 0.12)
        addPart(new THREE.BoxGeometry(0.36, 0.26, 0.14), faceMat, menpoGroup, [0, -0.04, 0], [0.18, 0, 0])
        addPart(new THREE.BoxGeometry(0.26, 0.025, 0.04), glowArmorMat, menpoGroup, [0, -0.1, 0.08])
        addPart(new THREE.BoxGeometry(0.26, 0.025, 0.04), glowArmorMat, menpoGroup, [0, -0.13, 0.08])

        // Eye slits
        addPart(new THREE.BoxGeometry(0.07, 0.025, 0.06), eyeGlowMat, headGroup, [-0.1, 0.04, 0.2])
        addPart(new THREE.BoxGeometry(0.07, 0.025, 0.06), eyeGlowMat, headGroup, [0.1, 0.04, 0.2])

        // Kabuto
        const helmet = new THREE.Group()
        headGroup.add(helmet)
        addPart(new THREE.SphereGeometry(0.245, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), armorMat, helmet, [0, 0.04, 0])
        for (let i = 0; i < 4; i++) {
          const r = 0.27 + i * 0.04
          const y = -0.06 - i * 0.07
          addPart(new THREE.CylinderGeometry(r, r + 0.04, 0.055, 14, 1, true), armorMat, helmet, [0, y, 0])
        }
        addPart(new THREE.ConeGeometry(0.04, 0.38, 6), goldTrimMat, helmet, [0, 0.32, 0])
        addPart(new THREE.BoxGeometry(0.08, 0.06, 0.04), goldTrimMat, helmet, [0, 0.15, 0])

        // Kuwagata horns
        const hornL = new THREE.Group()
        hornL.position.set(-0.18, 0.14, 0.1)
        helmet.add(hornL)
        addPart(new THREE.CylinderGeometry(0.015, 0.025, 0.35, 6), goldTrimMat, hornL, [0, 0.17, 0], [-0.4, 0, -0.2])
        addPart(new THREE.CylinderGeometry(0.015, 0.025, 0.35, 6), goldTrimMat, hornL, [0, 0.17, 0], [-0.4, 0, 0.2])

        const hornR = new THREE.Group()
        hornR.position.set(0.18, 0.14, 0.1)
        helmet.add(hornR)
        addPart(new THREE.CylinderGeometry(0.015, 0.025, 0.35, 6), goldTrimMat, hornR, [0, 0.17, 0], [-0.4, 0, 0.2])
        addPart(new THREE.CylinderGeometry(0.015, 0.025, 0.35, 6), goldTrimMat, hornR, [0, 0.17, 0], [-0.4, 0, -0.2])

        // ── CLOAK ──
        const cloakGroup = new THREE.Group()
        cloakGroup.position.set(0, 1.0, -0.15)
        samuraiRoot.add(cloakGroup)

        for (let i = 0; i < 6; i++) {
          const xOffset = (i - 2.5) * 0.14
          const widthVariance = 0.06 + Math.abs(i - 2.5) * 0.03
          const clkSeg = new THREE.Mesh(
            new THREE.PlaneGeometry(0.13 + widthVariance, 2.2, 1, 8),
            cloakMat
          )
          clkSeg.position.set(xOffset, -0.4, -0.12 + Math.abs(i - 2.5) * 0.04)
          clkSeg.castShadow = true
          cloakGroup.add(clkSeg)
        }
        addPart(new THREE.PlaneGeometry(1.1, 0.55, 2, 3), cloakMat, cloakGroup, [0, 0.76, 0.08], [-0.3, 0, 0])

        // ── KATANA ──
        const katanaGroup = new THREE.Group()
        katanaGroup.position.set(0.25, 1.3, -0.32)
        katanaGroup.rotation.set(0, 0, Math.PI * 0.12)
        samuraiRoot.add(katanaGroup)

        const scabbardMat = new THREE.MeshStandardMaterial({
          color: 0x0a0015, metalness: 0.3, roughness: 0.7,
          emissive: new THREE.Color(0x220066), emissiveIntensity: 0.4,
        })
        addPart(new THREE.CylinderGeometry(0.025, 0.02, 1.45, 8), scabbardMat, katanaGroup, [0, 0, 0])
        addPart(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8), goldTrimMat, katanaGroup, [0, 0.7, 0])
        addPart(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 8), goldTrimMat, katanaGroup, [0, -0.7, 0])

        // ── GROUND ──
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(30, 30),
          new THREE.MeshStandardMaterial({
            color: 0x020508, metalness: 0.6, roughness: 0.5,
            emissive: new THREE.Color(0x000811), emissiveIntensity: 1.0,
          })
        )
        ground.rotation.x = -Math.PI / 2
        ground.receiveShadow = true
        scene.add(ground)

        const groundGlow = new THREE.Mesh(
          new THREE.PlaneGeometry(3.5, 3.5),
          new THREE.MeshBasicMaterial({
            color: 0x001833, transparent: true, opacity: 0.18,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
        )
        groundGlow.rotation.x = -Math.PI / 2
        groundGlow.position.y = 0.01
        scene.add(groundGlow)

        // ══════════════════════════════════════
        //  PARTICLES (reduced count)
        // ══════════════════════════════════════
        const PARTICLE_COUNT = 200
        const pPositions = new Float32Array(PARTICLE_COUNT * 3)
        const pVelocities: { x: number; y: number; z: number; life: number }[] = []
        const pColors = new Float32Array(PARTICLE_COUNT * 3)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const angle = Math.random() * Math.PI * 2
          const radius = 0.5 + Math.random() * 3.2
          pPositions[i * 3] = Math.cos(angle) * radius
          pPositions[i * 3 + 1] = Math.random() * 4.0 - 0.3
          pPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 - 1.5
          pVelocities.push({
            x: (Math.random() - 0.5) * 0.004,
            y: 0.003 + Math.random() * 0.008,
            z: (Math.random() - 0.5) * 0.002,
            life: Math.random(),
          })
          const colorType = Math.random()
          if (colorType < 0.4) { pColors[i * 3] = 0.0; pColors[i * 3 + 1] = 0.85; pColors[i * 3 + 2] = 0.95 }
          else if (colorType < 0.75) { pColors[i * 3] = 0.5; pColors[i * 3 + 1] = 0.1; pColors[i * 3 + 2] = 1.0 }
          else { pColors[i * 3] = 1.0; pColors[i * 3 + 1] = 0.75; pColors[i * 3 + 2] = 0.1 }
        }

        const particleGeo = new THREE.BufferGeometry()
        particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3))
        particleGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3))
        const particles = new THREE.Points(
          particleGeo,
          new THREE.PointsMaterial({
            size: 0.035, sizeAttenuation: true, vertexColors: true,
            transparent: true, opacity: 0.65,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
        )
        scene.add(particles)

        // ── Energy rings ──
        function createEnergyRing(ringRadius: number, color: number, yPos: number, opacity: number) {
          const pts: THREE.Vector3[] = []
          for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2
            pts.push(new THREE.Vector3(Math.cos(a) * ringRadius, yPos, Math.sin(a) * ringRadius))
          }
          return new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
          )
        }

        const ring1 = createEnergyRing(1.1, 0x00ffe5, 0.005, 0.35)
        const ring2 = createEnergyRing(1.8, 0x7700ff, 0.005, 0.22)
        const ring3 = createEnergyRing(2.6, 0x0044ff, 0.005, 0.14)
        ring1.position.x = ring2.position.x = ring3.position.x = 0.55
        scene.add(ring1, ring2, ring3)

        // ── Smoke ──
        const smokeParticleCount = 35
        const smokeGeo = new THREE.BufferGeometry()
        const smokePos = new Float32Array(smokeParticleCount * 3)
        for (let i = 0; i < smokeParticleCount; i++) {
          smokePos[i * 3] = (Math.random() - 0.5) * 4.5
          smokePos[i * 3 + 1] = Math.random() * 3.5
          smokePos[i * 3 + 2] = (Math.random() - 0.5) * 2.5 - 1.0
        }
        smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3))
        scene.add(new THREE.Points(smokeGeo, new THREE.PointsMaterial({
          size: 1.4, color: 0x0a0a25, transparent: true, opacity: 0.12,
          sizeAttenuation: true, depthWrite: false,
        })))

        // ── God rays ──
        const godRayMat = new THREE.MeshBasicMaterial({
          color: 0x002244, transparent: true, opacity: 0.04,
          blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
        })
        for (let i = 0; i < 5; i++) {
          const shaft = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 6), godRayMat)
          shaft.position.set(-1.5 + i * 0.7, 2.5, -3.5)
          shaft.rotation.z = (i / 5) * Math.PI * 0.4 - Math.PI * 0.1
          scene.add(shaft)
        }

        // ══════════════════════════════════════
        //  CLOAK ANIMATION DATA
        // ══════════════════════════════════════
        const cloakSegments = cloakGroup.children
        const cloakBasePositions = cloakSegments.map((c) => ({
          x: c.position.x, y: c.position.y, z: c.position.z,
        }))

        // ══════════════════════════════════════
        //  CAMERA RIG
        // ══════════════════════════════════════
        const cameraRig = new THREE.Group()
        scene.add(cameraRig)
        scene.remove(camera)
        cameraRig.add(camera)
        camera.position.set(0, 1.6, 6.5)
        camera.lookAt(0, 1.2, 0)

        // ══════════════════════════════════════
        //  ANIMATE
        // ══════════════════════════════════════
        let startTime = performance.now() / 1000
        let animFrameId: number

        function animate() {
          if (destroyed) return
          animFrameId = requestAnimationFrame(animate)

          // Skip rendering if context is lost
          if (renderer.getContext().isContextLost()) return

          const t = performance.now() / 1000 - startTime

          mouse.x += (mouse.tx - mouse.x) * 0.055
          mouse.y += (mouse.ty - mouse.y) * 0.055

          cameraRig.rotation.y = mouse.x * 0.07
          cameraRig.rotation.x = -mouse.y * 0.035

          samuraiRoot.rotation.y = mouse.x * 0.12 + Math.sin(t * 0.4) * 0.018
          samuraiRoot.position.y = Math.sin(t * 0.55) * 0.015

          headGroup.rotation.y = mouse.x * 0.08
          headGroup.rotation.x = mouse.y * 0.04

          lShoulder.rotation.z = 0.12 + Math.sin(t * 0.6 + 0.5) * 0.04
          rShoulder.rotation.z = -0.12 - Math.sin(t * 0.6) * 0.04

          // Cloak
          cloakSegments.forEach((seg, i) => {
            const bp = cloakBasePositions[i]
            const phase = i * 0.6 + t * 1.1
            seg.position.x = bp.x + Math.sin(phase * 1.3) * 0.04 + mouse.x * 0.03
            seg.position.z = bp.z + Math.cos(phase) * 0.05

            if (seg instanceof THREE.Mesh) {
              const posAttr = seg.geometry.attributes.position
              for (let v = 0; v < posAttr.count; v++) {
                const yLocal = posAttr.getY(v)
                const vPhase = phase + yLocal * 2.5
                posAttr.setX(v, Math.sin(vPhase * 1.4 + i) * 0.045 * Math.abs(yLocal + 1.1))
                posAttr.setZ(v, Math.cos(vPhase * 0.9) * 0.03 * Math.abs(yLocal + 1.1))
              }
              posAttr.needsUpdate = true
              seg.geometry.computeVertexNormals()
            }
          })

          // Particles
          const posArr = particleGeo.attributes.position.array as Float32Array
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const v = pVelocities[i]
            posArr[i * 3] += v.x + Math.sin(t * 0.3 + i) * 0.0008
            posArr[i * 3 + 1] += v.y
            posArr[i * 3 + 2] += v.z
            if (posArr[i * 3 + 1] > 4.5) {
              const pAngle = Math.random() * Math.PI * 2
              const pRadius = 0.5 + Math.random() * 3.0
              posArr[i * 3] = Math.cos(pAngle) * pRadius
              posArr[i * 3 + 1] = -0.3
              posArr[i * 3 + 2] = Math.sin(pAngle) * pRadius * 0.6 - 1.5
            }
          }
          particleGeo.attributes.position.needsUpdate = true

          // Rings
          const ringPulse = 0.96 + Math.sin(t * 2.2) * 0.05
          ring1.scale.set(ringPulse, 1, ringPulse)
          ring2.scale.set(1.0 + Math.sin(t * 1.5 + 1) * 0.04, 1, 1.0 + Math.sin(t * 1.5 + 1) * 0.04)
          ring3.scale.set(1.0 + Math.sin(t * 0.9 + 2) * 0.03, 1, 1.0 + Math.sin(t * 0.9 + 2) * 0.03)
          ring1.material.opacity = 0.25 + Math.sin(t * 2.2) * 0.12
          ring2.material.opacity = 0.15 + Math.sin(t * 1.5) * 0.08

          // Lights
          orb.intensity = 1.8 + Math.sin(t * 3.1) * 0.9
          orb.position.x = 0.4 + Math.sin(t * 0.8) * 0.2
          orb.position.z = 0.3 + Math.cos(t * 1.1) * 0.15
          rimRight.intensity = 5.5 + Math.sin(t * 1.7) * 0.8
          rimLeft.intensity = 4.5 + Math.cos(t * 1.3) * 0.7
          groundBounce.intensity = 2.0 + Math.sin(t * 2.5) * 0.5

          eyeGlowMat.emissiveIntensity = 2.5 + Math.sin(t * 2.8) * 1.2
          glowArmorMat.emissiveIntensity = 0.08 + Math.sin(t * 1.9) * 0.06

          // Smoke
          const smokeArr = smokeGeo.attributes.position.array as Float32Array
          for (let i = 0; i < smokeParticleCount; i++) {
            smokeArr[i * 3] += Math.sin(t * 0.2 + i * 1.3) * 0.001
            smokeArr[i * 3 + 1] += 0.002
            if (smokeArr[i * 3 + 1] > 4.0) smokeArr[i * 3 + 1] = -0.2
          }
          smokeGeo.attributes.position.needsUpdate = true

          renderer.render(scene, camera)
        }

        animate()

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener("resize", onResize)

        // Store cleanup
        cleanupFn = () => {
          destroyed = true
          cancelAnimationFrame(animFrameId)
          window.removeEventListener("resize", onResize)
          window.removeEventListener("mousemove", onMouseMove)

          // Dispose all geometries and materials
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose()
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose())
              } else {
                obj.material.dispose()
              }
            }
          })

          renderer.dispose()
          renderer.forceContextLoss()
          if (container && container.contains(canvas)) {
            container.removeChild(canvas)
          }
        }
      } catch (err) {
        console.warn("Failed to initialize samurai background:", err)
        setWebglFailed(true)
      }
    }

    return () => {
      destroyed = true
      clearTimeout(initTimeout)
      if (cleanupFn) cleanupFn()
    }
  }, [])

  if (webglFailed) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "transparent" }}
      aria-hidden="true"
    />
  )
}
