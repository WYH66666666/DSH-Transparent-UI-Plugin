/**
 * Wordmark badge swap: in DARK mode the DSH wordmark's solid "HARNESS"
 * plate (`<rect x="129.348" .../>` + knocked-out letterforms) is replaced
 * at runtime with the official deepseek.com/harness nameplate — the glossy
 * "Harness" pill (gradient ring + soft glow + black/25 pill with white/95
 * mono text). In LIGHT mode the stock plate stays exactly as shipped. The
 * plate box inside the svg is measured and the pill is positioned over the
 * letterform slot, so it tracks the wordmark through sidebar expand /
 * collapse, width resizes, and late layout. Everything is removed on
 * dispose: off == the stock wordmark exactly.
 */

/** Pill recipe from the official site (`bg-black/25 text-white/95 …`). */
const PILL_BG = 'rgba(0, 0, 0, 0.25)'
const PILL_INK = 'rgba(255, 255, 255, 0.95)'
const MONO_STACK = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace"
/** Official gloss ring: 135° white gradient at 1px padding + soft glow. */
const RING_GRADIENT = 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(255,255,255,0.5) 100%)'

/** Plate geometry in the 182×24 wordmark coordinate space. */
const PLATE = { x: 129.348, y: 5.5, w: 52, h: 14 }
/** Letterform slot inside the plate (letters start/end 3px inset). */
const SLOT_INSET = 3

/** Badge handle: scheme updates plus disposal. */
export interface BadgeHandle {
  /** Dark mode wears the official pill; light mode keeps the stock plate. */
  setDark: (dark: boolean) => void
  /** Stop observing and restore the stock wordmark. */
  dispose: () => void
}

/**
 * Decorate every stamped wordmark button and keep it decorated as React
 * remounts nodes or the layout settles.
 * @param dark - resolved scheme at mount.
 * @returns the handle.
 */
export function startWordmarkBadge(dark: boolean): BadgeHandle {
  let raf = 0
  let lastGeo = ''
  let quietFrames = 0
  let darkMode = dark

  const apply = (): void => {
    if (raf !== 0) raf = 0
    let geo = ''
    for (const btn of document.querySelectorAll<HTMLElement>('[data-dsh-wordmark]')) {
      const svg = btn.querySelector('svg')
      if (svg === null) continue
      const plate = svg.querySelector('rect[x="129.348"]')
      const letters = svg.querySelector('g[clip-path*="badge"]')
      const outer = btn.querySelector<HTMLElement>('[data-dsh-aqua-harness-badge]')

      if (!darkMode) {
        // Light mode: the stock plate, untouched.
        plate?.removeAttribute('data-dsh-aqua-badge-hidden')
        letters?.removeAttribute('data-dsh-aqua-badge-hidden')
        outer?.remove()
        continue
      }

      // Dark mode: hide the solid plate + knocked-out HARNESS letters.
      if (plate !== null && !plate.hasAttribute('data-dsh-aqua-badge-hidden')) {
        plate.setAttribute('data-dsh-aqua-badge-hidden', '')
      }
      if (letters !== null && !letters.hasAttribute('data-dsh-aqua-badge-hidden')) {
        letters.setAttribute('data-dsh-aqua-badge-hidden', '')
      }
      // The official badge: a glossy gradient ring (1px, 135°) with a soft
      // white glow, wrapping the black/25 pill with white/95 mono text.
      let pillOuter = outer
      if (pillOuter === null) {
        pillOuter = document.createElement('span')
        pillOuter.setAttribute('data-dsh-aqua-harness-badge', '')
        const inner = document.createElement('span')
        inner.setAttribute('data-dsh-aqua-harness-badge-text', '')
        inner.textContent = 'Harness'
        pillOuter.appendChild(inner)
        btn.appendChild(pillOuter)
      }
      const inner = pillOuter.querySelector<HTMLElement>('[data-dsh-aqua-harness-badge-text]')
      const rect = svg.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      geo += `${rect.width}|${rect.height}|${rect.left - btnRect.left}|${rect.top - btnRect.top}|${btnRect.width};`
      // The pill is absolute; make the button its containing block.
      if (btn.style.position !== 'relative') btn.style.position = 'relative'
      const scaleY = rect.height / 24
      const left = rect.left - btnRect.left + (PLATE.x + SLOT_INSET) * (rect.width / 182)
      const top = rect.top - btnRect.top + PLATE.y * scaleY
      const height = PLATE.h * scaleY
      const maxWidth = (PLATE.w - SLOT_INSET * 2) * (rect.width / 182)
      pillOuter.style.cssText = [
        'position:absolute',
        `left:${left.toFixed(2)}px`,
        `top:${top.toFixed(2)}px`,
        `height:${height.toFixed(2)}px`,
        'display:inline-flex',
        'align-items:center',
        'box-sizing:border-box',
        `padding:${(1 * scaleY).toFixed(2)}px`,
        `border-radius:${Math.round(5 * scaleY * 10) / 10}px`,
        `background:${RING_GRADIENT}`,
        `box-shadow:0 0 ${Math.round(10 * scaleY * 10) / 10}px rgba(255,255,255,0.08), 0 0 ${Math.round(20 * scaleY * 10) / 10}px rgba(255,255,255,0.04)`,
        `max-width:${maxWidth.toFixed(2)}px`,
        'pointer-events:none',
      ].join(';')
      if (inner !== null) {
        inner.style.cssText = [
          'box-sizing:border-box',
          `padding:${(1 * scaleY).toFixed(2)}px ${(4 * scaleY).toFixed(2)}px`,
          `border-radius:${Math.round(4 * scaleY * 10) / 10}px`,
          `background:${PILL_BG}`,
          `color:${PILL_INK}`,
          `font-family:${MONO_STACK}`,
          `font-size:${Math.round(7.5 * scaleY * 10) / 10}px`,
          'font-weight:500',
          'line-height:1',
          'white-space:nowrap',
          'overflow:hidden',
          'text-overflow:ellipsis',
          'max-width:100%',
        ].join(';')
      }
    }
    // The wordmark lands after the plugin mounts and the sidebar can be
    // mid-transition (the grid-track slide is pure CSS — no DOM events).
    // Keep re-applying while the geometry keeps changing, and only stop
    // after a run of quiet frames — two equal samples are NOT enough: the
    // wordmark can sit at 0×0 for a few frames before the slide begins,
    // and stopping early left the pill frozen at its pre-layout spot.
    if (!darkMode) return
    if (geo !== lastGeo) {
      lastGeo = geo
      quietFrames = 0
      raf = requestAnimationFrame(apply)
    } else if (quietFrames < 40) {
      quietFrames += 1
      raf = requestAnimationFrame(apply)
    }
  }

  apply()
  const observer = new MutationObserver(() => { apply() })
  observer.observe(document.documentElement, { childList: true, subtree: true })
  window.addEventListener('resize', apply)
  // Any finished CSS transition/animation re-runs one final placement, so
  // the pill never settles at a mid-flight geometry.
  document.addEventListener('transitionend', apply, true)
  document.addEventListener('animationend', apply, true)
  return {
    setDark: (dark: boolean): void => {
      if (darkMode === dark) return
      darkMode = dark
      apply()
    },
    dispose: (): void => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
      document.removeEventListener('transitionend', apply, true)
      document.removeEventListener('animationend', apply, true)
      if (raf !== 0) cancelAnimationFrame(raf)
      for (const pill of document.querySelectorAll('[data-dsh-aqua-harness-badge]')) pill.remove()
      for (const el of document.querySelectorAll('[data-dsh-aqua-badge-hidden]')) el.removeAttribute('data-dsh-aqua-badge-hidden')
      for (const btn of document.querySelectorAll<HTMLElement>('[data-dsh-wordmark]')) {
        if (btn.style.position === 'relative') btn.style.position = ''
      }
    },
  }
}
