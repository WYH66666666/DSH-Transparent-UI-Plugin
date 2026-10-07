/** Aqua theme-layer preference stored in the Host user-settings document. */
import z from '@deepseek-ai/schemastery';
/** Settings namespace owned by the Aqua plugin. */
export declare const AQUA_SETTINGS_NAMESPACE = "ui-aqua";
/** Field carrying the layer enable flag. */
export declare const AQUA_ENABLED_FIELD = "enabled";
/** Durable Aqua section shared by the Host schema and the browser scope. */
export interface AquaSettings {
    /** Whether the deep-sea theme layer is applied. */
    enabled: boolean;
}
/** Default state when the user-settings document has no override: on. */
export declare const DEFAULT_ENABLED = true;
/** Durable Aqua schema; also the wire envelope the browser scope validates against. */
export declare const AquaSettingsSchema: z<AquaSettings>;
//# sourceMappingURL=aqua-settings.d.ts.map