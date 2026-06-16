import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "docs");
const outRoot = path.join(repoRoot, "docs-site");

marked.setOptions({
  gfm: true,
  mangle: false,
  headerIds: true
});

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function slash(filePath) {
  return filePath.split(path.sep).join("/");
}

function pageOutputPath(markdownPath) {
  const relative = slash(path.relative(docsRoot, markdownPath));
  const parsed = path.posix.parse(relative);

  if (parsed.base.toLowerCase() === "readme.md" || parsed.base.toLowerCase() === "index.md") {
    return path.join(outRoot, parsed.dir, "index.html");
  }

  return path.join(outRoot, parsed.dir, `${parsed.name}.html`);
}

function pageLanguage(relativePath) {
  return relativePath.startsWith("en/") ? "en" : "zh-CN";
}

function withoutLanguagePrefix(relativePath) {
  return relativePath.startsWith("en/") ? relativePath.slice(3) : relativePath;
}

function titleFromMarkdown(source, fallback) {
  const heading = source.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : fallback;
}

function pageHref(fromOutputPath, toOutputPath) {
  const relative = slash(path.relative(path.dirname(fromOutputPath), toOutputPath));
  return relative.startsWith(".") ? relative : `./${relative}`;
}

function markdownLinkToOutput(fromMarkdownPath, href) {
  if (/^[a-z]+:/i.test(href) || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  const [target, hash = ""] = href.split("#");
  if (!target.toLowerCase().endsWith(".md")) {
    return href;
  }

  const resolved = path.resolve(path.dirname(fromMarkdownPath), target);
  const output = pageOutputPath(resolved);
  const relative = pageHref(pageOutputPath(fromMarkdownPath), output);
  return hash ? `${relative}#${hash}` : relative;
}

function rewriteMarkdownLinks(html, markdownPath) {
  return html.replace(/href="([^"]+\.md(?:#[^"]*)?)"/g, (_match, href) => {
    return `href="${markdownLinkToOutput(markdownPath, href)}"`;
  });
}

function navGroupTitle(relativePath, language) {
  const localPath = withoutLanguagePrefix(relativePath);

  if (localPath.startsWith("project/")) {
    return language === "zh-CN" ? "项目" : "Project";
  }

  if (localPath.startsWith("design/")) {
    return language === "zh-CN" ? "设计记录" : "Design";
  }

  return language === "zh-CN" ? "开始" : "Start";
}

function renderSidebar(pages, currentPage) {
  const groups = new Map();
  const languagePages = pages.filter((page) => page.language === currentPage.language);

  for (const page of languagePages) {
    const group = navGroupTitle(page.relative, currentPage.language);
    groups.set(group, [...(groups.get(group) || []), page]);
  }

  return [...groups.entries()]
    .map(([group, groupPages]) => {
      const links = groupPages
        .sort((a, b) => withoutLanguagePrefix(a.relative).localeCompare(withoutLanguagePrefix(b.relative)))
        .map((page) => {
          const active = page.outputPath === currentPage.outputPath ? " active" : "";
          return `<a class="nav-link${active}" href="${pageHref(currentPage.outputPath, page.outputPath)}">${page.title}</a>`;
        })
        .join("\n");

      return `<section class="nav-group"><h2>${group}</h2>${links}</section>`;
    })
    .join("\n");
}

function counterpartRelative(page) {
  if (page.language === "en") {
    return page.relative.slice(3);
  }

  return `en/${page.relative}`;
}

function renderLanguageSwitch(page, pages) {
  const counterpart = pages.find((candidate) => candidate.relative === counterpartRelative(page));

  if (!counterpart) {
    return "";
  }

  const label = page.language === "zh-CN" ? "English" : "中文";
  return `<a class="language-switch" href="${pageHref(page.outputPath, counterpart.outputPath)}">${label}</a>`;
}

function renderPage({ page, pages, content }) {
  const sidebar = renderSidebar(pages, page);
  const cssHref = pageHref(page.outputPath, path.join(outRoot, "assets", "site.css"));
  const brand = page.language === "zh-CN" ? "Fire Keeper AI 文档" : "Fire Keeper AI Docs";

  return `<!doctype html>
<html lang="${page.language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title} | Fire Keeper AI Docs</title>
    <link rel="stylesheet" href="${cssHref}">
  </head>
  <body>
    <div class="site-shell">
      <aside class="site-sidebar">
        <a class="site-brand" href="${pageHref(page.outputPath, path.join(outRoot, page.language === "en" ? "en/index.html" : "index.html"))}">${brand}</a>
        ${renderLanguageSwitch(page, pages)}
        ${sidebar}
      </aside>
      <main class="site-content">
        ${content}
      </main>
    </div>
  </body>
</html>`;
}

async function copyStaticDirectory(source, destination) {
  if (!(await exists(source))) {
    return;
  }

  await fs.cp(source, destination, { recursive: true });
}

async function writeSiteCss() {
  const css = `:root {
  color-scheme: dark;
  --bg: #14110f;
  --panel: #1d1916;
  --panel-2: #25201c;
  --line: rgba(214, 170, 99, 0.22);
  --text: #f1e4d1;
  --muted: #bda98f;
  --gold: #d6aa63;
  --ember: #e96b2c;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    linear-gradient(90deg, rgba(10, 9, 8, 0.96), rgba(10, 9, 8, 0.88)),
    #14110f;
  color: var(--text);
}

.site-shell {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  min-height: 100vh;
}

.site-sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid var(--line);
  background: rgba(10, 9, 8, 0.74);
  padding: 24px 18px;
}

.site-brand {
  display: block;
  margin-bottom: 10px;
  color: #ffe0b4;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.45rem;
  font-weight: 700;
  text-decoration: none;
}

.language-switch {
  display: inline-flex;
  margin-bottom: 28px;
  border: 1px solid rgba(214, 170, 99, 0.22);
  border-radius: 8px;
  color: #ffb56e;
  padding: 6px 10px;
  text-decoration: none;
}

.nav-group {
  margin-bottom: 24px;
}

.nav-group h2 {
  margin: 0 0 8px;
  color: var(--ember);
  font-size: 0.72rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

.nav-link {
  display: block;
  border-radius: 8px;
  color: var(--muted);
  padding: 8px 10px;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(233, 107, 44, 0.16);
  color: #ffe0b4;
}

.site-content {
  width: min(100%, 980px);
  padding: 46px clamp(20px, 5vw, 72px) 72px;
}

h1,
h2,
h3 {
  line-height: 1.18;
}

h1 {
  margin: 0 0 20px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.1rem, 5vw, 4rem);
}

h2 {
  margin-top: 42px;
  color: #ffe0b4;
}

p,
li {
  color: #e4d2bb;
  line-height: 1.7;
}

a {
  color: #ffb56e;
}

img {
  max-width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

code {
  border: 1px solid rgba(214, 170, 99, 0.18);
  border-radius: 6px;
  background: rgba(37, 32, 28, 0.9);
  color: #ffe0b4;
  padding: 0.16em 0.34em;
}

pre {
  overflow: auto;
  border: 1px solid rgba(214, 170, 99, 0.18);
  border-radius: 8px;
  background: #100d0b;
  padding: 16px;
}

pre code {
  border: 0;
  background: transparent;
  padding: 0;
}

blockquote {
  margin: 24px 0;
  border-left: 3px solid var(--ember);
  background: rgba(37, 32, 28, 0.58);
  padding: 12px 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid var(--line);
  padding: 10px;
  text-align: left;
  vertical-align: top;
}

@media (max-width: 760px) {
  .site-shell {
    display: block;
  }

  .site-sidebar {
    position: static;
    height: auto;
  }
}
`;

  await fs.mkdir(path.join(outRoot, "assets"), { recursive: true });
  await fs.writeFile(path.join(outRoot, "assets", "site.css"), css, "utf8");
}

async function main() {
  await fs.rm(outRoot, { recursive: true, force: true });
  await fs.mkdir(outRoot, { recursive: true });

  const markdownFiles = (await collectMarkdownFiles(docsRoot)).sort();
  const pages = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      const relative = slash(path.relative(docsRoot, filePath));
      return {
        filePath,
        outputPath: pageOutputPath(filePath),
        relative,
        language: pageLanguage(relative),
        title: titleFromMarkdown(source, path.posix.basename(relative, ".md"))
      };
    })
  );

  await copyStaticDirectory(path.join(docsRoot, "assets"), path.join(outRoot, "assets"));
  await copyStaticDirectory(path.join(docsRoot, "asset"), path.join(outRoot, "asset"));
  await writeSiteCss();

  for (const page of pages) {
    const source = await fs.readFile(page.filePath, "utf8");
    const content = rewriteMarkdownLinks(marked.parse(source), page.filePath);
    await fs.mkdir(path.dirname(page.outputPath), { recursive: true });
    await fs.writeFile(page.outputPath, renderPage({ page, pages, content }), "utf8");
  }

  console.log(`Built ${pages.length} docs pages into ${slash(path.relative(repoRoot, outRoot))}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
