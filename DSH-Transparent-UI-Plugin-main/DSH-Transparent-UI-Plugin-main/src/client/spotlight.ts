/**
 * Cursor spotlight glow + geometric tilt: the deepseek.com/harness
 * feature-card hover interactions, ported onto the floating glass panes.
 *
 * Two effects ride the same hover marker (`data-spot-on`):
 * - a blue radial glow that follows the cursor — a `data-dsh-aqua-glow`
 *   overlay inside each pane whose inline background a JS pointermove
 *   writes (`radial-gradient(180px at Xpx Ypx, rgba(120,170,255,.15),
 *   transparent 70%)`, official values). The glow sits BEHIND the glass
 *   (z-index -1) so it diffuses through the translucent surface and never
 *   covers content;
 * - a cursor-driven rigid tilt written inline per pointermove, the official
 *   card's exact recipe (sign-verified from its inline transform):
 *   `perspective(800px) rotateX(θx) rotateY(θy) scale(1.01)` with
 *   θx = −k·Δy, θy = +k·Δx — the edge under the cursor sinks, the far edge
 *   lifts (cursor right ⇒ right sinks; cursor top ⇒ top sinks), ≈1° at the
 *   pane edge, 0.1s ease-out transition;
 *
 * Port notes:
 * - the sidebar NEVER tilts (its settings overlay renders inside the column
 *   and a running transform would re-anchor it — the panel traps at the
 *   column width); it keeps the glow;
 * - the fused composer+stats spot is the wider invisible inputbar wrapper:
 *   the hover region, glow geometry and tilt pivot are computed against the
 *   VISIBLE glass (see visualRect / glassLocalRect in spot-core.ts), so the
 *   wrapper's side gutters never respond;
 * - the tilt rides a short CSS transition and reduced motion skips it;
 * - geometry is measured ONCE per hover session in untransformed local space
 *   (offset-based — immune to the pane's own rotation) and refreshed on
 *   DOM/layout changes, so the per-frame path does zero layout reads.
 *
 * Two html-attribute gates from the layer's settings: `data-dsh-aqua-spotlight`
 * (glow) and `data-dsh-aqua-press` (tilt). Hover tracking runs when EITHER is
 * on. The glow divs are maintained by spot-core's overlay keeper, independent
 * of the toggles.
 */
import {
  closestSpot, ensureGlow, glassLocalRect, GLOW_ATTR, inside, ON_ATTR, spotElements,
  startOverlayKeeper, visualRect,
} from './spot-core.ts'

/** html attribute the layer uses to switch the glow effect (its toggle). */
export const SPOTLIGHT_ATTRIBUTE = 'data-dsh-aqua-spotlight'

/** html attribute the layer uses to switch the tilt effect (its toggle). */
export const PRESS_ATTRIBUTE = 'data-dsh-aqua-press'

/** Glow radius, px — matches the official card. */
const GLOW_RADIUS = 180

/** Fallback glow color (the CSS var is normally provided by the stylesheet). */
const GLOW_FALLBACK = 'rgba(90, 215, 255, 0.17)'

/** Tilt magnitude at the pane edge, radians (≈1° — perceptible but gentle). */
const TILT_MAX = 0.0175

/** Tilt perspective distance, px (official value). */
const TILT_PERSPECTIVE = 800

/** Ease-back settle time (ms) — must outlast the CSS transform transition. */
const SETTLE_MS = 240

/** The glow is live only while its gate attribute is on <html>. */
function glowGated(): boolean {
  return document.documentElement.hasAttribute(SPOTLIGHT_ATTRIBUTE)
}

/** The tilt is live only while its gate attribute is on <html>. */
function tiltGated(): boolean {
  return document.documentElement.hasAttribute(PRESS_ATTRIBUTE)
}

/** Hover tracking runs when EITHER effect is enabled. */
function hoverGated(): boolean {
  return glowGated() || tiltGated()
}

/** Whether the tilt may run on this pane right now. */
function tiltable(spot: HTMLElement): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // The settings overlay renders INSIDE the sidebar column: tilting the
  // sidebar while the panel is open would re-anchor its fixed overlay into
  // the column — so the sidebar pauses while a dialog exists (the keeper
  // untraps it instantly the moment the panel mounts).
  if (spot.matches('[class*="sidebarCol"]') && document.querySelector('[role="dialog"]') !== null) return false
  return true
}

/** One hover session: geometry captured at entry, kept fresh by the feed. */
interface SpotSession {
  spot: HTMLElement
  /** The visible glass region in viewport space (cursor math). */
  visual: DOMRect
  /** The visible glass region in spot-local, UNtransformed space (glow
   *  geometry + tilt pivot). */
  local: { left: number; top: number; width: number; height: number }
  /** Glow overlay (null while the glow toggle is off). */
  glow: HTMLElement | null
}

/**
 * Attach the delegated pointer feeds. Everything is document-level: no
 * per-pane listeners, and the rAF merge collapses pointermove bursts to one
 * style write per frame.
 * @returns a disposer that drops listeners, overlays, and inline styles.
 */
export function startSpotlight(): () => void {
  /** The hovered pane (cleared on leave). */
  let current: HTMLElement | null = null
  /** Geometry for the hovered pane. */
  let session: SpotSession | null = null
  let raf = 0
  let refreshRaf = 0
  /** Panes currently carrying a JS-written transform (wipe only those). */
  const tilted = new WeakSet<HTMLElement>()
  /** Pending ease-back removal timers per pane (leave → neutral → cleanup). */
  const settle = new Map<HTMLElement, number>()

  /** Ease a pressed pane back to neutral, then drop the inline transform. */
  const easeBack = (spot: HTMLElement): void => {
    if (!tilted.has(spot)) return
    tilted.delete(spot)
    // Neutral transform lets the CSS transition glide the pane home; the
    // inline transform is removed after the flight (a residual transform
    // would keep the pane a containing block for fixed descendants).
    spot.style.transform =
      `perspective(${TILT_PERSPECTIVE}px) rotateX(0rad) rotateY(0rad) scale(1)`
    const id = window.setTimeout(() => {
      settle.delete(spot)
      spot.style.removeProperty('transform')
      spot.style.removeProperty('transform-origin')
    }, SETTLE_MS)
    settle.set(spot, id)
  }

  /** Drop every effect this controller wrote onto a pane. */
  const clearSpot = (spot: HTMLElement): void => {
    spot.removeAttribute(ON_ATTR)
    if (current === spot) {
      current = null
      session = null
    }
    const glow = spot.querySelector<HTMLElement>(`:scope > [${GLOW_ATTR}]`)
    if (glow !== null) glow.style.removeProperty('background-image')
    easeBack(spot)
  }

  /** Capture (or refresh) the hover geometry; sets the glow overlay box. */
  const measure = (spot: HTMLElement): SpotSession => {
    const visual = visualRect(spot)
    const local = glassLocalRect(spot)
    const glow = glowGated() ? ensureGlow(spot) : null
    if (glow !== null) {
      glow.style.left = `${local.left}px`
      glow.style.top = `${local.top}px`
      glow.style.width = `${local.width}px`
      glow.style.height = `${local.height}px`
    }
    return { spot, visual, local, glow }
  }

  /** Write the glow gradient and/or the tilt transform for the pointer position. */
  const paint = (s: SpotSession, clientX: number, clientY: number): void => {
    if (raf !== 0) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const { spot, visual, local } = s
      // Over a gutter / padding region, not the glass — nothing to paint.
      if (!inside(visual, clientX, clientY)) {
        clearSpot(spot)
        return
      }
      let glow = s.glow
      if (glow === null && glowGated()) {
        // Toggle flipped on mid-hover: late-bind the glow overlay.
        s = session = measure(spot)
        glow = s.glow
      }
      if (glow !== null) {
        if (glowGated()) {
          // background-image only: the shorthand would wipe any CSS paint.
          glow.style.backgroundImage =
            `radial-gradient(${GLOW_RADIUS}px at ${clientX - visual.left}px ${clientY - visual.top}px, var(--dsh-aqua-spot-color, ${GLOW_FALLBACK}), transparent 70%)`
        } else {
          // Toggle flipped off mid-hover: drop the last radial so the
          // now-ungated div turns invisible immediately.
          glow.style.removeProperty('background-image')
        }
      }
      if (tiltGated() && tiltable(spot)) {
        // Normalized cursor offset from the glass center, clamped to ±0.5 —
        // the official card's formula, sign-verified against its inline
        // transform: cursor right ⇒ rotateY POSITIVE, cursor TOP ⇒ rotateX
        // POSITIVE — the edge under the cursor sinks, the far edge lifts.
        const dx = Math.min(0.5, Math.max(-0.5, (clientX - visual.left) / visual.width - 0.5))
        const dy = Math.min(0.5, Math.max(-0.5, (clientY - visual.top) / visual.height - 0.5))
        // The trajectory pane is far larger than the other glass — half the
        // magnitude there so the press stays gentle.
        const tiltMax = spot.hasAttribute('data-dsh-trajectory') ? TILT_MAX * 0.5 : TILT_MAX
        // Rotate about the visible glass center (spot-local, untransformed).
        // Same recipe for every pane — the sidebar and its collapsed rail
        // included.
        spot.style.transformOrigin =
          `${local.left + local.width / 2}px ${local.top + local.height / 2}px`
        spot.style.transform =
          `perspective(${TILT_PERSPECTIVE}px) rotateX(${tiltMax * -2 * dy}rad) rotateY(${tiltMax * 2 * dx}rad) scale(1.01)`
        tilted.add(spot)
      } else if (tilted.has(spot)) {
        // Tilt toggled off mid-hover (or a guarded pane): release only
        // transforms this controller wrote.
        easeBack(spot)
      }
    })
  }

  const onMove = (event: PointerEvent): void => {
    if (!hoverGated()) return
    const spot = closestSpot(event.target)
    if (spot === null || session?.spot !== spot) return
    paint(session, event.clientX, event.clientY)
  }

  const onOver = (event: PointerEvent): void => {
    if (!hoverGated()) return
    const spot = closestSpot(event.target)
    if (spot === null) return
    // The settings overlay renders INSIDE the sidebar column: while it is
    // open, the sidebar stays out of every hover effect.
    if (spot.matches('[class*="sidebarCol"]') && document.querySelector('[role="dialog"]') !== null) return
    // Gutter/padding entries never start a session (and must not cancel a
    // pending ease-back settle), so the glass check comes first.
    const next = measure(spot)
    if (!inside(next.visual, event.clientX, event.clientY)) return
    // Re-entry during an ease-back: cancel the pending inline cleanup.
    const id = settle.get(spot)
    if (id !== undefined) {
      clearTimeout(id)
      settle.delete(spot)
    }
    spot.setAttribute(ON_ATTR, '')
    current = spot
    session = next
    paint(next, event.clientX, event.clientY)
  }

  const onOut = (event: PointerEvent): void => {
    const spot = closestSpot(event.target)
    if (spot === null || spot !== current) return
    // Moving between children keeps the effects live; leaving the visible
    // glass (including into the wrapper's gutters) clears them.
    if (session !== null && inside(session.visual, event.clientX, event.clientY)) return
    clearSpot(spot)
  }

  // The glow divs live with the panes through React re-renders; DOM/layout
  // changes also refresh the active hover session (coalesced).
  const keeper = startOverlayKeeper(() => {
    // The settings dialog mounts INSIDE the sidebar column — release the
    // sidebar with a SNAP, not a glide: removing the inline transform while
    // the CSS transition is live would keep the COMPUTED transform alive
    // for ~0.1s and trap the panel's fixed overlay in the column for those
    // frames (the "stuck in the sidebar for a moment" bug). Disabling the
    // transition around the removal makes the release instant.
    for (const spot of spotElements()) {
      if (!spot.matches('[class*="sidebarCol"]')) continue
      if (spot.querySelector('[role="dialog"]') === null) continue
      spot.removeAttribute(ON_ATTR)
      const id = settle.get(spot)
      if (id !== undefined) {
        clearTimeout(id)
        settle.delete(spot)
      }
      tilted.delete(spot)
      spot.style.setProperty('transition', 'none')
      spot.style.removeProperty('transform')
      spot.style.removeProperty('transform-origin')
      void spot.offsetWidth
      spot.style.removeProperty('transition')
      if (current === spot) {
        current = null
        session = null
      }
    }
    if (session === null || refreshRaf !== 0) return
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0
      if (session !== null) session = measure(session.spot)
    })
  })

  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  document.addEventListener('pointerout', onOut, { passive: true })

  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerover', onOver)
    document.removeEventListener('pointerout', onOut)
    keeper()
    if (raf !== 0) cancelAnimationFrame(raf)
    if (refreshRaf !== 0) cancelAnimationFrame(refreshRaf)
    for (const id of settle.values()) clearTimeout(id)
    settle.clear()
    for (const spot of spotElements()) {
      spot.removeAttribute(ON_ATTR)
      if (tilted.has(spot)) {
        tilted.delete(spot)
        spot.style.removeProperty('transform')
        spot.style.removeProperty('transform-origin')
      }
    }
  }
}
