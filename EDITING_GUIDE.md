# 热風网站维护指南

网站地址：https://jiangkun-xiong.github.io/hotwind-youth-club/

网站是普通的 HTML 多页面网站。每个页面对应一个 HTML 文件，导航通过文件链接跳转。仓库里已经包含可发布的完整页面；不需要安装插件或框架。

## 1. 最简单的替换照片方法

1. 在 `ASSET_MAP.md` 找到想替换的图片名称。
2. 将新图片处理为 WebP，使用相同的文件名和后缀。
3. 在 GitHub 仓库进入对应 `assets/images/` 子文件夹。
4. 点击 **Add file → Upload files**，上传同名图片并提交。
5. 如果同目录有 `-thumb.webp` 缩略图，也替换同名缩略图；封面和档案卡片会用它。
6. 在 **Actions** 查看 Pages 构建结果，完成后刷新网站。浏览器缓存未更新时可按 Ctrl+F5。

例：替换团队照，就替换 `assets/images/team/team.webp` 与 `team-thumb.webp`。个人主页有自己的精选缩略图，路径是主站仓库的 `assets/images/hotwind-team.webp`；需要同步更换时，也替换那个文件。

图片可以换成 JPG/PNG，但必须在 `assets/js/media.js` 同时修改路径后缀。只修改扩展名不能转换图片格式。

## 2. 修改照片说明或增加照片

打开 `assets/js/media.js`，点击铅笔编辑。每张图片是一条记录。`src` 是完整图，`thumb` 是缩略图，`caption` 是说明，`alt` 是画面描述。

复制一条相似记录，给它一个独一无二的键，例如 `readingNew01`：

```js
readingNew01: {
  src: 'assets/images/reading/new-session.webp',
  thumb: 'assets/images/reading/new-session-thumb.webp',
  width: 1600,
  height: 1067,
  fit: 'cover',
  position: 'center',
  category: 'community',
  group: 'reading',
  gallery: true,
  alt: { en: 'Students discussing a book around a table', zh: '同学们围桌讨论一本书' },
  caption: { en: 'A shared-reading session.', zh: '一次共读交流现场。' }
}
```

先上传实际图片，再填路径。各记录之间需要英文逗号。最后一条后面的逗号可以保留；文字中的英文单引号需要使用不同引号包围，或采用文件中现有的双引号格式。

这一步不需要运行构建命令。脚本会把新图片放到对应案例页和影像档案。

| 字段 | 可以填写什么 | 作用 |
| --- | --- | --- |
| `group` | `reading`, `tb`, `womens`, `peer`, `summer`, `parenting`, `research`, `team`, `story`, `posters`, `evidence` | 放到哪个案例或板块 |
| `category` | `community`, `poster`, `evidence` | 档案中的照片、海报、资料筛选 |
| `gallery` | `true` 或 `false` | 是否出现在全部影像档案 |
| `featured` | `true` | 是否作为该案例封面；同一个 group 只选一张 |
| `fit` | `cover` 或 `contain` | 照片铺满裁切，或完整显示海报 |
| `position` | `center`, `center 40%` 等 | 调整照片显示焦点 |

图片路径不能以 `/` 开头。文件名统一小写英文和连字符；代码与实际文件的大小写必须完全一致。

## 3. 修改一段文字

零基础可以直接编辑对应的 HTML 文件。页面表格见 README。

```html
<p data-en="English text" data-zh="中文内容">English text</p>
```

请同时修改英文、中文和标签中间的默认英文。保留引号与标签。请不要删除公共导航的脚本引用。

如果你以后运行生成脚本，HTML 会根据 `content/site.json`、`content/additional-projects.json` 与 `scripts/build.mjs` 重新生成。直接编辑过的 HTML 不会反向写回这些源文件。需要长期反复生成时，应修改源文件；暂时只改一段 HTML 时无需运行生成脚本。

## 4. 修改颜色、布局和照片比例

打开 `assets/css/styles.css`。最开头的 `:root` 集中控制颜色和尺寸：

```css
--paper: #fffaf0;  /* 页面暖白背景 */
--orange: #f45432; /* 热風橘红 */
--green: #176a4a;  /* 深绿文字和按钮 */
--lime: #dbed86;   /* 浅绿装饰区 */
--max: 1220px;    /* 正文最大宽度 */
--radius: 22px;   /* 卡片圆角 */
--section: 76px;  /* 板块上下间距 */
```

修改网格列数，搜索 `.project-grid` 或 `.gallery-grid`；手机样式在 `@media(max-width:780px)` 中。改布局后同时查看桌面与手机宽度。

所有公共页头、页脚以及自动生成结构在 `scripts/build.mjs`。如果以后学习 Node，可以在仓库根目录运行：

```sh
node scripts/build.mjs
```

不需要 `npm install`。运行后将改动的 HTML 一并提交到 GitHub。

## 5. 使用 GitHub Desktop 更新

1. 在 GitHub Desktop 选择 **File → Clone repository**。
2. 选择 `Jiangkun-Xiong/hotwind-youth-club`，下载到电脑。
3. 点击 **Repository → Show in Explorer** 打开文件夹。
4. 替换图片，或用代码编辑器修改文件。
5. 回到 Desktop，查看 Changes，确认只有自己想改的文件。
6. Summary 填 `Update reading photos` 等简短说明。
7. 点击 **Commit to main**，再点击 **Push origin**。
8. 等 GitHub Pages 更新后检查网页。

## 6. 两个网站如何协同

主站的项目卡片直接指向热風独立网站，旧的 `projects/hotwind.html` 仍然保留简短概览。热風网站的页头与页脚都有返回主站的入口。两站同属 `jiangkun-xiong.github.io`，中英文选择使用同一个浏览器偏好设置。

主站的仓库和网站链接集中在主站 `assets/js/site-config.js`。热風的回链与基本信息在 `content/site.json`，修改后需运行生成脚本。

## 7. 发布与检查

在仓库 **Settings → Pages**，Source 选择 **Deploy from a branch**，Branch 选择 **main**，目录选择 **/(root)**，点击 Save。不要把压缩包当作网站上传；根目录必须直接包含 `index.html`。

检查导航、活动筛选、中英文切换、图片放大，以及返回个人主页。新图片若不能显示，优先检查路径、大小写与文件后缀。

## 8. 素材与事实的维护

保留原始文件与网页优化图的对应关系。新增活动时，分别描述团队完成的工作与你本人承担的职责。调研规划、拟议合作与已完成成果应明确区分。

原始压缩包、研究参考论文、私人聊天截图与未核实的草稿数字无需放进公共仓库。本站当前保留精选的原始活动海报、实际活动照片与项目总览。

新增活动时，请填写中英文 `evidence`（材料依据）、`evidenceNote`（材料说明）和 `actionsHeading`（流程标题）。活动方案不等于完整实施记录；照片不等于效果评估；个人参与不能扩大成独立完成。新增或修改后运行 `node scripts/check.mjs` 和 `node scripts/check-content.mjs`。

`record-notes.html` 集中解释历史通知、医学内容与本地语言偏好存储。所有页面使用本地图片与脚本；请保留 `assets/js/media-rules.js` 的引用。不要为展示旧活动重新启用历史二维码、收款或报名功能。

照片肖像许可、摄影作品与第三方海报素材的使用权，需要由发布者确认。存档展示不等于获得了面向所有访客的再次使用许可。详见 `CONTENT_REVIEW.md`。
