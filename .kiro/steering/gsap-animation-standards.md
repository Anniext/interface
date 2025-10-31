# GSAP 动画开发规范

## 动画引擎标准

### GSAP 使用原则

- 所有 JavaScript 动画必须使用 GSAP 作为主要动画引擎
- 优先使用 GSAP 而非原生 CSS 动画处理复杂交互
- 利用 GSAP 的时间轴功能管理复杂动画序列

### 动画性能优化

- 使用 `will-change` 属性优化动画性能
- 优先动画 transform 和 opacity 属性
- 避免动画会引起重排的属性（width、height、margin 等）
- 使用 `force3D: true` 启用硬件加速

### 动画组织结构

```typescript
// 动画配置集中管理
const animationConfig = {
    duration: 0.3,
    ease: "power2.out",
    stagger: 0.1,
};

// 使用时间轴管理复杂动画
const tl = gsap.timeline();
tl.to(element, { x: 100, duration: 0.5 }).to(
    element,
    { y: 50, duration: 0.3 },
    "-=0.2",
);
```

### 响应式动画

- 使用 GSAP 的 `matchMedia` 处理不同屏幕尺寸的动画
- 为移动端优化动画性能和体验
- 提供动画禁用选项以支持无障碍访问

### 动画生命周期管理

- 在 Vue 组件卸载时清理动画实例
- 使用 `onBeforeUnmount` 钩子清理动画
- 避免内存泄漏和性能问题

### 常用动画模式

- 页面转场：使用 GSAP 配合 Vue Router
- 滚动触发：结合 ScrollTrigger 插件
- 悬停效果：使用 GSAP 的 hover 动画
- 加载动画：创建可复用的加载动画组件

### 动画调试

- 使用 GSAP DevTools 进行动画调试
- 在开发环境中启用动画可视化
- 提供动画速度控制选项
