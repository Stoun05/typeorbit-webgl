import { useEffect, useRef, useState } from 'react'

const vertex = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uEnergy;

  #define PI 3.14159265359

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
               mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }

  mat2 rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
  }

  float ring(vec2 p, float radius, float width, float wobble) {
    float angle = atan(p.y, p.x);
    float wave = sin(angle * 7.0 + uTime * 0.72 + radius * 22.0) * wobble;
    wave += sin(angle * 3.0 - uTime * 0.38) * wobble * .55;
    float d = abs(length(p) - radius - wave);
    return smoothstep(width, width * .18, d);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    vec2 mouse = (uMouse * 2.0 - 1.0);
    mouse.x *= uResolution.x / uResolution.y;

    float mouseDist = length(uv - mouse);
    float field = exp(-mouseDist * 2.25) * (0.12 + uEnergy * 0.28);
    uv += normalize(uv - mouse + .0001) * field;
    uv *= rotate(sin(uTime * .16) * .12 + mouse.x * .08);

    float glow = 0.0;
    float lines = 0.0;
    for (float i = 0.0; i < 18.0; i++) {
      float fi = i / 17.0;
      float radius = .18 + fi * .92;
      float wobble = .008 + noise(vec2(fi * 8.0, uTime * .12)) * .025;
      vec2 rp = uv;
      rp.x *= 1.0 + sin(fi * PI) * .18;
      rp.y *= .62 + fi * .20;
      float r = ring(rp, radius, .012 - fi * .004, wobble + field * .055);
      lines += r * (0.22 + fi * .78);
      glow += r / (1.0 + mouseDist * 4.0);
    }

    float core = exp(-length(uv * vec2(1.0, 1.8)) * 2.4);
    float grain = (hash(gl_FragCoord.xy + uTime) - .5) * .055;
    vec3 warm = vec3(0.98, 0.96, 0.90);
    vec3 amber = vec3(0.95, 0.43, 0.12);
    vec3 color = mix(warm, amber, clamp(field * 3.0 + core * .22, 0.0, 1.0));
    color *= lines * 1.25 + glow * .22;
    color += amber * core * .025;
    color += grain;

    float vignette = smoothstep(1.7, .28, length(uv * vec2(.72, 1.0)));
    gl_FragColor = vec4(color * vignette, 1.0);
  }
`

export default function OrbitCanvas() {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let cleanup = () => {}
    let idleId
    let timeoutId
    let cancelled = false

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle, Vec2 } = await import('ogl')
      if (cancelled || !mount.isConnected) return

      const renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 2),
      })
      const gl = renderer.gl
      gl.clearColor(0.035, 0.035, 0.035, 1)
      mount.appendChild(gl.canvas)

      const geometry = new Triangle(gl)
      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uEnergy: { value: 0 },
      }
      const program = new Program(gl, { vertex, fragment, uniforms })
      const mesh = new Mesh(gl, { geometry, program })

      const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, energy: 0 }
      let frame = 0
      let visible = true
      let lastX = 0.5
      let lastY = 0.5
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect()
        renderer.setSize(width, height)
        uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height)
      }

      const onPointer = (event) => {
        const rect = mount.getBoundingClientRect()
        pointer.tx = (event.clientX - rect.left) / rect.width
        pointer.ty = 1 - (event.clientY - rect.top) / rect.height
        const velocity = Math.hypot(pointer.tx - lastX, pointer.ty - lastY)
        pointer.energy = Math.min(1, pointer.energy + velocity * 5)
        lastX = pointer.tx
        lastY = pointer.ty
      }

      const render = (time) => {
        pointer.x += (pointer.tx - pointer.x) * 0.055
        pointer.y += (pointer.ty - pointer.y) * 0.055
        pointer.energy *= 0.945
        uniforms.uMouse.value.set(pointer.x, pointer.y)
        uniforms.uEnergy.value = pointer.energy
        uniforms.uTime.value = reduced ? 1.2 : time * 0.001
        renderer.render({ scene: mesh })
        if (visible && !reduced) frame = requestAnimationFrame(render)
      }

      const observer = new IntersectionObserver(([entry]) => {
        const nextVisible = entry.isIntersecting
        if (nextVisible && !visible && !reduced) frame = requestAnimationFrame(render)
        visible = nextVisible
        if (!visible) cancelAnimationFrame(frame)
      }, { threshold: 0.01 })

      resize()
      renderer.render({ scene: mesh })
      if (!reduced) frame = requestAnimationFrame(render)
      observer.observe(mount)
      window.addEventListener('resize', resize)
      mount.addEventListener('pointermove', onPointer, { passive: true })
      setReady(true)

      cleanup = () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        window.removeEventListener('resize', resize)
        mount.removeEventListener('pointermove', onPointer)
        gl.canvas.remove()
      }
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(start, { timeout: 900 })
    } else {
      timeoutId = window.setTimeout(start, 120)
    }

    return () => {
      cancelled = true
      if (idleId) window.cancelIdleCallback(idleId)
      if (timeoutId) window.clearTimeout(timeoutId)
      cleanup()
    }
  }, [])

  return (
    <div className={`orbit-canvas ${ready ? 'is-ready' : ''}`} ref={mountRef}>
      <div className="canvas-loader"><span /></div>
    </div>
  )
}
