# 素材与依赖说明

## 用户提供的素材
- 团队群像：内置 image_gen 生成的五人黑白灰油画，用作艺术化团队入口，不是真实人物照片。
- 孔玲个人肖像、摄影集、观展与机车收藏：来自用户提供的“南京九宫格文化传媒有限公司_资料”，复制到 public/media，保留图像与水印。
- “陳宅 _ 分子設計”：用户确认是公司参与的项目。网站标注公司参与，不宣称独立设计；具体分工待补充。
- 机车收藏属于兴趣素材，观展照片属于个人经历，均不列为公司项目。
- 五格小标志为本项目以简单几何图形绘制的导航图标，并非已确认的公司正式商标。

## 前端组件
React Bits，作者 David Haz。
源仓库：https://github.com/DavidHDev/react-bits
引入 GlareHover 和 TiltedCard 的 TypeScript / CSS 源文件。
源代码及原许可完整保存在 src/components/react-bits，许可为 MIT + Commons Clause License Condition v1.0；本项目将其作为网站的一部分使用。
来源文件：
- https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Animations/GlareHover
- https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/TiltedCard
依赖版本以 package-lock.json 为准。

GSAP 与 ScrollTrigger：通过 npm 安装，版本由 package-lock.json 固定。
https://gsap.com/docs/v3/

## 设计技能
taste-skill / design-taste-frontend，来源 https://github.com/Leonxlnx/taste-skill
已按项目安装到 .tools/skills/taste-skill，不修改全局工具配置。
选用“place-carries-it / The place carries it”，seed 282734382，以已选07展厅方向为依据。
设计核心：这家公司独有的五人黑白灰群像成为五块可走进个人世界的展板。
保留用户明确要求的黑金、空间灯光、展板阴影与边框，审查时对 gradient、shadow、hairline、text-shadow 单独记录例外。
不使用脚本推荐的外部照片，图片全部使用当前项目已有素材。
