# 文档站点

文档站点会构建成静态 HTML，便于发布到 GitHub Pages。默认文档语言为简体中文，英文版本位于 `/en/`。

## 选定技术栈

当前技术栈：

- `marked`：渲染 GitHub Flavored Markdown。
- `scripts/build-docs.mjs`：生成静态站点。
- `scripts/preview-docs.mjs`：本地预览构建结果。
- GitHub Actions：把 `docs-site/` 部署到 GitHub Pages。

这个方案适合当前项目，因为文档已经是 Markdown，仓库已经是 Node 项目，而目标只是一个轻量静态站点，不需要完整 docs application。

## 备选方案

| 方案 | 适配度 | 取舍 |
| --- | --- | --- |
| 自定义 `marked` 生成器 | 当前最合适 | 需要维护一个小脚本 |
| VitePress | 作者体验好 | 会增加一套 Vite/esbuild 工具链和 audit surface |
| Docusaurus | 适合大型/多版本文档 | 对当前项目偏重 |
| MkDocs Material | 成熟、漂亮 | 会给 Node 仓库增加 Python 工具链 |

## 本地命令

```bash
npm run docs:build
npm run docs:preview
```

## GitHub Pages

`.github/workflows/docs.yml` 会运行 `npm run docs:build`，上传 `docs-site/`，并使用 GitHub Pages 部署。仓库设置中应将 Pages source 设为 GitHub Actions。

## 语言路径

- 中文默认入口：`/`
- 英文入口：`/en/`

构建器会为同一页面生成语言切换链接；新增中文页面时，应在 `docs/en/` 下保留对应英文页面。

## 截图资产

文档截图位于：

```text
docs/assets/screenshots/
```

docs 构建会复制该目录到最终静态站点，因此 Markdown 可以用如下路径引用截图：

```markdown
![Fire Keeper AI 桌面任务账册](../assets/screenshots/firekeeper-desktop-ledger.png)
```
