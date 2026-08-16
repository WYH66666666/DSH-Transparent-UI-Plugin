/**
 * Ambient marine-life scene: the markup the layer injects behind the app
 * frame — brand-fish silhouettes drifting, a shrimp or two crawling the
 * bottom, rising bubbles, twinkling plankton. Positions, sizes, and
 * per-critter timing ride inline styles; the motion itself lives in
 * aqua.module.css (and silences under prefers-reduced-motion).
 */

/** The DeepSeek brand fish silhouette (exact figma extract, scaled down). */
const FISH_PATH = 'M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 '
  + '22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973'
  + 'C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 '
  + '16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 '
  + '0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 '
  + '5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 '
  + '16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 '
  + '3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 '
  + '12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 '
  + '8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575'
  + 'C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 '
  + '7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 '
  + '15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 '
  + '16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 '
  + '6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 '
  + '23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 '
  + '12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396'
  + 'C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 '
  + '12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332'
  + 'C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 '
  + '10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 '
  + '15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338'
  + 'C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 '
  + '8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988'
  + 'ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 '
  + '9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 '
  + '13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 '
  + '11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834'
  + 'C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 '
  + '9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z'

/** A small shrimp: curved body, tail fan, two antenna strokes. (Retired — the
 *  scene ships fish, bubbles, and plankton only.) */

/** One inline-svg critter. */
function svg(critter: string, viewBox: string, width: number, style: string, body: string): string {
  return `<svg data-aqua-critter="${critter}" viewBox="${viewBox}" width="${width}" `
    + `style="${style}" aria-hidden="true">${body}</svg>`
}

function fish(style: string, width: number): string {
  return svg('fish', '0 0 23.16 17.04', width, style, `<path d="${FISH_PATH}" fill="currentColor"/>`)
}

function fishLeft(style: string, width: number): string {
  return svg('fish-left', '0 0 23.16 17.04', width, style, `<path d="${FISH_PATH}" fill="currentColor"/>`)
}

function bubble(style: string, size: number): string {
  return svg('bubble', '0 0 8 8', size, style,
    '<circle cx="4" cy="4" r="3" fill="none" stroke="currentColor" stroke-width="1"/>')
}

function plankton(style: string): string {
  return svg('plankton', '0 0 3 3', 3, style, '<circle cx="1.5" cy="1.5" r="1.5" fill="currentColor"/>')
}

/**
 * The complete ambient scene markup: one fixed, click-transparent container
 * the layer prepends to <body> while enabled and removes on disable. The
 * deepseek.com fluid shader canvas forms the board; marine life rides over it.
 */
export const AMBIENT_SCENE = [
  '<canvas data-dsh-aqua-fluid-canvas></canvas>',
  fish('top:22%;left:58%;animation-duration:9s', 30),
  fishLeft('top:36%;left:10%;animation-duration:14s;animation-delay:-4s', 20),
  fish('top:64%;left:76%;animation-duration:19s;animation-delay:-9s;opacity:0.55', 14),
  bubble('bottom:8%;left:9%;animation-duration:8s', 7),
  bubble('bottom:5%;left:13%;animation-duration:10s;animation-delay:2.5s', 5),
  bubble('bottom:10%;left:17%;animation-duration:9s;animation-delay:5s', 6),
  bubble('bottom:9%;left:82%;animation-duration:11s;animation-delay:1.5s', 8),
  bubble('bottom:6%;left:87%;animation-duration:8s;animation-delay:4s', 5),
  plankton('top:14%;left:42%;animation-delay:-1s'),
  plankton('top:32%;left:70%;animation-delay:-3s'),
  plankton('top:72%;left:18%;animation-delay:-2s'),
  plankton('top:56%;left:86%;animation-delay:-4s'),
].join('')

/** Build the ambient container element (or reuse an existing one). */
export function ensureAmbientScene(): HTMLElement {
  const existing = document.querySelector<HTMLElement>('[data-dsh-aqua-ambient]')
  if (existing !== null) return existing
  const holder = document.createElement('div')
  holder.innerHTML = `<div data-dsh-aqua-ambient aria-hidden="true">${AMBIENT_SCENE}</div>`
  const node = holder.firstElementChild
  if (!(node instanceof HTMLElement)) throw new Error('ui-aqua: ambient scene markup failed to parse')
  document.body.prepend(node)
  // The wallpaper media lives in its OWN fixed layer: videos fail to
  // composite inside the ambient's animated opacity group (the breathe
  // animation), so the wallpaper must not be a descendant of it.
  if (document.querySelector('[data-dsh-aqua-wallpaper-layer]') === null) {
    const wallpaper = document.createElement('div')
    wallpaper.setAttribute('data-dsh-aqua-wallpaper', '')
    wallpaper.setAttribute('data-dsh-aqua-wallpaper-layer', '')
    wallpaper.setAttribute('aria-hidden', 'true')
    wallpaper.innerHTML =
      '<img data-dsh-aqua-wallpaper-img alt="">' +
      '<video data-dsh-aqua-wallpaper-video loop playsinline preload="auto"></video>'
    document.body.prepend(wallpaper)
  }
  return node
}

/** Remove the ambient container wherever it lives. */
export function removeAmbientScene(): void {
  for (const node of document.querySelectorAll('[data-dsh-aqua-ambient]')) node.remove()
  for (const node of document.querySelectorAll('[data-dsh-aqua-wallpaper-layer]')) node.remove()
}

/** Add the page edge-fade bands (5px gradient blur over the chat content). */
export function ensurePageFades(): void {
  if (document.querySelector('[data-dsh-aqua-fade]') !== null) return
  const top = document.createElement('div')
  top.setAttribute('data-dsh-aqua-fade', 'top')
  top.setAttribute('aria-hidden', 'true')
  const bottom = document.createElement('div')
  bottom.setAttribute('data-dsh-aqua-fade', 'bottom')
  bottom.setAttribute('aria-hidden', 'true')
  document.body.appendChild(top)
  document.body.appendChild(bottom)
}

/** Remove the edge-fade bands. */
export function removePageFades(): void {
  for (const el of document.querySelectorAll('[data-dsh-aqua-fade]')) el.remove()
}
