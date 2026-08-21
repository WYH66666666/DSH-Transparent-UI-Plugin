/**
 * Aqua client plugin body: the toggleable glassmorphism skin. Owns the durable
 * enable flag through the Host settings namespace, applies/retracts the theme layer through
 * {@link AquaLayer}, and registers two settings surfaces:
 * - the master on/off card into the Plugins section (`settings.plugin.item`,
 *   same shape as the other plugin cards);
 * - every glass knob into the General section's Appearance row area
 *   (`settings.general.item`, right under 外观).
 * One click on the master switch returns the stock UI (every layer is an
 * effect, disposed on flip).
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
// Type-only: pulls the `settings.general.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { AQUA_SETTINGS_NAMESPACE } from '../aqua-settings-constants.ts'
import type { AquaSettings } from '../aqua-settings.ts'
import { AquaPluginCard, type AquaPluginCardInjected } from './AquaPluginCard.tsx'
import { AquaAppearanceRow, type AquaAppearanceRowInjected } from './AquaAppearanceRow.tsx'
import { createAquaRowStore, type AquaSettingsPayload } from './settings-store.ts'
import { en, NS, zh } from './locales.ts'
import { AQUA_ENABLED_KEY, AquaLayer } from './theme-layer.ts'
// Side-effect imports: the theme-layer stylesheet (unloaded with the plugin)
// and the self-hosted Space Grotesk @font-face (no shell dependency).
import './aqua.module.css'
import './fonts.module.css'

/** Required services: theme override stack plus the settings-card surfaces. */
export const inject = ['theme', 'slots', 'locale', 'settingsScope']

/**
 * Read the pre-settings-namespace enable flag without confusing an absent
 * key with an explicitly stored `false` value.
 */
function readLegacyEnabled(): boolean | undefined {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? undefined : raw === 'true'
  } catch {
    return undefined
  }
}

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aqua: settings dictionaries')

  // The layer owns its lifecycle: enable flag, token stack, and CSS attribute
  // are all effects released on disable/dispose.
  const layer = new AquaLayer(ctx)
  const settings = ctx.settingsScope.bind<AquaSettings>({ namespace: AQUA_SETTINGS_NAMESPACE })
  let legacyMigrationAttempted = false
  const syncHostEnabled = (): void => {
    const snapshot = settings.getSnapshot()
    if (snapshot.status !== 'ready' || typeof snapshot.value?.enabled !== 'boolean') return

    const user = snapshot.user
    const hasHostEnabled = typeof user === 'object'
      && user !== null
      && !Array.isArray(user)
      && Object.prototype.hasOwnProperty.call(user, 'enabled')
    if (hasHostEnabled) {
      legacyMigrationAttempted = true
      layer.setEnabled(snapshot.value.enabled)
      return
    }

    if (!legacyMigrationAttempted) {
      legacyMigrationAttempted = true
      const legacyEnabled = readLegacyEnabled()
      if (legacyEnabled !== undefined) {
        layer.setEnabled(legacyEnabled)
        void settings.set('enabled', legacyEnabled)
        return
      }
    }

    layer.setEnabled(snapshot.value.enabled)
  }
  ctx.effect(() => {
    const dispose = settings.subscribe(syncHostEnabled)
    syncHostEnabled()
    return dispose
  }, 'ui-aqua: settings mirror')

  // Two store mirrors of the same layer state: one for the Plugins card
  // (master switch) and one for the General section's Appearance row (knobs).
  const pluginStore = createAquaRowStore()
  const appearanceStore = createAquaRowStore()
  let pluginBound: BoundActions<typeof pluginStore> | undefined
  let appearanceBound: BoundActions<typeof appearanceStore> | undefined
  let revision = 0
  const payload = (): AquaSettingsPayload => {
    const s = layer.getSettings()
    return {
      enabled: layer.getEnabled(),
      mode: s.mode,
      blur: s.blur,
      frost: s.frost,
      fluidHue: s.fluidHue,
      fluidDepth: s.fluidDepth,
      bgBrightness: s.bgBrightness,
      dark: layer.getDark(),
      background: s.background,
      wallpaper: s.wallpaper,
      whale: s.whale,
      critters: s.critters,
      mesh: s.mesh,
      spotlight: s.spotlight,
      press: s.press,
      wallpaperBlur: s.wallpaperBlur,
      wallpaperFrost: s.wallpaperFrost,
      videoBlur: s.videoBlur,
      videoBrightness: s.videoBrightness,
    }
  }
  const sync = (): void => {
    const next = payload()
    pluginBound?.sync(next, revision)
    appearanceBound?.sync(next, revision)
    revision += 1
  }
  // The Appearance switch flips the brightness knob's half-range; re-sync
  // both stores so the row re-renders with the new range.
  ctx.effect(() => ctx.on('theme/change', () => { sync() }), 'ui-aqua: appearance scheme sync')

  const pluginInjected = (actions: BoundActions<typeof pluginStore>): AquaPluginCardInjected => {
    pluginBound = actions
    // Re-sync from the layer so no flip is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync()
    return {
      setEnabled: (enabled) => {
        layer.setEnabled(enabled)
        void settings.set('enabled', enabled)
        sync()
      },
    }
  }
  const appearanceInjected = (actions: BoundActions<typeof appearanceStore>): AquaAppearanceRowInjected => {
    appearanceBound = actions
    sync()
    return {
      setMode: (mode) => {
        layer.setMode(mode)
        sync()
      },
      setBlur: (blur) => {
        layer.setBlur(blur)
        sync()
      },
      setFrost: (frost) => {
        layer.setFrost(frost)
        sync()
      },
      setFluidHue: (fluidHue) => {
        layer.setFluidHue(fluidHue)
        sync()
      },
      setFluidDepth: (fluidDepth) => {
        layer.setFluidDepth(fluidDepth)
        sync()
      },
      setBgBrightness: (bgBrightness) => {
        layer.setBgBrightness(bgBrightness)
        sync()
      },
      setBackground: (background) => {
        layer.setBackground(background)
        sync()
      },
      setWallpaper: (wallpaper) => {
        layer.setWallpaper(wallpaper)
        sync()
      },
      setWhale: (whale) => {
        layer.setWhale(whale)
        sync()
      },
      setCritters: (critters) => {
        layer.setCritters(critters)
        sync()
      },
      setMesh: (mesh) => {
        layer.setMesh(mesh)
        sync()
      },
      setSpotlight: (spotlight) => {
        layer.setSpotlight(spotlight)
        sync()
      },
      setPress: (press) => {
        layer.setPress(press)
        sync()
      },
      setWallpaperBlur: (wallpaperBlur) => {
        layer.setWallpaperBlur(wallpaperBlur)
        sync()
      },
      setWallpaperFrost: (wallpaperFrost) => {
        layer.setWallpaperFrost(wallpaperFrost)
        sync()
      },
      setVideoBlur: (videoBlur) => {
        layer.setVideoBlur(videoBlur)
        sync()
      },
      setVideoBrightness: (videoBrightness) => {
        layer.setVideoBrightness(videoBrightness)
        sync()
      },
      authorizeVideo: () => {
        layer.authorizeVideo()
      },
    }
  }

  // Master switch card in the Plugins configurable tab.
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: AQUA_SETTINGS_NAMESPACE,
    store: pluginStore,
    locale: NS,
    inject: pluginInjected,
  }, AquaPluginCard))

  // Glass knobs row in the General section, directly under Appearance (10).
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'aqua',
    order: 11,
    store: appearanceStore,
    locale: NS,
    inject: appearanceInjected,
  }, AquaAppearanceRow))
}
