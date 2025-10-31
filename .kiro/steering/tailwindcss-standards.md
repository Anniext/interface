# Tailwind CSS 样式规范

## CSS 框架标准

### Tailwind CSS 使用原则

- 所有样式必须优先使用 Tailwind CSS 工具类
- 避免编写自定义 CSS，除非 Tailwind 无法满足需求
- 使用 Tailwind 的设计系统保持一致性
- Tailwind 必须使用 v4 的语法和框架

### 类名组织

```vue
<!-- 按功能分组排列类名 -->
<div
    class="
  <!-- 布局 -->
  flex items-center justify-between
  <!-- 尺寸 -->
  w-full h-16 px-4
  <!-- 外观 -->
  bg-white border-b border-gray-200
  <!-- 响应式 -->
  md:px-6 lg:px-8
"></div>
```

### 响应式设计

- 移动端优先的响应式设计
- 使用语义化的断点：`sm:` `md:` `lg:` `xl:` `2xl:`
- 合理使用容器查询和响应式工具类

### 自定义配置

```javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    500: "#3b82f6",
                    900: "#1e3a8a",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
};
```

### 组件样式抽象

- 使用 `@apply` 指令创建组件样式
- 在 Vue 组件中使用 CSS 模块化
- 创建可复用的样式组合

### 深色模式支持

```vue
<template>
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <!-- 内容 -->
    </div>
</template>
```

### 性能优化

- 启用 JIT 模式提高构建性能
- 使用 PurgeCSS 移除未使用的样式
- 合理配置 content 路径

### 动画和过渡

- 使用 Tailwind 的动画工具类
- 结合 GSAP 处理复杂动画
- 提供动画禁用选项

### 无障碍访问

- 使用语义化的颜色类名
- 确保足够的颜色对比度
- 提供焦点状态样式

### 代码组织

- 按组件功能组织样式文件
- 使用 CSS 变量管理主题
- 创建样式指南和设计系统文档

### 最佳实践

- 避免使用任意值，优先扩展配置
- 保持类名的可读性和维护性
- 使用 Tailwind 的设计约束提高一致性
