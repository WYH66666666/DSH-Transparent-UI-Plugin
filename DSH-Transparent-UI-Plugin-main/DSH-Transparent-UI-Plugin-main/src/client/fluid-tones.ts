/**
 * Continuous fluid palette: hue (0-360) and depth (0-100) sliders drive the
 * shader colors directly through HSL interpolation — stepless, no preset
 * steps. Depth 0 = the deep, saturated version of the hue (e.g. #8B0000 for
 * red), depth 100 = the pale, light version (e.g. #FFCCCB); the deep base
 * stop stays near-neutral so the colorless areas keep their true color.
 */

export interface FluidToneColors {
  /** Bright bloom stop. */
  color1: string
  /** Mid wash stop. */
  color2: string
  /** Deep base stop (near-neutral). */
  color3: string
}

/** hsl(h, s, l) → #rrggbb. */
function hsl(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x } else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c } else { r = c; b = x }
  const toHex = (v: number): string => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/** The slider's 0/360 lands on the blue base, sweeping clockwise around the
 *  wheel — 320 lands on the cyan-blue the old hue-rotate system produced. */
export const HUE_BASE = 217

/**
 * Palette for the given hue (0-360) and depth (0-100), per scheme.
 * The depth ramp is piecewise: the lower half sweeps from the absolute
 * extreme — pure black in dark mode, the deep saturated shade (e.g. #8B0000
 * for red) in light mode — up to the shipped mid look; the upper half
 * sweeps from mid to pale (#FFCCCB for red). Stepless HSL interpolation.
 */
export function fluidToneColors(dark: boolean, hue: number, depth: number): FluidToneColors {
  const h = (((hue + HUE_BASE) % 360) + 360) % 360
  const d = Math.min(1, Math.max(0, depth / 100))
  const ramp = (deep: number, mid: number, pale: number): number =>
    d < 0.5 ? deep + ((mid - deep) * d) / 0.5 : mid + ((pale - mid) * (d - 0.5)) / 0.5
  if (dark) {
    return {
      color1: hsl(h, 0.85, ramp(0, 0.46, 0.62)),
      color2: hsl(h, 0.9, ramp(0, 0.305, 0.45)),
      color3: hsl(h, 0.5, ramp(0, 0.075, 0.10)),
    }
  }
  return {
    color1: hsl(h, 1, ramp(0.27, 0.45, 0.90)),
    color2: hsl(h, 0.55, 0.86),
    color3: hsl(h, 0.25, 0.955),
  }
}
