//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-aqua`.
* @module @deepseek-ai/dsh-client-ui-aqua/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-aqua";
/** Cordis companion plugin name. */
const name = "client-ui-aqua-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the theme layer holds no cross-plugin mutable state —
* token overrides, the DOM attribute, the ambient layer, and the greeting
* observer are all owned effects disposed with the plugin fiber.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
