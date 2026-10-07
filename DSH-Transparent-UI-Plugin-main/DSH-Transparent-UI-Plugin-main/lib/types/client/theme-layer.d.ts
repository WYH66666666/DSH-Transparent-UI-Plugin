/**
 * Aqua theme layer: one toggleable visual skin over the whole Web surface.
 * Everything this layer owns is an effect — token overrides ride the theme
 * service's override stack, the CSS hooks ride a `data-dsh-aqua` attribute on
 * <html> (the stylesheet only applies under it), the hero copy rides a
 * MutationObserver that decorates new [data-hero-headline] mounts — so
 * switching the flag off (or unloading the plugin) restores the stock UI
 * exactly: no residue, no reload.
 *
 * The enable flag persists in localStorage: a client-only visual preference
 * (like the selected-session key), written and read by this plugin alone.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client';
/** html attribute selecting the Aqua layer: CSS hooks and ambient effects. */
export declare const AQUA_ATTRIBUTE = "data-dsh-aqua";
/** localStorage key carrying the layer enable flag. */
export declare const AQUA_ENABLED_KEY = "dsh.ui-aqua.enabled";
/** Default state when nothing is stored yet: on. */
export declare const DEFAULT_ENABLED = true;
/**
 * Alias-token override layer: the deep-sea palette. Every value is a
 * `{ light, dark }` pair so the layer stays legible when the user switches
 * the Appearance preference — dark is deep-sea navy, light is cool white-blue.
 */
export declare const AQUA_TOKEN_OVERRIDES: ThemeTokenOverrides;
/**
 * Owns the Aqua layer lifecycle: reads the durable enable flag, and applies /
 * retracts every layer on change. Cross-tab flips arrive through the storage
 * event; the greeting observer and every subscription are released when the
 * plugin fiber is disposed.
 */
export declare class AquaLayer {
    private enabled;
    private tokenDisposer;
    private mainFluid;
    private interactionDisposer;
    private themeListener;
    private observer;
    private readonly ctx;
    /**
     * @param ctx - owning client context.
     */
    constructor(ctx: Context);
    /** Current enable state (the settings row mirrors this). */
    getEnabled(): boolean;
    /** Flip the layer: persist, then apply or retract every owned effect. */
    setEnabled(value: boolean): void;
    /** Active locale id for greeting / placeholder copy. */
    private locale;
    private sync;
    private mount;
    private unmount;
    /** Attach the fluid shader and the interaction feeds. */
    private mountFluid;
    private teardownFluid;
    private fluidParams;
    private applyFluidPalettes;
    /**
     * Decorate hero mounts as they appear: random greeting per new blank
     * session, Aqua placeholder on the hero composer.
     * @param root - added element to scan.
     */
    private decorate;
    private startObserver;
    private stopObserver;
}
//# sourceMappingURL=theme-layer.d.ts.map