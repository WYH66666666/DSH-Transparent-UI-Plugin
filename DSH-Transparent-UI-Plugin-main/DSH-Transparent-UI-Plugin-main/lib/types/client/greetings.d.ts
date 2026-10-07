/**
 * Hero greeting pool: time-of-day buckets, random pick per new-session
 * mount, no immediate repeat. Disabling the Aqua layer resets the hero back
 * to the stock greeting for the active locale.
 */
/**
 * Pick the greeting for the next hero mount.
 * @param locale - active locale id (`zh` pools by time of day; anything else
 * uses the English pool).
 * @returns the greeting string.
 */
export declare function pickGreeting(locale: string): string;
/**
 * Restore the stock hero copy for the active locale (called when the Aqua
 * layer is switched off, so the UI returns to its original wording).
 * @param locale - active locale id.
 */
export declare function resetHeroCopy(locale: string): void;
/**
 * Aqua placeholder for the hero composer, matched to the active locale.
 * @param locale - active locale id.
 * @returns the placeholder string.
 */
export declare function aquaPlaceholder(locale: string): string;
//# sourceMappingURL=greetings.d.ts.map