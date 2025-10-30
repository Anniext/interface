# 交互式游戏风格简历网站

为徐思宏创建的符合 awwwards 审美标准的交互式游戏风格简历网站。

## 技术栈

- **前端框架**: Vue 3 + TypeScript + Composition API
- **构建工具**: Vite + Rolldown
- **样式框架**: Tailwind CSS V4
- **状态管理**: Pinia
- **2D 渲染**: HTML5 Canvas
- **物理引擎**: Matter.js
- **动画库**: GSAP + ScrollTrigger
- **矢量动画**: Lottie
- **图标系统**: SVG

## 项目结构

```
src/
├── components/          # 组件
│   ├── common/         # 通用组件
│   ├── business/       # 业务组件
│   ├── canvas/         # Canvas 组件
│   ├── physics/        # 物理引擎组件
│   └── animation/      # 动画组件
├── views/              # 页面组件
├── composables/        # 组合式函数
├── utils/              # 工具函数
├── types/              # 类型定义
├── stores/             # 状态管理
├── api/                # API 接口
├── assets/             # 静态资源
│   ├── images/         # 图片资源
│   ├── icons/          # 图标资源
│   ├── styles/         # 样式文件
│   └── animations/     # 动画资源
└── router/             # 路由配置
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check
```

## 功能特性

- 🎮 游戏风格的交互式界面
- 🎨 Canvas 2D 渲染和粒子系统
- ⚡ Matter.js 物理引擎集成
- 🎬 GSAP 高性能动画
- 📱 响应式设计和移动端优化
- ♿ 无障碍访问支持
- 🌙 深色/浅色主题切换
- 🚀 性能优化和懒加载

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 开发规范

项目遵循以下开发规范：

- Vue 3 Composition API 最佳实践
- TypeScript 严格模式
- Tailwind CSS 工具类优先
- 中文注释和文档
- 无障碍访问标准

## 许可证

MIT License
