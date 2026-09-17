/**
 * Aqua theme-layer plugin, node half. Pure UI plugin: the empty apply exists
 * so the plugin appears in the host cordis.yml / Loader; the browser half
 * ships via exports["./client"], discovered through the package.json
 * dsh.client declaration. The enable flag is a browser-local preference
 * (localStorage) — a client-only visual layer owns no host configuration.
 *
 * The one host-side duty is registering this plugin's settings namespace so
 * the Plugins section serves it and the client card (settings.plugin.item,
 * keyed by namespace since DSH 0.1.0-rc.7) is actually dispatched. Dynamic
 * import keeps the failure mode soft: if the settings service is unavailable,
 * only the card is missing — the theme layer itself keeps working.
 */

/**
 * Register this plugin's settings namespace (DSH 0.1.0-rc.7+ requirement:
 * `settings.plugin.item` is a keyed slot keyed on the settings namespace, and
 * the Host must serve the namespace for the card to render).
 * Fails soft on any error — the skin itself is client-side and unaffected.
 */
async function registerSettingsNamespace(ctx: any): Promise<void> {
  try {
    const settingsMod: any = await import('@deepseek-ai/dsh-settings')
    const schemaMod: any = await import('schemastery')
    settingsMod.installSettingsSection(ctx, settingsMod.settingsNamespace('dsh-client-ui-aqua'), schemaMod.z.object({}), {}, {
      setSource: () => {},
      onChange: () => {},
    })
    ctx.logger?.info?.('dsh-client-ui-aqua: settings 命名空间已注册（设置卡可用）')
  } catch (error) {
    ctx.logger?.warn?.('dsh-client-ui-aqua: settings 命名空间注册失败（设置卡不显示，皮肤不受影响）: %s', String(error))
  }
}

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(ctx: any): void {
  void registerSettingsNamespace(ctx)
}
