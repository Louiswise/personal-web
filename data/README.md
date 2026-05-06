# 网站信息库

这个目录是个人网站的数据来源。网站通过 `script.js` 读取 `data/site.json`，再自动渲染首页和经历页。

## 常用修改位置

- `data/site.json`: 网站当前直接调用的主数据文件。
- `data/profile/basic.json`: 基础身份信息备份。
- `data/profile/accounts.json`: 公开联系方式和账号链接。
- `data/profile/skills.json`: 能力分类。
- `data/profile/introduction.md`: 长版个人介绍。
- `data/projects/*.json`: 每个项目一份结构化资料。
- `data/site.json` 里的 `resumeCards`: 公开版履历卡片，适合展示给访客，也适合以后接后台编辑。

## 资源文件

- 简历 PDF 放到 `assets/resumes/resume.pdf`。如果你的文件名不是 `resume.pdf`，要同步修改 `data/site.json` 里的 `profile.resumeUrl`。
- 头像放到 `assets/images/avatar.png`。
- 项目图片放到 `assets/project-images/`。

## 项目卡片字段

`data/site.json` 里的 `projects` 会渲染成网站项目卡片。推荐每个项目都保留这些字段：

- `name`: 项目名称。
- `category`: 项目类型，例如 `AI 自动化 / 酒店服务`。
- `status`: 当前状态，例如 `搭建中`、`持续更新`。
- `summary`: 一句话说明。
- `problem`: 解决的问题。
- `solution`: 你的做法，数组格式。
- `skills`: 能力标签，数组格式。
- `result`: 展示结果，数组格式。

## 公开履历卡片字段

`resumeCards` 用来替代直接展示完整简历。这里只放可以公开的信息，不放手机号、学校名称、证件信息、住址、客户隐私或后台账号。

- `title`: 卡片标题，例如 `个人定位`。
- `subtitle`: 简短分类或说明。
- `summary`: 对外展示的一段经历摘要。
- `highlights`: 标签数组，用来展示能力关键词。
- `privacyNote`: 这张卡片隐藏了哪些隐私信息，方便以后编辑时提醒自己。

## 隐私规则

不要把密码、登录账号、身份证、手机号、API Key、Vercel Token 或 OpenAI Key 放进这个目录。敏感信息放在 `.env.local`，并保持 `.gitignore` 里的忽略规则。
