/**
 * Aqua theme-layer plugin, node half. The browser half ships via
 * exports["./client"], discovered through the package.json dsh.client
 * declaration. The Host registers the namespace used to expose the browser
 * card in the current DSH Plugins settings page.
 */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { AQUA_SETTINGS_NAMESPACE, AquaSettingsSchema } from './aqua-settings.ts'

/** Register the Aqua settings namespace when the Host settings service exists. */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(AQUA_SETTINGS_NAMESPACE),
      AquaSettingsSchema,
    )
  })
}

export {
  AQUA_ENABLED_FIELD, AQUA_SETTINGS_NAMESPACE, AquaSettingsSchema,
  DEFAULT_ENABLED, type AquaSettings,
} from './aqua-settings.ts'
