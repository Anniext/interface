# SVG 图形开发规范

## SVG 使用标准

### SVG 应用场景

- 所有矢量图形必须使用 SVG 格式
- 图标、插画、简单动画优先使用 SVG
- 与 CSS 和 JavaScript 结合实现交互效果

### SVG 优化

```xml
<!-- 优化后的 SVG 结构 -->
<svg
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="w-6 h-6"
>
  <path
    d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
    stroke="currentColor"
    stroke-width="2"
  />
</svg>
```

### Vue 组件集成

- 创建可复用的 SVG 图标组件
- 支持动态颜色和尺寸调整
- 提供图标库管理系统

```vue
<template>
  <svg
    :class="sizeClasses"
    :style="{ color: color }"
    viewBox="0 0 24 24"
    fill="none"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "currentColor",
});
</script>
```

### 响应式 SVG

- 使用 `viewBox` 实现响应式缩放
- 为不同屏幕尺寸提供适配版本
- 支持高分辨率显示设备

### SVG 动画

- 使用 CSS 动画处理简单效果
- 结合 GSAP 实现复杂 SVG 动画
- 利用 SVG 的 `<animateTransform>` 元素

### 性能优化

- 移除不必要的元素和属性
- 使用 SVGO 工具优化 SVG 文件
- 合理使用 SVG 精灵图技术

### 无障碍访问

```xml
<svg role="img" aria-labelledby="title desc">
  <title id="title">图标标题</title>
  <desc id="desc">图标详细描述</desc>
  <!-- SVG 内容 -->
</svg>
```

### 样式管理

- 使用 CSS 变量控制 SVG 样式
- 支持深色模式的 SVG 变体
- 与 Tailwind CSS 集成使用

### 文件组织

- SVG 文件存放在 `src/assets/icons/` 目录
- 按功能分类组织图标文件
- 提供图标索引和文档

### 浏览器兼容性

- 确保 SVG 在目标浏览器中正常显示
- 提供 PNG 格式的降级方案
- 测试不同设备上的渲染效果
