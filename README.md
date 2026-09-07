# 鹦鹉饲养指南 · 新手图解版

面向零基础读者，重点覆盖虎皮与小太阳（绿颊锥尾），提供手机阅读、搜索、日常清单与完整离线 HTML。

## 单一内容源

- `handbook/content.mjs`：16 个章节、步骤说明与清单。
- `handbook/guide.css`：浅色 / 深色、手机与打印样式。
- `handbook/guide.js`：搜索、导航、本地清单、主题、打印与离线下载。
- `handbook/assets/`：两张已核对的 CC0 实拍图。
- `scripts/build-guide.mjs`：将以上内容与图像嵌入 HTML，同步生成三个内容相同的文件。

不要直接修改生成后的 `docs/index.html`、`public/鹦鹉饲养指南.html` 或根目录 `鹦鹉饲养指南.html`；改源文件后重新生成，避免副本不一致。

## 本地命令

```sh
npm run guide:build
npm run guide:test
npm run dev
npm test
```

保留原项目依赖与 pnpm 锁文件，不需要新增前端依赖。`npm run build` 会先生成手册，再执行原 Vinext 构建。

## 发布与离线

- GitHub Pages 使用 `main` 分支的 `docs/index.html`，推送后由 GitHub Pages 构建发布。
- 应用预览通过 `app/page.tsx` 嵌入 `public/鹦鹉饲养指南.html`。
- 根目录 HTML 本身就是完整离线版，包含图片、CSS 与 JavaScript。支持脚本的本地浏览器可使用搜索、主题与临时 / 持久清单。
- 微信内可能不允许直接下载或运行本地 HTML；请使用系统浏览器或电脑下载。单纯收藏网页不等于保存离线内容。
- 清单按本机日期和周一起始日分组，仅保存在当前浏览器，不上传、不跨设备同步。重要健康记录请单独保存。

## 内容与测试边界

内容核对与图像许可见 `handbook/EDITORIAL.md`。本手册不是兽医诊断或处方。真实手机微信仍需用户在设备上验收；桌面浏览器窄屏模拟不能替代真机证明。
