/**
 * Aqua theme-layer plugin, node half. The browser half ships via
 * exports["./client"], discovered through the package.json dsh.client
 * declaration. The Host registers the namespace used to expose the browser
 * card in the current DSH Plugins settings page.
 */
import type { Context } from '@deepseek-ai/cordis';
/** Register the Aqua settings namespace when the Host settings service exists. */
export declare function apply(ctx: Context): void;
export { AQUA_ENABLED_FIELD, AQUA_SETTINGS_NAMESPACE, AquaSettingsSchema, DEFAULT_ENABLED, type AquaSettings, } from './aqua-settings.ts';
//# sourceMappingURL=index.d.ts.map