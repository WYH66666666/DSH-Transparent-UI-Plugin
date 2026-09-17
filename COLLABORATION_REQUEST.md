# 合作申请 / Collaboration Request

致 Aqua 作者：

你好！我是第三方插件 [dsh-task-control](https://github.com/ningmengxr/dsh-task-control)（DSH 任务控制插件）的作者 **ningmengxr**。Aqua 是我日常在用的皮肤插件，非常感谢你做出这么好看的界面。

## 背景：本 PR 修了两个兼容性问题

DSH 近期迭代很快，我本地的 Aqua 1.3.0 在新版下已经无法加载。我做了两处修复（即本 PR 内容），均在 **DSH 0.1.6-alpha.1** 实测通过（皮肤与设置卡正常）：

1. **keyed slot 适配（DSH 0.1.0-rc.7+）**
   `settings.plugin.item` 从普通列表槽改成了 **keyed slot**：注册必须提供 `key`（= 插件的 settings 命名空间），否则整个插件加载失败、DSH 无法启动。
   修复：客户端注册补 `key: 'dsh-client-ui-aqua'`；宿主补注册同名 settings 命名空间（`installSettingsSection`），设置卡才会被 dispatch 显示。

2. **模块迁移适配（DSH 0.1.5 / 0.1.6）**
   `@deepseek-ai/dsh-client-runtime` 包**已被移除**，其能力迁到了新的 `@deepseek-ai/dsh-client-store`；Aqua 仍在 `require('@deepseek-ai/dsh-client-runtime/client')` → `import failed (see console for the import error)`。
   修复：模块路径改为 `@deepseek-ai/dsh-client-store`（API 完全兼容——Aqua 只用到 `defineStore`，新版签名 `{ init, actions }` 一致）。

> 修复原理与同类案例可参考我处理的另一个插件（同样的 keyed slot 兼容问题）：https://github.com/ningmengxr/dsh-task-control

## 合作申请

我注意到你更新很勤，但 DSH 的破坏性变更节奏也很快（近一个月内就先后出现了 keyed slot、包改名、slot 迁移等）。**如果你愿意，我希望申请本仓库的协作者权限（collaborator / 可编辑权限）**，在后续 DSH 版本出现兼容性问题时帮你及时修复、直接提交，减轻你的维护负担：

- 我只做**兼容性修复与必要的小修**，不擅自动你的设计与视觉风格；
- 每个改动都会附上**复现步骤 + 实测结论**；
- 若你更希望保持"只走 PR"的流程，也完全可以——我按你的偏好来；
- 若暂时不方便授予权限，也请把我当作长期的 issue/PR 贡献者，兼容性问题可以直接 @ 我。

再次感谢你做出 Aqua！

— ningmengxr
