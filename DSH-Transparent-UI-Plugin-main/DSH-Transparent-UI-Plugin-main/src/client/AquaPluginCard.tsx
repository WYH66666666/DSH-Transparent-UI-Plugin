/**
 * Aqua card registered into the Plugins settings section's configurable tab
 * (`settings.plugin.item`): the master on/off switch — name, description, and
 * one toggle, in the section's card language. Every other knob lives in the
 * General settings' Appearance row, so the card stays the same shape as the
 * other plugin cards.
 */
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { createAquaRowStore } from './settings-store.ts'
import css from './AquaPluginCard.module.css'

/** Injected business face: the master enable write. */
export interface AquaPluginCardInjected {
  /** Switch the glass layer on or off. */
  setEnabled: (enabled: boolean) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AquaPluginCardComponentProps =
  PropsRuntime<'settings.plugin.item'> & PropsStore<ReturnType<typeof createAquaRowStore>>
  & PropsLocale<'settings.aqua'> & InjectFace<AquaPluginCardInjected>

/**
 * Render the Aqua plugin card.
 * @param props - composed slot props.
 * @returns the card list item.
 */
export function AquaPluginCard(props: AquaPluginCardComponentProps) {
  const { t, setEnabled, useStore } = props
  const enabled = useStore(s => s.enabled)
  return (
    <li className={css.card}>
      <div className={css.head}>
        <div className={css.text}>
          <div className={css.title}>{t('aqua.title')}</div>
          <div className={css.description}>{t('aqua.description')}</div>
        </div>
        <button
          type="button"
          className={css.toggle}
          aria-pressed={enabled}
          onClick={() => { setEnabled(!enabled) }}
        >
          <span className={css.check}>
            {enabled && <IconCheckOutline16 />}
          </span>
          {enabled ? t('aqua.enable') : t('aqua.disable')}
        </button>
      </div>
    </li>
  )
}
