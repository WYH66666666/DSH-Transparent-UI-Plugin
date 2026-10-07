import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { createAquaRowStore } from './settings-store.ts';
/** Injected business face: the enable write (t rides the standard locale seat). */
export interface AquaRowInjected {
    /** Switch the deep-sea layer on or off. */
    setEnabled: (enabled: boolean) => void;
}
/** Full component props: runtime share + store share + locale seat + injected face. */
export type AquaRowComponentProps = PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAquaRowStore>> & PropsLocale<'settings.aqua'> & AquaRowInjected;
/**
 * Render the Aqua row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export declare function AquaRow({ t, setEnabled, useStore }: AquaRowComponentProps): import("react").JSX.Element;
//# sourceMappingURL=AquaRow.d.ts.map