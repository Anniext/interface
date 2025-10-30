# Lottie 矢量动画规范

## 矢量动画标准

### Lottie 使用场景

- 所有矢量动画必须使用 Lottie 进行实现
- 适用于图标动画、插画动画、微交互动画
- 优先使用 Lottie 而非 GIF 或视频格式

### 动画资源管理

- 动画文件存放在 `src/assets/animations/` 目录
- 文件命名使用 kebab-case 格式
- 提供不同尺寸的动画版本以适配不同设备

### 性能优化

```typescript
// 懒加载动画资源
const loadAnimation = async (animationName: string) => {
  const animationData = await import(
    `@/assets/animations/${animationName}.json`
  );
  return animationData.default;
};

// 控制动画质量和性能
const animationConfig = {
  renderer: "svg", // 优先使用 SVG 渲染
  loop: false,
  autoplay: false,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
```

### Vue 组件集成

- 创建可复用的 LottieAnimation 组件
- 支持动画控制（播放、暂停、重置）
- 提供动画事件回调接口

### 动画状态管理

- 使用 Pinia 管理全局动画状态
- 提供动画预加载机制
- 实现动画缓存策略

### 响应式适配

- 根据屏幕尺寸调整动画大小
- 为移动端提供简化版本动画
- 支持深色模式的动画变体

### 无障碍访问

- 提供动画描述文本
- 支持减少动画选项
- 确保动画不影响屏幕阅读器

### 动画优化建议

- 控制动画文件大小（建议小于 100KB）
- 使用适当的帧率（通常 24-30fps）
- 避免过于复杂的路径和效果
- 测试不同设备上的动画性能
