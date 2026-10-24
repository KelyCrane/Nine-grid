# 南京九宫格文化传媒有限公司 · 五个人的创意展厅

React + TypeScript + Vite 静态网站，采用07展厅方向。群像是五块独立人物展板，上二下三，右上为孔玲。原来的选图页保留在 preview.html。

## 启动与构建（D盘）
已有依赖：
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev.ps1
```
打开终端显示的本地地址。首次安装在本项目目录运行：
```powershell
$env:TEMP = 'D:\workspace\Projects\Nine-grid\.storage\tmp'
$env:TMP = $env:TEMP
$env:npm_config_cache = 'D:\workspace\Projects\Nine-grid\.storage\cache\npm'
$env:npm_config_update_notifier = 'false'
npm.cmd ci --no-fund --no-audit
npm.cmd run build
```
构建产物为 dist/，静态托管时仅发布该目录。不要上传 node_modules、.storage、.tools 或原始资料目录。

## 现在可以体验
- 五格油画按同一张原图定位拼合，鼠标悬停或键盘聚焦会抬升，并显示个人信息。
- 右上“孔玲”进入个人主页；其余四格进入明确的资料待完善页。
- 孔玲主页展示肖像、参与项目、摄影相册、观展记录、机车兴趣收藏。
- 相册可分类、缩略图浏览、单张放大、方向键切图、手机左右滑动、Escape关闭。
- 使用 hash 地址，个人主页和相册可直接访问或刷新，适配GitHub项目子目录。
- 手机保留上二下三，显示简短人物标签。减少动态效果时关闭抬升、视差和光带，保留信息。
- 公司作品仅列已确认参与的“陳宅”。其余业务介绍不填假项目。
- 私人生日、QQ和不确定的学历没有写入网页。

## 内容维护
- src/data.ts：五个成员位置与入口、当前个人页、路由和项目数据入口。右上人物 id 为 kong-ling。
- src/albums.json：97张用户提供图片的相册目录。
- public/media/：用于网站的复制素材，原始资料未修改。
- 当前只有孔玲的完整个人主页。新增其他成员时需同时补充成员数据和对应个人页内容；不要仅把 available 改成 true。
- 项目图当前分辨率约375×200，适合本轮原型展示；后续可替换对应素材为更大原图，不改变页面结构。
- 网站联系区暂显示联系方式整理中。
- 本轮选图记录、提示词及原图继续保留在根目录与 previews/，不是运行时资源。
- CREDITS.md 与 src/components/react-bits/LICENSE.md 保留素材和组件来源。

## GitHub Pages
已准备 .github/workflows/pages.yml，默认仅手动触发，不会自动发布。
上传源码到独立GitHub仓库后，在 Settings → Pages 选择 GitHub Actions，再手动运行 Build static website。
base 为 ./，个人页使用 hash，不需要服务器重写规则，也不会占用现有个人博客仓库。
本轮未创建远程仓库、未推送、未公开发布。

## 检查与存储
npm run build 执行类型检查与生产构建。
scripts/browser-qa.mjs 为本机交互验收脚本，复用原先个人博客中已安装的 Playwright 与现有 Chrome；换电脑需先配置相应路径。
本机生产子目录服务：node scripts/serve-production.mjs，地址 http://127.0.0.1:4173/Nine-grid/。
浏览器资料目录、npm缓存、Vite缓存、截图和检查报告均位于本项目 .storage/。
设计技能位于 .tools/skills/taste-skill；设计记录位于 .taste-skill/。
本轮QA与生产文件大小以 .storage/qa/implementation-report.json 为准。

正式发布目标已按用户确认固定为 https://kelycrane.github.io/Nine-grid/ ，对应独立仓库 KelyCrane/Nine-grid。当前仍为本地版本，尚未推送发布。
