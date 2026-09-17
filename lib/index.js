//#region lib/types/index.js
/**
* Aqua theme-layer plugin, node half. Pure UI plugin: the empty apply exists
* so the plugin appears in the host cordis.yml / Loader; the browser half
* ships via exports["./client"], discovered through the package.json
* dsh.client declaration. The enable flag is a browser-local preference
* (localStorage) — a client-only visual layer owns no host configuration.
*
* DSH 0.1.0-rc.7+ 兼容：settings.plugin.item 变为 keyed slot（以 settings
* 命名空间为键），宿主需 serve 该命名空间设置卡才会被 dispatch。动态 import
* + try-catch，失败仅设置卡不显示，皮肤本身（纯客户端）不受影响。
*/
async function registerSettingsNamespace(ctx) {
  try {
    const settingsMod = await import('@deepseek-ai/dsh-settings');
    const schemaMod = await import('schemastery');
    settingsMod.installSettingsSection(ctx, settingsMod.settingsNamespace('dsh-client-ui-aqua'), schemaMod.z.object({}), {}, {
      setSource: () => {},
      onChange: () => {},
    });
    ctx.logger?.info?.('dsh-client-ui-aqua: settings 命名空间已注册（设置卡可用）');
  } catch (error) {
    ctx.logger?.warn?.('dsh-client-ui-aqua: settings 命名空间注册失败（设置卡不显示，皮肤不受影响）: %s', String(error));
  }
}
/** Host plugin body — registers the settings namespace; no other host behavior. */
function apply(ctx) {
  void registerSettingsNamespace(ctx);
}
//#endregion
export { apply };
