/**
 * Faithful port of the deepseek.com join-section fluid shader
 * (`ds-join-shader-bg`): a WebGL2 two-pass fluid simulation — a quarter-res
 * flow field (decay + pointer brush with velocity, ping-ponged between two
 * framebuffers) sampled by a full-res domain-warped noise renderer with
 * swirl iterations and a three-color soft blend. Shader sources are verbatim
 * from the site bundle; uniform wiring, the 30fps throttle, the 1.5x pixel
 * ratio cap, and the pointer-listener policy (touch and Windows skip the
 * mouse feed) are replicated exactly. Reduced-motion renders one static
 * frame instead of the loop.
 */
/** Site-default parameters (the join-section look). */
export interface FluidParams {
    mouseRadius: number;
    mouseStrength: number;
    decay: number;
    distortBoost: number;
    noiseBoost: number;
    swirlBoost: number;
    speed: number;
    distortion: number;
    swirl: number;
    swirlIterations: number;
    scale: number;
    rotation: number;
    proportion: number;
    softness: number;
    shapeScale: number;
    offsetX: number;
    offsetY: number;
    color1: string;
    color2: string;
    color3: string;
}
/** The exact default parameter set shipped by the site. */
export declare const SITE_FLUID_PARAMS: FluidParams;
/** Handle returned by {@link attachFluidShader}. */
export interface FluidShaderHandle {
    /** Update simulation parameters (e.g. a palette switch) without re-mounting. */
    setParams: (params: FluidParams) => void;
    /** Stir the fluid at normalized coordinates with a velocity burst (wakes). */
    stir: (x: number, y: number, vx: number, vy: number) => void;
    /** Stop the loop and release listeners. */
    dispose: () => void;
}
/**
 * Mount the fluid simulation on a canvas and run it until disposed.
 * @param canvas - full-size canvas element (CSS-sized by the ambient layer).
 * @param params - simulation parameters (site defaults are the natural input).
 * @returns the live handle.
 */
export declare function attachFluidShader(canvas: HTMLCanvasElement, params: FluidParams): FluidShaderHandle;
//# sourceMappingURL=fluid-shader.d.ts.map