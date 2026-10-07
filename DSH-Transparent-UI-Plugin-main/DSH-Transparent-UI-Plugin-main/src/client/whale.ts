/**
 * Particle whale: the deepseek.com/harness hero's centerpiece fish rendered
 * as particles — a faithful 2D port of the site's `HeroDigitileR3F` (chunk
 * 776) minus three.js. The 24×18 brand-fish SVG is sampled onto a 60×60
 * luminance grid, the particles scatter, then assemble into the silhouette
 * with the site's drift / tail-sway / light-shading / pointer-push math.
 * Additive canvas blending + `mix-blend-mode: screen` (as on the site).
 */

const WHALE_SVG = `<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746V14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z" fill="#FFFFFF"/>
</svg>`

/** Sampling grid side (the site uses 60). */
const GRID = 60
/** World units per grid cell (the site: (n - 30) * 0.18). */
const UNIT = 0.18
/** Fixed light position (the whale's lightParams: x/y/z with followX). */
const LIGHT_X = 4.5
const LIGHT_Y = 5.5
const LIGHT_RANGE = 14
const SHADE_MIN = 0.2
/** Site: shadeMax: 0.4 * P.shadeMax where P.shadeMax = 2.79. */
const SHADE_MAX = 0.4 * 2.79
const FOLLOW_X = 1.05
const LOOSE = 1
/** Mouse params (DIGITILE_MOUSE_DEFAULTS). */
const MOUSE_RADIUS = 4.9
const MOUSE_STRENGTH = 0.8
const MOUSE_DECAY = 0.2
const MOUSE_DISTORT = 5
/** Render cadence, matching the site's FPS prop. */
const FPS = 30
/** Camera viewport height in world units (z 18, fov 50). */
const WORLD_H = 2 * 18 * Math.tan((50 * Math.PI) / 360)

interface Particle {
  /** Rest position in world units (the whale silhouette). */
  x: number
  y: number
  /** Sampled luminance (per-particle opacity). */
  opacity: number
  /** Edge-ness: fraction of dim/out-of-bounds 3×3 neighbors. */
  edge: number
  /** Scattered (pre-assembly) position. */
  sx: number
  sy: number
  sz: number
}

/** Cheap per-particle hash noise in [-0.5, 0.5] (site's fract(sin) jitter). */
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453
  return s - Math.floor(s) - 0.5
}

/** Whale handle: scheme updates plus disposal. */
export interface WhaleHandle {
  /** Flip the particle color between the dark (white) and light (gray) sets. */
  setDark: (dark: boolean) => void
  /** Stop the engine and remove the DOM. */
  dispose: () => void
}

/**
 * Mount the particle whale into `host` (the ambient scene) and start the
 * engine. The wrapper is centered on the MAIN column — the `[data-phase]`
 * conversation area, i.e. everything right of the sidebar — not the whole
 * viewport.
 * @param host - the container the whale wrapper is appended to.
 * @param dark - resolved scheme at mount (white particles on dark, gray on light).
 * @returns the handle.
 */
export function mountWhale(host: HTMLElement, dark: boolean): WhaleHandle {
  const holder = document.createElement('div')
  holder.setAttribute('data-dsh-aqua-whale', '')
  holder.setAttribute('data-scheme', dark ? 'dark' : 'light')
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  holder.appendChild(canvas)
  host.appendChild(holder)
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    holder.remove()
    return { setDark: () => {}, dispose: () => {} }
  }

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const particles: Particle[] = []
  let raf = 0
  let disposed = false
  let startedAt = performance.now()
  let darkMode = dark
  let mouseWorld = { x: 0, y: 0 }
  let dpr = 1
  let scale = 1
  let width = 0
  let height = 0

  /** Center the wrapper on the main column (viewports minus the sidebar). */
  const positionHost = (): void => {
    const phase = document.querySelector<HTMLElement>('[data-phase]')
    const rect = phase?.getBoundingClientRect()
    const r = (rect !== undefined && rect.width > 0)
      ? rect
      : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
    const size = Math.round(Math.max(220, Math.min(660, window.innerHeight * 0.76, r.width * 0.8)))
    const left = Math.round(r.left + r.width / 2)
    const top = Math.round(r.top + r.height / 2)
    if (holder.style.width !== `${size}px`) holder.style.width = `${size}px`
    if (holder.style.height !== `${size}px`) holder.style.height = `${size}px`
    if (holder.style.left !== `${left}px`) holder.style.left = `${left}px`
    if (holder.style.top !== `${top}px`) holder.style.top = `${top}px`
  }

  /** Keep the canvas backing store in step with the holder box. */
  const resize = (): void => {
    positionHost()
    const rect = holder.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    scale = height / WORLD_H
  }

  /** Sample the fish SVG onto the 60×60 grid and build the particle set. */
  const sample = (img: HTMLImageElement): void => {
    const off = document.createElement('canvas')
    off.width = GRID
    off.height = GRID
    const octx = off.getContext('2d')
    if (octx === null) return
    octx.fillStyle = '#000'
    octx.fillRect(0, 0, GRID, GRID)
    const fit = Math.min(GRID / img.width, GRID / img.height)
    const w = img.width * fit
    const h = img.height * fit
    octx.drawImage(img, (GRID - w) / 2, (GRID - h) / 2, w, h)
    const data = octx.getImageData(0, 0, GRID, GRID).data
    const lum = new Float32Array(GRID * GRID)
    for (let i = 0; i < GRID * GRID; i++) {
      lum[i] = (0.299 * data[4 * i] + 0.587 * data[4 * i + 1] + 0.114 * data[4 * i + 2]) / 255
    }
    // Keep a pixel only when it is bright AND has at least one bright
    // 5×5-neighbor (the site's isolation filter: no lone bright specks).
    const hasBrightNeighbor = (x: number, y: number): boolean => {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue
          if (lum[ny * GRID + nx] > 0.2) return true
        }
      }
      return false
    }
    for (let e = 0; e < GRID; e++) {
      for (let n = 0; n < GRID; n++) {
        const a = lum[e * GRID + n]
        if (a <= 0.2 || !hasBrightNeighbor(n, e)) continue
        const x = (n - GRID / 2) * UNIT
        const y = (GRID / 2 - e) * UNIT
        let edge = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = n + dx
            const ny = e + dy
            if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID || lum[ny * GRID + nx] <= 0.2) edge++
          }
        }
        const phi = Math.random() * Math.PI * 2
        const theta = Math.acos(2 * Math.random() - 1)
        const rad = 3 * (0.4 + 0.6 * Math.random())
        particles.push({
          x,
          y,
          opacity: a,
          edge: edge / 8,
          sx: Math.sin(theta) * Math.cos(phi) * rad,
          sy: Math.sin(theta) * Math.sin(phi) * rad,
          sz: Math.cos(theta) * rad * 0.5,
        })
      }
    }
  }

  /** Draw one frame at the given assembly progress (0..1). */
  const draw = (assembly: number, time: number): void => {
    if (width === 0 || height === 0) resize()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'
    const targetX = mouseWorld.x
    const targetY = mouseWorld.y
    const lightX = LIGHT_X + targetX * FOLLOW_X
    const lightY = LIGHT_Y
    // The site eases the light anchor; replicate the decay-lerp per frame.
    const mouseRadius = MOUSE_RADIUS
    const strength = MOUSE_STRENGTH
    const size = Math.max(1.1, 0.06 * scale * dpr)
    const breathe = 0.15 * Math.sin(0.4 * time)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const loose = LOOSE * (0.25 + 0.75 * p.edge) * assembly
      // Idle jitter + slow drift (the site's uLoose block, 2D projection).
      let px = p.x + hash(i) * 0.05 * loose
      let py = p.y + hash(i * 1.37 + 7) * 0.05 * loose
      px += Math.sin(time * 0.5 + i * 0.53) * 0.06 * loose
      py += Math.cos(time * 0.42 + i * 0.71) * 0.06 * loose
      // Tail swim: a wave traveling toward +x, tail sways most.
      const tail = smoothstep(0.5, 4.5, p.x) * LOOSE * assembly
      py += Math.sin(time * 1.1 - p.x * 0.7) * 0.1 * tail
      px += Math.cos(time * 0.9 - p.x * 0.55) * 0.06 * tail
      // Assemble from the scattered position.
      px = p.sx + (px - p.sx) * assembly
      py = p.sy + (py - p.sy) * assembly
      // Pointer push: cubic falloff inside the radius, rotated by per-particle noise.
      if (assembly > 0.8) {
        const mouseEffect = (assembly - 0.8) * 5
        const mx = px - targetX
        const my = py - targetY
        const dist = Math.sqrt(mx * mx + my * my)
        if (dist < mouseRadius && dist > 0.001) {
          const t = 1 - dist / mouseRadius
          const force = t * t * t * mouseEffect * strength
          const angle = Math.sin(i * 0.37 + time * 0.5) * MOUSE_DISTORT
          const ca = Math.cos(angle)
          const sa = Math.sin(angle)
          const ux = mx / dist
          const uy = my / dist
          const rx = ux * ca - uy * sa
          const ry = ux * sa + uy * ca
          px += rx * force * 2
          py += ry * force * 2
        }
      }
      // Light shading: distance falloff from the fixed light (2D projection).
      const ldx = px - lightX
      const ldy = py - lightY
      const lit = Math.min(1, Math.max(0, 1 - Math.sqrt(ldx * ldx + ldy * ldy) / LIGHT_RANGE))
      const vLight = SHADE_MIN + SHADE_MAX * lit * lit
      // Fragment: base alpha + center glow + shimmer, additive color.
      // Dark mode: the site's bluish-white; light mode: neutral gray
      // (multiply-blended by CSS over the light backdrop).
      const dist = Math.sqrt(px * px + py * py)
      const glow = smoothstep(8, 0, dist) * 0.3 * assembly
      const baseAlpha = 0.45 + 0.3 * assembly
      const shimmer = Math.sin(time * 1.5 + px * 5 + py * 3) * 0.1 + 0.9
      const alpha = p.opacity * (baseAlpha + glow) * shimmer * Math.min(vLight, 1)
      const br = darkMode ? 0.75 : 0.42
      const bg = darkMode ? 0.8 : 0.44
      const bb = darkMode ? 0.9 : 0.47
      const r = Math.min(255, Math.round((br * assembly + glow * 0.2) * vLight * 255))
      const g = Math.min(255, Math.round((bg * assembly + glow * 0.3) * vLight * 255))
      const b = Math.min(255, Math.round((bb * assembly + glow * 0.5) * vLight * 255))
      if (alpha <= 0.004) continue
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
      const sx = width / 2 + px * scale - size / 2
      const sy = height / 2 - (py + breathe) * scale - size / 2
      ctx.fillRect(sx, sy, size, size)
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  function smoothstep(a: number, b: number, t: number): number {
    const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
    return x * x * (3 - 2 * x)
  }

  let mouseNdc = { x: 0, y: 0 }
  const onMove = (event: PointerEvent): void => {
    const rect = holder.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    mouseNdc = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    }
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  const start = (): void => {
    if (disposed) return
    // 30fps throttle (the site runs FPS 30).
    let last = performance.now()
    const step = (now: number): void => {
      if (disposed) return
      if (now - last < 1000 / FPS) {
        raf = requestAnimationFrame(step)
        return
      }
      last = now - ((now - last) % (1000 / FPS))
      // The phase container mounts after the plugin, and the sidebar can
      // collapse/expand — keep the wrapper centered on the main column.
      positionHost()
      const elapsed = (now - startedAt) / 1000
      const raw = Math.min(1, Math.max(0, (elapsed - 0.3) / 2.5))
      const D = 1 - Math.pow(1 - raw, 3)
      const assembly = smoothstep(0, 1, D)
      const targetX = (mouseNdc.x * WORLD_H) / 2
      const targetY = (mouseNdc.y * WORLD_H) / 2
      mouseWorld.x += (targetX - mouseWorld.x) * MOUSE_DECAY
      mouseWorld.y += (targetY - mouseWorld.y) * MOUSE_DECAY
      draw(assembly, elapsed)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  resize()
  window.addEventListener('resize', resize)

  const img = new Image()
  img.onload = () => {
    if (disposed) return
    sample(img)
    resize()
    if (reduced) {
      mouseWorld = { x: 0, y: 0 }
      draw(1, 2)
      // The phase container may mount after the plugin — re-center once late.
      window.setTimeout(() => {
        if (disposed) return
        resize()
        draw(1, 2)
      }, 600)
    } else {
      start()
    }
  }
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(WHALE_SVG)}`

  return {
    setDark: (dark: boolean): void => {
      if (darkMode === dark) return
      darkMode = dark
      holder.setAttribute('data-scheme', dark ? 'dark' : 'light')
      if (reduced && particles.length > 0) draw(1, 2)
    },
    dispose: (): void => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      holder.remove()
    },
  }
}
