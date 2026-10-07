/**
 * Fluid interaction feeds: buttons ripple on hover/click with a damped
 * stir (the shader settles the wake softly). Scroll wakes were removed by
 * request — feedback stays action-driven and gentle. Coordinates are
 * normalized per the single full-screen canvas so the ripple lands where
 * the action happened. Site policy (no passive mouse trail) is preserved.
 */
import type { FluidShaderHandle } from './fluid-shader.ts';
/** The one live fluid surface. */
export interface FluidTargets {
    main: FluidShaderHandle;
    mainCanvas: HTMLCanvasElement;
}
/**
 * Attach the button ripple listeners.
 * @param targets - the fluid handle and its canvas.
 * @returns disposer removing every listener.
 */
export declare function attachFluidInteractions(targets: FluidTargets): () => void;
//# sourceMappingURL=fluid-interactions.d.ts.map