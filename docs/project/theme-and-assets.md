# 主题与资产

视觉系统使用《黑暗之魂》风格氛围：篝火暖光、灰烬、哥特石质、暗金属质感和防火女意象。

![Fire Keeper AI 桌面氛围](../assets/screenshots/firekeeper-desktop-ledger.png)

## UI 规则

- 不要让美术盖过文字。
- 背景图上必须使用暗色遮罩。
- 在窄屏上隐藏或降低角色图存在感。
- 控件要保持可识别、紧凑、可操作。
- 不要添加会移动布局或阻挡交互的装饰。

## 资产目录

资产位于 `apps/web/src/assets`：

- `scene`：环境/背景图片。
- `char`：角色主导图片。
- `object`：道具、篝火等物件图片。
- `brand`：商店/header/capsule 等品牌图。
- `reference`：contact sheet 和仅用于审阅的选图辅助。
- `manifests`：来源、授权和使用说明。

文档截图位于：

- `docs/assets/screenshots`

## 当前集成资产

- 页面背景：`scene/local-screenshots/bg-anor-londo-skyline.jpg`
- 任务 banner：`object/bonfire/bg-bonfire-ruins-cropped-banner.jpg`
- 聊天气氛图：`char/fire-keeper/fire-keeper-art-rashed-alakroka.jpg`
- 文档截图：`docs/assets/screenshots/firekeeper-desktop-ledger.png`
- 中文界面截图：`docs/assets/screenshots/firekeeper-chinese-ui.png`

## 版权说明

当前《黑暗之魂》和防火女视觉资产包含游戏或粉丝内容，只适合本地/私人 fan prototype。公开发布前应替换为原创或拥有合适授权的美术资产。

## 相关文件

- `apps/web/src/assets/README.md`
- `apps/web/src/assets/manifests/`
- `apps/web/src/styles.css`
- `docs/assets/screenshots/`
