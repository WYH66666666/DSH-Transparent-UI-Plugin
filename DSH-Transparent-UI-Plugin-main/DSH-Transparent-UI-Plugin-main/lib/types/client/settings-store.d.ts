/**
 * Aqua row slot store: a mirror of the layer enable flag. The plugin's
 * apply-world change listener is the only writer; the row component reads
 * via props.useStore.
 */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client';
/** Store state mirrored from the Aqua settings scope. */
export interface AquaRowState {
    /** Persisted layer enable flag. */
    enabled: boolean;
    /** Monotonic revision; -1 until first sync so revision 0 lands as a change. */
    revision: number;
}
/** Declared action shape giving the exported factory a stable return type. */
type AquaRowActions = {
    sync: (draft: AquaRowState, enabled: boolean, revision: number) => void;
};
/**
 * Declares the Aqua row state and write surface.
 * @returns the store handle.
 */
export declare function createAquaRowStore(): EngineStoreHandle<AquaRowState, AquaRowActions>;
export {};
//# sourceMappingURL=settings-store.d.ts.map