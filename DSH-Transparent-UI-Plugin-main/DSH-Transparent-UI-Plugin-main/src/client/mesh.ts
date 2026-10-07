/**
 * Interactive mesh: the deepseek.com/harness hero's dot-grid decoration —
 * a 90px grid of dots with spring physics that repel from the pointer
 * (radius 140px), the grid lines stretching with them. Faithful port of the
 * site's `h()` grid component (30fps, dpr ≤ 2, idle-pause). Rendered inside
 * the ambient scene behind the app content; pointer-events pass through.
 */

const SPACING = 90
const REPEL_RADIUS = 140
const REPEL_FORCE = 30
const SPRING = 0.05
const DAMPING = 0.85
const LINE_GAP = 10
const MIN_LINE_DIST = 20
const LINE_COLOR = 'rgba(60, 100, 160, '
const DOT_COLOR = 'rgba(60, 100, 160, '
const LINE_ALPHA = 0.1
const DOT_ALPHA = 0.2
const FPS = 30

/** Mesh handle: disposal. */
export interface MeshHandle {
  /** Stop the engine and remove the canvas. */
  dispose: () => void
}

interface Dot { restX: number; restY: number; x: number; y: number; vx: number; vy: number }

/**
 * Mount the interactive mesh into `host` (the ambient scene).
 * @param host - the container the mesh canvas is appended to.
 * @returns the handle.
 */
export function mountMesh(host: HTMLElement): MeshHandle {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('data-dsh-aqua-mesh', '')
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    canvas.remove()
    return { dispose: () => {} }
  }

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(hover: none), (pointer: coarse)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let dots: Dot[] = []
  let cols = 0
  let rows = 0
  let w = 0
  let h = 0
  let raf = 0
  let disposed = false
  let idle = false
  let visible = true
  let resizeTimer = 0
  const mouse = { x: NaN, y: NaN }

  const build = (): void => {
    cols = Math.ceil(w / SPACING) + 1
    rows = Math.ceil(h / SPACING) + 1
    const startX = (w - (cols - 1) * SPACING) / 2
    const startY = (h - (rows - 1) * SPACING) / 2
    dots = []
    for (let ry = 0; ry < rows; ry++) {
      for (let rx = 0; rx < cols; rx++) {
        const x = startX + SPACING * rx
        const y = startY + SPACING * ry
        dots.push({ restX: x, restY: y, x, y, vx: 0, vy: 0 })
      }
    }
  }

  const resize = (): void => {
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    if (cw === w && ch === h) return
    w = cw
    h = ch
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(build, 150)
  }
  resize()
  build()

  const wake = (): void => {
    if (!idle) return
    idle = false
    if (raf === 0) raf = requestAnimationFrame(frame)
  }

  const onMove = (event: PointerEvent): void => {
    if (reduced || coarse) return
    mouse.x = event.clientX
    mouse.y = event.clientY
    wake()
  }
  if (!reduced && !coarse) window.addEventListener('pointermove', onMove, { passive: true })

  let last = 0
  const frame = (now: number): void => {
    raf = 0
    if (disposed) return
    if (!visible || now - last < 1000 / FPS) {
      raf = requestAnimationFrame(frame)
      return
    }
    last = now - ((now - last) % (1000 / FPS))
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    if (cw !== w || ch !== h) resize()
    ctx.clearRect(0, 0, w, h)
    const mx = mouse.x
    const my = mouse.y
    let maxV = 0
    for (const dot of dots) {
      if (!Number.isNaN(mx) && !Number.isNaN(my)) {
        const dx = dot.x - mx
        const dy = dot.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0.1) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE
          const nx = dx / dist
          const ny = dy / dist
          dot.vx += nx * force * 0.1
          dot.vy += ny * force * 0.1
        }
      }
      const sx = dot.restX - dot.x
      const sy = dot.restY - dot.y
      dot.vx += SPRING * sx
      dot.vy += SPRING * sy
      dot.vx *= DAMPING
      dot.vy *= DAMPING
      dot.x += dot.vx
      dot.y += dot.vy
      const v = Math.abs(dot.vx) + Math.abs(dot.vy)
      if (v > maxV) maxV = v
    }
    ctx.strokeStyle = `${LINE_COLOR}${LINE_ALPHA})`
    ctx.lineWidth = 0.5
    for (let ry = 0; ry < rows; ry++) {
      for (let rx = 0; rx < cols - 1; rx++) {
        const a = dots[ry * cols + rx]
        const b = dots[ry * cols + rx + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MIN_LINE_DIST) continue
        const ux = dx / dist
        const uy = dy / dist
        ctx.beginPath()
        ctx.moveTo(a.x + LINE_GAP * ux, a.y + LINE_GAP * uy)
        ctx.lineTo(b.x - LINE_GAP * ux, b.y - LINE_GAP * uy)
        ctx.stroke()
      }
    }
    for (let ry = 0; ry < rows - 1; ry++) {
      for (let rx = 0; rx < cols; rx++) {
        const a = dots[ry * cols + rx]
        const b = dots[(ry + 1) * cols + rx]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MIN_LINE_DIST) continue
        const ux = dx / dist
        const uy = dy / dist
        ctx.beginPath()
        ctx.moveTo(a.x + LINE_GAP * ux, a.y + LINE_GAP * uy)
        ctx.lineTo(b.x - LINE_GAP * ux, b.y - LINE_GAP * uy)
        ctx.stroke()
      }
    }
    ctx.fillStyle = `${DOT_COLOR}${DOT_ALPHA})`
    for (const dot of dots) {
      let r = 1.8
      let alpha = DOT_ALPHA
      if (!Number.isNaN(mx) && !Number.isNaN(my)) {
        const dx = dot.x - mx
        const dy = dot.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const near = Math.max(0, 1 - dist / REPEL_RADIUS)
        r = 1.8 + 2 * near
        alpha = DOT_ALPHA + 0.4 * near
      }
      ctx.globalAlpha = alpha
      const size = 2 * r
      ctx.fillRect(dot.x - r, dot.y - r, size, size)
    }
    ctx.globalAlpha = 1
    if (maxV < 0.01) {
      idle = true
    } else {
      raf = requestAnimationFrame(frame)
    }
  }

  if (reduced || coarse) {
    // Static frame for touch / reduced motion.
    resize()
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = `${LINE_COLOR}${LINE_ALPHA})`
    ctx.lineWidth = 0.5
    for (let ry = 0; ry < rows; ry++) {
      for (let rx = 0; rx < cols - 1; rx++) {
        const a = dots[ry * cols + rx]
        const b = dots[ry * cols + rx + 1]
        ctx.beginPath()
        ctx.moveTo(a.x + LINE_GAP, a.y)
        ctx.lineTo(b.x - LINE_GAP, b.y)
        ctx.stroke()
      }
    }
    for (let ry = 0; ry < rows - 1; ry++) {
      for (let rx = 0; rx < cols; rx++) {
        const a = dots[ry * cols + rx]
        const b = dots[(ry + 1) * cols + rx]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y + LINE_GAP)
        ctx.lineTo(b.x, b.y - LINE_GAP)
        ctx.stroke()
      }
    }
    ctx.fillStyle = `${DOT_COLOR}${DOT_ALPHA})`
    for (const dot of dots) ctx.fillRect(dot.x - 1.8, dot.y - 1.8, 3.6, 3.6)
  } else {
    raf = requestAnimationFrame(frame)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
    }, { threshold: 0 })
    observer.observe(canvas)
    return {
      dispose: () => {
        disposed = true
        cancelAnimationFrame(raf)
        window.clearTimeout(resizeTimer)
        observer.disconnect()
        window.removeEventListener('pointermove', onMove)
        canvas.remove()
      },
    }
  }

  return {
    dispose: () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('pointermove', onMove)
      canvas.remove()
    },
  }
}
