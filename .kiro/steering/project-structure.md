# 项目结构规范

## 目录组织

### 源码结构

```
src/
├── components/          # 可复用组件
│   ├── common/         # 通用组件
│   └── business/       # 业务组件
├── views/              # 页面组件
├── composables/        # 组合式函数
├── utils/              # 工具函数
├── types/              # 类型定义
├── stores/             # 状态管理
├── api/                # API 接口
├── assets/             # 静态资源
│   ├── images/         # 图片资源
│   ├── icons/          # 图标资源
│   └── styles/         # 样式文件
└── router/             # 路由配置
```

### 文件命名规范

- 组件文件：PascalCase.vue
- 工具文件：kebab-case.ts
- 类型文件：kebab-case.types.ts
- 样式文件：kebab-case.css/scss

### 导入路径

- 使用绝对路径导入（@/ 别名）
- 避免深层相对路径导入
- 按功能模块组织导入
