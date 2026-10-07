/** `settings.aqua` namespace dictionaries (the settings-row copy). */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.aqua";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    'aqua.title': string;
    'aqua.description': string;
    'aqua.enable': string;
    'aqua.disable': string;
};
export type AquaLocaleKey = keyof typeof zh;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The Aqua settings row's copy. */
        'settings.aqua': AquaLocaleKey;
    }
}
/** English dictionary. */
export declare const en: {
    'aqua.title': string;
    'aqua.description': string;
    'aqua.enable': string;
    'aqua.disable': string;
};
//# sourceMappingURL=locales.d.ts.map