/**
 * Aqua client plugin body: the toggleable deep-sea skin. Owns the durable
 * enable flag (localStorage), applies/retracts the theme layer through
 * {@link AquaLayer}, and registers its on/off card into the Plugins settings
 * section (configurable tab) — one click returns the stock UI (every layer
 * is an effect, disposed on flip).
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import './aqua.module.css';
/** Required services: theme override stack plus the settings-card surfaces. */
export declare const inject: string[];
/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map