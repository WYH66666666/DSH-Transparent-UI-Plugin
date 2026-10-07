/**
 * Ambient marine-life scene: the markup the layer injects behind the app
 * frame — brand-fish silhouettes drifting, a shrimp or two crawling the
 * bottom, rising bubbles, twinkling plankton. Positions, sizes, and
 * per-critter timing ride inline styles; the motion itself lives in
 * aqua.module.css (and silences under prefers-reduced-motion).
 */
/**
 * The complete ambient scene markup: one fixed, click-transparent container
 * the layer prepends to <body> while enabled and removes on disable. The
 * deepseek.com fluid shader canvas forms the board; marine life rides over it.
 */
export declare const AMBIENT_SCENE: string;
/** Build the ambient container element (or reuse an existing one). */
export declare function ensureAmbientScene(): HTMLElement;
/** Remove the ambient container wherever it lives. */
export declare function removeAmbientScene(): void;
//# sourceMappingURL=critters.d.ts.map