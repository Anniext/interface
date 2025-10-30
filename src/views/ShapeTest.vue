<template>
    <div class="shape-test-page min-h-screen bg-gray-900 text-white p-4">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">
                几何图形渲染系统测试
            </h1>

            <!-- 控制面板 -->
            <div class="mb-6 p-4 bg-gray-800 rounded-lg">
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <button
                        @click="toggleAnimation"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                        {{ isAnimating ? "暂停动画" : "开始动画" }}
                    </button>

                    <button
                        @click="clearShapes"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                        清空图形
                    </button>

                    <button
                        @click="toggleCollision"
                        class="px-4 py-2 rounded transition-colors"
                        :class="
                            enableCollision
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-600 hover:bg-gray-700'
                        ">
                        {{ enableCollision ? "碰撞开启" : "碰撞关闭" }}
                    </button>

                    <button
                        @click="deleteSelected"
                        class="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded transition-colors">
                        删除选中
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >创建图形</label
                        >
                        <select
                            v-model="selectedShapeType"
                            class="w-full px-2 py-1 bg-gray-700 rounded">
                            <option value="circle">圆形</option>
                            <option value="rectangle">矩形</option>
                            <option value="triangle">三角形</option>
                            <option value="pentagon">五边形</option>
                            <option value="star">五角星</option>
                            <option value="arrow">箭头</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >图形大小: {{ shapeSize }}</label
                        >
                        <input
                            v-model.number="shapeSize"
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >动画速度: {{ animationSpeed }}</label
                        >
                        <input
                            v-model.number="animationSpeed"
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Canvas 容器 -->
            <div
                class="canvas-container bg-black rounded-lg overflow-hidden"
                style="height: 600px">
                <CanvasEngine
                    ref="canvasEngineRef"
                    :config="canvasConfig"
                    :show-stats="true"
                    :enable-interaction="true"
                    container-class="w-full h-full"
                    @canvas-ready="onCanvasReady"
                    @canvas-event="onCanvasEvent"
                    @render-frame="onRenderFrame" />
            </div>

            <!-- 图形统计 -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        总图形数
                    </h4>
                    <div class="text-2xl font-bold text-green-400">
                        {{ shapeStats.totalShapes }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        可见图形
                    </h4>
                    <div class="text-2xl font-bold text-blue-400">
                        {{ shapeStats.visibleShapes }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        碰撞检测
                    </h4>
                    <div class="text-2xl font-bold text-purple-400">
                        {{ shapeStats.collisionChecks }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        渲染时间
                    </h4>
                    <div class="text-2xl font-bold text-orange-400">
                        {{ shapeStats.renderTime.toFixed(2) }}ms
                    </div>
                </div>
            </div>

            <!-- 预设图形 -->
            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">预设图形</h3>
                <div class="flex flex-wrap gap-2">
                    <button
                        @click="createRandomShapes"
                        class="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors">
                        随机图形
                    </button>
                    <button
                        @click="createGeometricPattern"
                        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                        几何图案
                    </button>
                    <button
                        @click="createSpiral"
                        class="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors">
                        螺旋图案
                    </button>
                    <button
                        @click="createMandala"
                        class="px-3 py-2 bg-pink-600 hover:bg-pink-700 rounded text-sm transition-colors">
                        曼陀罗图案
                    </button>
                </div>
            </div>

            <!-- 操作说明 -->
            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">操作说明</h3>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                        <h4 class="font-semibold text-white mb-2">鼠标操作</h4>
                        <ul class="space-y-1">
                            <li>• 点击空白处：创建新图形</li>
                            <li>• 点击图形：选中/取消选中</li>
                            <li>• 拖拽：移动选中的图形</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white mb-2">图形特性</h4>
                        <ul class="space-y-1">
                            <li>• 支持旋转和缩放动画</li>
                            <li>• 碰撞检测和物理反弹</li>
                            <li>• 边界约束和选择框</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import CanvasEngine from "@/components/canvas/CanvasEngine.vue";
import { ShapeManager, Polygon } from "@/utils/canvas/index";
import type { ICanvasConfig, ICanvasEvent } from "@/types";

// 响应式数据
const canvasEngineRef = ref<InstanceType<typeof CanvasEngine>>();
const isAnimating = ref(true);
const enableCollision = ref(false);
const selectedShapeType = ref("circle");
const shapeSize = ref(30);
const animationSpeed = ref(1);

// Canvas 配置
const canvasConfig = reactive<Partial<ICanvasConfig>>({
    width: 800,
    height: 600,
    pixelRatio: window.devicePixelRatio,
    alpha: true,
    backgroundColor: "#000000",
});

// 图形管理器
let shapeManager: ShapeManager | null = null;
let draggedShape: any = null;
let dragOffset = { x: 0, y: 0 };

// 图形统计
const shapeStats = ref({
    totalShapes: 0,
    visibleShapes: 0,
    collisionChecks: 0,
    renderTime: 0,
});

// 颜色数组
const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff6348",
];

// Canvas 就绪回调
const onCanvasReady = (_ctx: CanvasRenderingContext2D) => {
    initShapeManager();
};

// 初始化图形管理器
const initShapeManager = () => {
    shapeManager = new ShapeManager({
        maxShapes: 200,
        enableCollision: enableCollision.value,
        enableBounds: true,
        bounds: { width: canvasConfig.width!, height: canvasConfig.height! },
    });

    // 创建一些初始图形
    createInitialShapes();
};

// 创建初始图形
const createInitialShapes = () => {
    if (!shapeManager) return;

    // 创建几个示例图形
    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;

    // 圆形
    shapeManager.createCircle({
        position: { x: centerX - 100, y: centerY - 100 },
        radius: 30,
        color: "#ff6b6b",
        strokeColor: "#ffffff",
        strokeWidth: 2,
    });

    // 矩形
    shapeManager.createRectangle({
        position: { x: centerX + 100, y: centerY - 100 },
        size: { width: 60, height: 40 },
        color: "#4ecdc4",
        strokeColor: "#ffffff",
        strokeWidth: 2,
        borderRadius: 10,
    });

    // 三角形
    shapeManager.createRegularPolygon({
        position: { x: centerX - 100, y: centerY + 100 },
        sides: 3,
        radius: 35,
        color: "#45b7d1",
        strokeColor: "#ffffff",
        strokeWidth: 2,
    });

    // 五角星
    shapeManager.createStar({
        position: { x: centerX + 100, y: centerY + 100 },
        outerRadius: 35,
        innerRadius: 15,
        color: "#feca57",
        strokeColor: "#ffffff",
        strokeWidth: 2,
    });
};

// Canvas 事件回调
const onCanvasEvent = (event: ICanvasEvent) => {
    if (!shapeManager) return;

    const { type, canvasPosition } = event;

    if (type === "click") {
        handleClick(canvasPosition.x, canvasPosition.y);
    } else if (type === "mousedown") {
        handleMouseDown(canvasPosition.x, canvasPosition.y);
    } else if (type === "mousemove") {
        handleMouseMove(canvasPosition.x, canvasPosition.y);
    } else if (type === "mouseup") {
        handleMouseUp();
    }
};

// 处理点击事件
const handleClick = (x: number, y: number) => {
    if (!shapeManager) return;

    const clickedShape = shapeManager.getShapeAtPosition(x, y);

    if (clickedShape) {
        // 切换选中状态
        shapeManager.toggleShapeSelection(clickedShape.id);
    } else {
        // 在空白处创建新图形
        createShapeAt(x, y);
    }
};

// 处理鼠标按下事件
const handleMouseDown = (x: number, y: number) => {
    if (!shapeManager) return;

    const clickedShape = shapeManager.getShapeAtPosition(x, y);

    if (clickedShape) {
        draggedShape = clickedShape;
        dragOffset.x = x - clickedShape.position.x;
        dragOffset.y = y - clickedShape.position.y;
    }
};

// 处理鼠标移动事件
const handleMouseMove = (x: number, y: number) => {
    if (draggedShape) {
        draggedShape.position.x = x - dragOffset.x;
        draggedShape.position.y = y - dragOffset.y;
    }
};

// 处理鼠标释放事件
const handleMouseUp = () => {
    draggedShape = null;
};

// 在指定位置创建图形
const createShapeAt = (x: number, y: number) => {
    if (!shapeManager) return;

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = shapeSize.value;

    switch (selectedShapeType.value) {
        case "circle":
            shapeManager.createCircle({
                position: { x, y },
                radius: size / 2,
                color,
                strokeColor: "#ffffff",
                strokeWidth: 1,
            });
            break;

        case "rectangle":
            shapeManager.createRectangle({
                position: { x, y },
                size: { width: size, height: size * 0.7 },
                color,
                strokeColor: "#ffffff",
                strokeWidth: 1,
                borderRadius: 5,
            });
            break;

        case "triangle":
            shapeManager.createRegularPolygon({
                position: { x, y },
                sides: 3,
                radius: size / 2,
                color,
                strokeColor: "#ffffff",
                strokeWidth: 1,
            });
            break;

        case "pentagon":
            shapeManager.createRegularPolygon({
                position: { x, y },
                sides: 5,
                radius: size / 2,
                color,
                strokeColor: "#ffffff",
                strokeWidth: 1,
            });
            break;

        case "star":
            shapeManager.createStar({
                position: { x, y },
                outerRadius: size / 2,
                innerRadius: size / 4,
                color,
                strokeColor: "#ffffff",
                strokeWidth: 1,
            });
            break;

        case "arrow":
            const arrow = Polygon.createArrow(
                size,
                size * 0.3,
                size * 0.4,
                size * 0.6,
                {
                    position: { x, y },
                    color,
                },
            );
            arrow.strokeColor = "#ffffff";
            arrow.strokeWidth = 1;
            shapeManager.addShape(arrow);
            break;
    }
};

// 渲染帧回调
const onRenderFrame = (deltaTime: number) => {
    if (!shapeManager) return;

    const ctx = canvasEngineRef.value?.getContext();
    if (!ctx) return;

    // 更新图形管理器
    if (isAnimating.value) {
        shapeManager.update(deltaTime * animationSpeed.value);

        // 添加一些动画效果
        const shapes = shapeManager.getAllShapes();
        shapes.forEach((shape, index) => {
            const time = Date.now() * 0.001;

            // 旋转动画
            shape.angularVelocity = Math.sin(time + index) * 0.5;

            // 缩放动画
            const scale = 1 + Math.sin(time * 2 + index) * 0.1;
            shape.scaleTo(scale);

            // 颜色变化（通过透明度）
            shape.alpha = 0.8 + Math.sin(time * 3 + index) * 0.2;
        });
    }

    // 渲染图形管理器
    shapeManager.render(ctx);

    // 更新统计信息
    shapeStats.value = shapeManager.getStats();
};

// 控制方法
const toggleAnimation = () => {
    isAnimating.value = !isAnimating.value;
};

const clearShapes = () => {
    if (shapeManager) {
        shapeManager.clear();
        createInitialShapes();
    }
};

const toggleCollision = () => {
    enableCollision.value = !enableCollision.value;
    if (shapeManager) {
        shapeManager.setCollisionEnabled(enableCollision.value);
    }
};

const deleteSelected = () => {
    if (shapeManager) {
        shapeManager.deleteSelectedShapes();
    }
};

// 预设图形创建
const createRandomShapes = () => {
    if (!shapeManager) return;

    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvasConfig.width!;
        const y = Math.random() * canvasConfig.height!;
        const types = ["circle", "rectangle", "triangle", "pentagon", "star"];
        selectedShapeType.value =
            types[Math.floor(Math.random() * types.length)] || "circle";
        createShapeAt(x, y);
    }
};

const createGeometricPattern = () => {
    if (!shapeManager) return;

    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;
    const radius = 150;

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        shapeManager.createRegularPolygon({
            position: { x, y },
            sides: 6,
            radius: 25,
            color: colors[i % colors.length],
            strokeColor: "#ffffff",
            strokeWidth: 2,
        });
    }
};

const createSpiral = () => {
    if (!shapeManager) return;

    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;

    for (let i = 0; i < 30; i++) {
        const angle = i * 0.5;
        const radius = i * 8;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        shapeManager.createCircle({
            position: { x, y },
            radius: 8 + i * 0.5,
            color: colors[i % colors.length],
            strokeColor: "#ffffff",
            strokeWidth: 1,
        });
    }
};

const createMandala = () => {
    if (!shapeManager) return;

    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;

    // 创建多层曼陀罗图案
    for (let layer = 1; layer <= 4; layer++) {
        const radius = layer * 60;
        const count = layer * 6;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (layer % 2 === 0) {
                shapeManager.createStar({
                    position: { x, y },
                    outerRadius: 15,
                    innerRadius: 8,
                    color: colors[(layer + i) % colors.length],
                    strokeColor: "#ffffff",
                    strokeWidth: 1,
                });
            } else {
                shapeManager.createCircle({
                    position: { x, y },
                    radius: 12,
                    color: colors[(layer + i) % colors.length],
                    strokeColor: "#ffffff",
                    strokeWidth: 1,
                });
            }
        }
    }
};

// 组件挂载
onMounted(() => {
    console.log("几何图形渲染系统测试页面已加载");
});
</script>

<style scoped>
.canvas-container {
    border: 2px solid #374151;
}

/* 自定义滑块样式 */
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #374151;
    border-radius: 3px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}
</style>
