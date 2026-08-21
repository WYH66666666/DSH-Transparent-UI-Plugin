/** Aqua theme-layer preference stored in the Host user-settings document. */

import z from '@deepseek-ai/schemastery'
import { AQUA_ENABLED_FIELD } from './aqua-settings-constants.ts'

export { AQUA_ENABLED_FIELD, AQUA_SETTINGS_NAMESPACE } from './aqua-settings-constants.ts'

/** Durable Aqua section shared by the Host schema and the browser scope. */
export interface AquaSettings {
  enabled: boolean
}

/** Default state when the user-settings document has no override: on. */
export const DEFAULT_ENABLED = true

/** Durable schema shared by the Host registration and browser settings scope. */
export const AquaSettingsSchema: z<AquaSettings> = z.object({
  [AQUA_ENABLED_FIELD]: z.boolean().default(DEFAULT_ENABLED),
})
