# 鹦鹉饲养指南 · 新手图解版

面向零基础读者，重点覆盖虎皮与小太阳（绿颊锥尾），提供手机阅读、搜索、日常清单与完整离线 HTML。

## 单一内容源

- `handbook/content.mjs`：16 个章节、步骤说明与清单。
- `handbook/guide.css`：浅色 / 深色、手机与打印样式。
- `handbook/guide.js`：搜索、导航、本地清单、主题、打印与离线下载。
- `handbook/practical.mjs`：物种阅读路线、用品验收、进食观察与操作图。
- `handbook/assets/`：两张已核对的 CC0 实拍图，以及一张明确标注的 AI 创作头图。全部内嵌，离线不依赖图片服务器。
- `scripts/build-guide.mjs`：将以上内容与图像嵌入 HTML，同步生成三个内容相同的文件。

不要直接修改生成后的 `docs/index.html`、`public/鹦鹉饲养指南.html` 或根目录 `鹦鹉饲养指南.html`；改源文件后重新生成，避免副本不一致。

## 本地命令

```sh
npm run guide:build
npm run guide:test
npm run dev
npm test              # 生成手册 + 结构检查 + Chromium 交互回归
npm run guide:release # 上述检查 + 生成完整 PDF 和版本校验清单
node scripts/check-release.mjs
npm run app:test      # 可选：原应用外壳单独构建与验证
```

使用 pnpm 锁文件安装：`pnpm install --frozen-lockfile --ignore-scripts`。初次运行浏览器检查前执行 `pnpm exec playwright install chromium`；Linux 可加 `--with-deps` 并安装 `fonts-noto-cjk`。

`npm run build` 只生成静态手册；`npm run app:build` 才构建原 Vinext 外壳。Playwright 与 Prettier 仅为开发工具，不加载到读者页面。源码可用 `pnpm exec prettier --write handbook/guide.css` 格式化。

## 发布与离线

- GitHub Pages 使用 `main` 分支的 `docs/index.html`，推送后由 GitHub Pages 构建发布。
- 应用预览通过 `app/page.tsx` 嵌入 `public/鹦鹉饲养指南.html`。
- 根目录 HTML 本身就是完整离线版，包含图片、CSS 与 JavaScript。支持脚本的本地浏览器可使用搜索、主题与临时 / 持久清单。
- 手机禁用脚本时提供原生完整目录，隐藏无法工作的按钮；页面上的 PDF 链接无需脚本。
- `docs/parrot-care-handbook.pdf` 为预生成完整 PDF；`output/pdf/鹦鹉饲养指南.pdf` 为本地交付副本，`public/` 保留应用预览副本。
- PDF 由手册 HTML 生成，包含完整展开内容。`docs/release.json` 记录内容版本和 HTML/PDF 校验值；正文内容修改后需重新执行 `guide:release`。
- 2026-09-28 为 HTML 单独进行纸质手册风格的视觉更新：宋体标题、圆形头图区、概览与阅读入口。现有双鸟插画继续使用；新单鸟插画因生成额度限制尚未替换。用户要求暂停 PDF 工作，因此正式 PDF 与绘本样张均保持原样；清单中的 `pdfSourceHtmlSha256` 明确记录 PDF 所依据的旧版 HTML，`htmlPresentationVersion` 仅代表网页视觉版本，不表示 PDF 同步改版。
- `.github/workflows/verify.yml` 在提交和 PR 时运行静态、交互与产物一致性检查。当前 Pages 仍使用分支 `/docs` 发布，这个检查不是分支保护或发布审批门禁。
- 微信内可能不允许直接下载或运行本地 HTML；请使用系统浏览器或电脑下载。单纯收藏网页不等于保存离线内容。
- 清单按本机日期和周一起始日分组，仅保存在当前浏览器，不上传、不跨设备同步。重要健康记录请单独保存。

## 内容与测试边界

内容核对与图像许可见 `handbook/EDITORIAL.md`。本手册不是兽医诊断或处方。真实手机微信仍需用户在设备上验收；桌面浏览器窄屏模拟不能替代真机证明。

逐项证据与未覆盖内容见 `handbook/EVIDENCE.md`。该内部表不在读者页面恢复原书摘录，也不声称内容已全部获得兽医签署审校。
