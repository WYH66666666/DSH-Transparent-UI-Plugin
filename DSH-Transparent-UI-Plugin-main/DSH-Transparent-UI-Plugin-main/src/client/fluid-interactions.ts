/**
 * Fluid interaction feeds: buttons ripple on hover/click with a damped
 * stir (the shader settles the wake softly). Scroll wakes were removed by
 * request — feedback stays action-driven and gentle. Coordinates are
 * normalized per the single full-screen canvas so the ripple lands where
 * the action happened. Site policy (no passive mouse trail) is preserved.
 */
import type { FluidShaderHandle } from './fluid-shader.ts'

/** The one live fluid surface. */
export interface FluidTargets {
  main: FluidShaderHandle
  mainCanvas: HTMLCanvasElement
}

/** Normalized shader-space coordinates for one canvas. */
function uv(canvas: HTMLCanvasElement, clientX: number, clientY: number): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  return {
    x: rect.width <= 0 ? 0.5 : (clientX - rect.left) / rect.width,
    y: rect.height <= 0 ? 0.5 : 1 - (clientY - rect.top) / rect.height,
  }
}

/**
 * Attach the button ripple listeners.
 * @param targets - the fluid handle and its canvas.
 * @returns disposer removing every listener.
 */
export function attachFluidInteractions(targets: FluidTargets): () => void {
  const { main, mainCanvas } = targets

  // Buttons ripple on hover and click (throttled per element). Hover is a
  // small immediate stir; clicks send an expanding ring that slowly sweeps
  // the surrounding water outward over ~1.5s.
  const lastStir = new WeakMap<Element, number>()
  const ripples = new Set<number>()

  const stirButton = (button: HTMLButtonElement, strength: number): void => {
    const now = performance.now()
    const previous = lastStir.get(button) ?? 0
    if (now - previous < 160) return
    lastStir.set(button, now)
    const rect = button.getBoundingClientRect()
    const point = uv(mainCanvas, rect.left + rect.width / 2, rect.top + rect.height / 2)
    main.stir(point.x, point.y, 0, -strength)
  }

  /** Slow radial ripple: a ring of gentle outward stirs expanding from the
   *  click point. Radius eases from zero so the influence creeps outward. */
  const ripple = (cx: number, cy: number): void => {
    const rect = mainCanvas.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const ux = (cx - rect.left) / rect.width
    const uy = 1 - (cy - rect.top) / rect.height
    const start = performance.now()
    const duration = 1500
    const maxRadius = 120
    const count = 8
    const step = (): void => {
      const t = performance.now() - start
      if (t > duration) return
      const k = t / duration
      const radius = maxRadius * k * k
      const strength = 0.05 * (1 - k)
      const spin = 0.4 * k
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + spin
        const px = ux + (radius * Math.cos(angle)) / rect.width
        const py = uy + (radius * Math.sin(angle)) / rect.height
        main.stir(px, py, Math.cos(angle) * strength, -Math.sin(angle) * strength)
      }
      const id = requestAnimationFrame(step)
      ripples.add(id)
    }
    const id = requestAnimationFrame(step)
    ripples.add(id)
  }

  const onPointerOver = (event: PointerEvent): void => {
    const button = (event.target as Element | null)?.closest?.('button')
    if (button !== undefined && button !== null) stirButton(button, 0.04)
  }
  const onClick = (event: MouseEvent): void => {
    const button = (event.target as Element | null)?.closest?.('button')
    if (button === undefined || button === null) return
    const now = performance.now()
    const previous = lastStir.get(button) ?? 0
    if (now - previous < 500) return
    lastStir.set(button, now)
    const rect = button.getBoundingClientRect()
    ripple(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  document.addEventListener('pointerover', onPointerOver, { capture: true })
  document.addEventListener('click', onClick, { capture: true })

  return () => {
    for (const id of ripples) cancelAnimationFrame(id)
    ripples.clear()
    document.removeEventListener('pointerover', onPointerOver, { capture: true })
    document.removeEventListener('click', onClick, { capture: true })
  }
}
