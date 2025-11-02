# 711Club官网 - 东南大学软件学院生涯交流群

一个温暖专业的软件学院交流社区官网，支持动态内容管理，便于维护更新。

## 🌟 项目特色

### 核心功能
- **8个完整页面**：首页、关于我们、交流社区、经验分享、生涯规划、活动中心、加入我们、成员专区
- **动态内容系统**：真正的Markdown文件读取和管理
- **响应式设计**：桌面3-4列，平板2列，移动单列完美适配
- **毛玻璃效果**：活动中心和交流社区的科技感界面
- **内容索引自动生成**：构建时自动扫描和索引所有Markdown文件

### 技术栈
- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 6.0
- **样式系统**：TailwindCSS + 自定义设计Tokens
- **路由管理**：React Router v6
- **Markdown渲染**：react-markdown + gray-matter
- **图标库**：Lucide React

### 设计系统
- **色彩方案**：深绿色主调（#2C6B4F）+ 橙红强调色（#F37A3A→#E53935）
- **设计风格**：90%专业极简 + 10%科技感毛玻璃
- **组件规范**：完全基于设计Tokens的一致性系统

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
cd 711club-website
pnpm install
```

### 开发模式
```bash
pnpm run dev
```

### 构建部署
```bash
# 生成内容索引并构建
pnpm run build

# 仅生成内容索引
pnpm run build:content
```

## 📁 项目结构

```
711club-website/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Navbar.tsx      # 导航栏
│   │   ├── Footer.tsx      # 页脚
│   │   └── MarkdownRenderer.tsx  # Markdown渲染器
│   ├── hooks/              # 自定义Hooks
│   │   └── useContent.ts   # 内容管理Hook
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── About.tsx       # 关于我们
│   │   ├── Community.tsx   # 交流社区
│   │   ├── Experiences.tsx # 经验分享
│   │   ├── Career.tsx      # 生涯规划
│   │   ├── Activities.tsx  # 活动中心
│   │   ├── Join.tsx        # 加入我们
│   │   └── Member.tsx      # 成员专区
│   └── App.tsx             # 应用入口
├── public/
│   ├── content/            # 动态内容文件夹
│   │   ├── announcements/  # 活动公告
│   │   ├── experiences/    # 经验分享
│   │   │   ├── 保研/
│   │   │   ├── 就业/
│   │   │   ├── 留学/
│   │   │   ├── 实习/
│   │   │   ├── 考研/
│   │   │   └── 技术栈/
│   │   └── index.json      # 内容索引（自动生成）
│   └── 711club-logo.jpg    # 网站Logo
├── scripts/
│   └── generate-content-index.js  # 内容索引生成脚本
├── CONTENT_MANAGEMENT.md   # 内容管理指南
└── README.md               # 项目说明
```

## 📝 内容管理

### 添加新内容

#### 活动公告
1. 在 `public/content/experiences/announcements/` 创建 `.md` 文件
2. 按照Front Matter格式填写元数据
3. 编写Markdown正文内容
4. 重新构建网站

```yaml
---
title: "公告标题"
date: "2024-11-15"
type: "线下聚会"
location: "活动地点"
time: "活动时间"
participants: "参与对象"
excerpt: "公告摘要"
---
```

#### 经验分享
1. 在 `public/content/experiences/[分类]/` 创建 `.md` 文件
2. 按照Front Matter格式填写元数据
3. 编写Markdown正文内容
4. 重新构建网站

```yaml
---
title: "文章标题"
author: "作者姓名"
year: "2024届"
date: "2024-10-15"
tags: ["标签1", "标签2"]
category: "保研"
excerpt: "文章摘要"
---
```

### 支持的分类
- **保研**：保研经验分享
- **就业**：就业求职经验
- **留学**：留学申请经验
- **实习**：实习经历分享
- **考研**：考研复习经验
- **技术栈**：技术学习分享

详细说明请参考 [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)

## 🎨 设计系统

### 色彩Tokens
```css
/* 主色调 */
--primary-500: #2C6B4F;  /* 深绿色 */
--primary-600: #235740;
--primary-900: #1A3D2E;

/* 强调色 */
--accent-orange: #F37A3A;  /* 橙红色 */
--accent-red: #E53935;
--accent-dark: #C62828;

/* 中性色 */
--neutral-50: #FAFAFA;
--neutral-500: #A3A3A3;
--neutral-900: #171717;
```

### 字体系统
- **主字体**：Inter, PingFang SC, Microsoft YaHei
- **代码字体**：Fira Code, Consolas
- **字体大小**：hero(64px) → h1(48px) → h2(32px) → h3(24px) → body(16px)

### 间距系统
基于8点网格：8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

## 🔧 自定义配置

### TailwindCSS配置
项目使用自定义的TailwindCSS配置，包含：
- 自定义颜色系统
- 字体大小和权重
- 间距和圆角
- 阴影效果
- 毛玻璃效果

### Vite配置
- 路径别名配置（@ 指向 src/）
- TypeScript支持
- 热更新开发服务器

## 📱 响应式设计

### 断点系统
- **xs**: <640px (手机竖屏)
- **sm**: 640-767px (手机横屏)
- **md**: 768-1023px (平板)
- **lg**: 1024-1279px (小桌面)
- **xl**: 1280px+ (桌面)

### 布局适配
- **桌面**: 3-4列网格，最大宽度1200-1400px
- **平板**: 2列网格，卡片内边距32px
- **移动**: 单列布局，间距减少30%


## 📊 性能优化

### 已实现的优化
- **代码分割**：按路由分割代码
- **图片优化**：Logo和其他图片优化
- **CSS优化**：TailwindCSS的purge功能
- **构建优化**：Vite的现代化构建流程

### 建议的进一步优化
- **图片懒加载**：为大量图片添加懒加载
- **CDN加速**：静态资源使用CDN
- **缓存策略**：配置适当的缓存头

## 🛠 开发指南

### 添加新页面
1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/Navbar.tsx` 添加导航链接

### 自定义组件
1. 在 `src/components/` 创建组件
2. 使用设计Tokens保持一致性
3. 支持响应式设计

### 样式开发
1. 优先使用TailwindCSS类
2. 自定义样式放在组件内
3. 全局样式使用CSS变量

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系我们

- **项目地址**：[GitHub Repository]
- **在线演示**：[https://seu-711-seclub.github.io/](https://seu-711-seclub.github.io/)
- **邮箱**：liumengxuan@xuantianit.cn

---

**最后更新**：2025-11-02  
**版本**：v1.0.0  
**作者**：LiuMengxuan
