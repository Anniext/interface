# Canvas 图形开发规范

## Canvas 使用标准

### Canvas 应用场景

- 复杂图形渲染和数据可视化使用 Canvas
- 游戏开发、图像处理、实时动画优先使用 Canvas
- 与物理引擎（Matter.js）结合使用

### Canvas 初始化

```typescript
// Canvas 配置和初始化
interface CanvasConfig {
    width: number;
    height: number;
    pixelRatio: number;
    alpha: boolean;
}

const initCanvas = (element: HTMLCanvasElement, config: CanvasConfig) => {
    const ctx = element.getContext("2d", { alpha: config.alpha });

    // 高分辨率适配
    element.width = config.width * config.pixelRatio;
    element.height = config.height * config.pixelRatio;
    element.style.width = `${config.width}px`;
    element.style.height = `${config.height}px`;

    ctx.scale(config.pixelRatio, config.pixelRatio);

    return ctx;
};
```

### 性能优化

- 使用 `requestAnimationFrame` 控制动画帧率
- 实现脏矩形更新减少重绘区域
- 使用离屏 Canvas 进行复杂计算

```typescript
// 性能优化示例
class CanvasRenderer {
    private offscreenCanvas: HTMLCanvasElement;
    private offscreenCtx: CanvasRenderingContext2D;

    constructor() {
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCtx = this.offscreenCanvas.getContext("2d")!;
    }

    render() {
        // 在离屏 Canvas 上绘制
        this.offscreenCtx.clearRect(
            0,
            0,
            this.offscreenCanvas.width,
            this.offscreenCanvas.height,
        );
        // ... 绘制逻辑

        // 将结果复制到主 Canvas
        this.mainCtx.drawImage(this.offscreenCanvas, 0, 0);
    }
}
```

### Vue 组件集成

- 创建可复用的 Canvas 组件
- 支持响应式尺寸调整
- 提供绘制生命周期钩子

```vue
<template>
    <canvas
        ref="canvasRef"
        :width="width * pixelRatio"
        :height="height * pixelRatio"
        :style="{ width: `${width}px`, height: `${height}px` }"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" />
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D>();

onMounted(() => {
    ctx.value = canvasRef.value?.getContext("2d");
    initCanvas();
});
</script>
```

### 交互处理

- 实现鼠标和触摸事件处理
- 提供坐标转换工具函数
- 支持多点触控和手势识别

### 图形绘制抽象

```typescript
// 图形绘制类抽象
abstract class Shape {
    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract isPointInside(x: number, y: number): boolean;
}

class Circle extends Shape {
    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: string,
    ) {
        super();
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
```

### 动画管理

- 使用时间戳计算动画进度
- 实现缓动函数库
- 提供动画暂停和恢复功能

### 内存管理

- 及时清理不需要的图像数据
- 避免内存泄漏和性能问题
- 合理使用 Canvas 缓存策略

### 响应式适配

- 根据屏幕尺寸调整 Canvas 大小
- 为移动端优化触摸交互
- 支持设备方向变化

### 调试工具

- 提供绘制信息的可视化
- 实现性能监控和分析
- 创建调试模式开关

### 无障碍访问

- 为 Canvas 内容提供替代文本
- 实现键盘导航支持
- 确保颜色对比度符合标准
