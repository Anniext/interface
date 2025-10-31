<!-- 物理世界组件 -->
<template>
    <div
        class="physics-world relative w-full h-full bg-gray-900 overflow-hidden">
        <!-- Canvas 渲染层 -->
        <canvas
            ref="canvasRef"
            :width="canvasSize.width * pixelRatio"
            :height="canvasSize.height * pixelRatio"
            :style="{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
            }"
            class="absolute inset-0 cursor-pointer"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"></canvas>

        <!-- 调试信息面板 -->
        <div
            v-if="showDebug"
            class="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm font-mono">
            <h3 class="text-lg font-bold mb-2">物理引擎调试信息</h3>
            <div class="space-y-1">
                <div>物理体数量: {{ debugInfo.bodyCount }}</div>
                <div>约束数量: {{ debugInfo.constraintCount }}</div>
                <div>碰撞数量: {{ debugInfo.collisionCount }}</div>
                <div>更新时间: {{ debugInfo.updateTime.toFixed(2) }}ms</div>
                <div>休眠物体: {{ debugInfo.sleepingBodies }}</div>
                <div>FPS: {{ fps.toFixed(1) }}</div>
            </div>

            <!-- 生命周期统计 -->
            <div class="mt-4 pt-2 border-t border-gray-600">
                <h4 class="font-bold mb-1">生命周期统计</h4>
                <div>活跃物体: {{ lifecycleStats.totalBodies }}</div>
                <div>待删除: {{ lifecycleStats.markedForRemoval }}</div>
                <div>静止物体: {{ lifecycleStats.staticBodies }}</div>
                <div>
                    平均年龄:
                    {{ (lifecycleStats.averageAge / 1000).toFixed(1) }}s
                </div>
            </div>
        </div>

        <!-- 控制面板 -->
        <div
            class="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">物理控制</h3>
            <div class="space-y-2">
                <button
                    @click="toggleDebug"
                    class="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                    {{ showDebug ? "隐藏" : "显示" }}调试信息
                </button>
                <button
                    @click="addRandomBodies"
                    class="w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                    添加随机物体
                </button>
                <button
                    @click="clearBodies"
                    class="w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                    清空物体
                </button>
                <button
                    @click="toggleGravity"
                    class="w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                    {{ gravityEnabled ? "关闭" : "开启" }}重力
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import {
    createManagedPhysicsEngine,
    createPhysicsBody,
    PhysicsUtils,
} from "@/utils/physics";
import type { IPhysicsDebugInfo } from "@/types/physics";

// Props
interface Props {
    /** 是否显示调试信息 */
    debug?: boolean;
    /** 重力设置 */
    gravity?: { x: number; y: number };
    /** 画布尺寸 */
    width?: number;
    height?: number;
}

const props = withDefaults(defineProps<Props>(), {
    debug: false,
    gravity: () => ({ x: 0, y: 1 }),
    width: 800,
    height: 600,
});

// Emits
interface Emits {
    (e: "bodyAdded", bodyId: string): void;
    (e: "bodyRemoved", bodyId: string): void;
    (e: "collision", event: any): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const showDebug = ref(props.debug);
const gravityEnabled = ref(true);
const pixelRatio = window.devicePixelRatio || 1;

// 画布尺寸
const canvasSize = computed(() => ({
    width: props.width,
    height: props.height,
}));

// 物理引擎相关
let physicsEngine: any = null;
let lifecycleManager: any = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId = 0;
let lastTime = 0;

// 调试信息
const debugInfo = ref<IPhysicsDebugInfo>({
    bodyCount: 0,
    constraintCount: 0,
    collisionCount: 0,
    updateTime: 0,
    sleepingBodies: 0,
});

const lifecycleStats = ref({
    totalBodies: 0,
    markedForRemoval: 0,
    averageAge: 0,
    oldestBody: 0,
    staticBodies: 0,
});

const fps = ref(60);

// 鼠标/触摸交互
const isMouseDown = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

/**
 * 初始化物理引擎
 */
function initPhysics() {
    const { engine, lifecycleManager: manager } = createManagedPhysicsEngine(
        {
            gravity: props.gravity,
            enableCollision: true,
            timeStep: 16.67,
        },
        {
            maxBodies: 200,
            boundaryCheck: {
                enabled: true,
                bounds: {
                    x: 0,
                    y: 0,
                    width: canvasSize.value.width,
                    height: canvasSize.value.height,
                },
                outOfBoundsAction: "remove",
            },
            velocityCheck: {
                enabled: true,
                minVelocity: 0.1,
                staticTime: 10000,
            },
        },
    );

    physicsEngine = engine;
    lifecycleManager = manager;

    // 创建边界墙体
    const bounds = createPhysicsBody.bounds(
        canvasSize.value.width,
        canvasSize.value.height,
        50,
    );
    bounds.forEach((bound) => lifecycleManager.addBody(bound));

    console.log("物理引擎初始化完成");
}

/**
 * 初始化 Canvas
 */
function initCanvas() {
    if (!canvasRef.value) return;

    ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    // 设置高分辨率适配
    ctx.scale(pixelRatio, pixelRatio);

    // 设置默认样式
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    console.log("Canvas 初始化完成");
}

/**
 * 渲染循环
 */
function render(currentTime: number) {
    if (!ctx || !physicsEngine || !lifecycleManager) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 计算 FPS
    if (deltaTime > 0) {
        fps.value = 1000 / deltaTime;
    }

    // 更新物理引擎
    physicsEngine.update(deltaTime);
    lifecycleManager.update(deltaTime);

    // 更新调试信息
    debugInfo.value = physicsEngine.getDebugInfo();
    lifecycleStats.value = lifecycleManager.getStats();

    // 清空画布
    ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height);

    // 渲染物理体
    renderBodies();

    // 继续动画循环
    animationId = requestAnimationFrame(render);
}

/**
 * 渲染所有物理体
 */
function renderBodies() {
    if (!ctx) return;

    const bodies = lifecycleManager.getActiveBodies();

    bodies.forEach((body) => {
        ctx!.save();

        // 移动到物理体位置
        ctx!.translate(body.position.x, body.position.y);
        ctx!.rotate(body.angle);

        // 根据类型渲染
        switch (body.type) {
            case "circle":
                renderCircle(body as any);
                break;
            case "rectangle":
                renderRectangle(body as any);
                break;
            case "polygon":
                renderPolygon(body as any);
                break;
        }

        ctx!.restore();
    });
}

/**
 * 渲染圆形
 */
function renderCircle(body: any) {
    if (!ctx) return;

    const radius = body.radius || 10;

    // 填充
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = body.isStatic ? "#4a5568" : "#3182ce";
    ctx.fill();

    // 描边
    ctx.strokeStyle = "#2d3748";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 方向指示线
    if (!body.isStatic) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius * 0.8, 0);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

/**
 * 渲染矩形
 */
function renderRectangle(body: any) {
    if (!ctx) return;

    const width = body.width || 20;
    const height = body.height || 20;

    // 填充
    ctx.fillStyle = body.isStatic ? "#4a5568" : "#38a169";
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // 描边
    ctx.strokeStyle = "#2d3748";
    ctx.lineWidth = 2;
    ctx.strokeRect(-width / 2, -height / 2, width, height);
}

/**
 * 渲染多边形
 */
function renderPolygon(body: any) {
    if (!ctx || !body.vertices) return;

    ctx.beginPath();
    body.vertices.forEach((vertex: any, index: number) => {
        if (index === 0) {
            ctx.moveTo(vertex.x, vertex.y);
        } else {
            ctx.lineTo(vertex.x, vertex.y);
        }
    });
    ctx.closePath();

    // 填充
    ctx.fillStyle = body.isStatic ? "#4a5568" : "#ed8936";
    ctx.fill();

    // 描边
    ctx.strokeStyle = "#2d3748";
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * 鼠标按下事件
 */
function handleMouseDown(event: MouseEvent) {
    isMouseDown.value = true;
    updateMousePosition(event);

    // 在鼠标位置创建物理体
    createBodyAtPosition(mousePosition.value.x, mousePosition.value.y);
}

/**
 * 鼠标移动事件
 */
function handleMouseMove(event: MouseEvent) {
    updateMousePosition(event);
}

/**
 * 鼠标释放事件
 */
function handleMouseUp() {
    isMouseDown.value = false;
}

/**
 * 触摸开始事件
 */
function handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
        isMouseDown.value = true;
        updateTouchPosition(touch);
        createBodyAtPosition(mousePosition.value.x, mousePosition.value.y);
    }
}

/**
 * 触摸移动事件
 */
function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
        updateTouchPosition(touch);
    }
}

/**
 * 触摸结束事件
 */
function handleTouchEnd(event: TouchEvent) {
    event.preventDefault();
    isMouseDown.value = false;
}

/**
 * 更新鼠标位置
 */
function updateMousePosition(event: MouseEvent) {
    if (!canvasRef.value) return;

    const rect = canvasRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

/**
 * 更新触摸位置
 */
function updateTouchPosition(touch: Touch) {
    if (!canvasRef.value) return;

    const rect = canvasRef.value.getBoundingClientRect();
    mousePosition.value = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
    };
}

/**
 * 在指定位置创建物理体
 */
function createBodyAtPosition(x: number, y: number) {
    if (!lifecycleManager) return;

    const bodyType = Math.random();
    let body;

    if (bodyType < 0.4) {
        // 创建圆形
        body = createPhysicsBody.circle(x, y, 10 + Math.random() * 20, {
            restitution: 0.8,
            friction: 0.1,
        });
    } else if (bodyType < 0.8) {
        // 创建矩形
        const size = 15 + Math.random() * 25;
        body = createPhysicsBody.rectangle(x, y, size, size, {
            restitution: 0.6,
            friction: 0.3,
        });
    } else {
        // 创建三角形
        body = createPhysicsBody.triangle(x, y, 20 + Math.random() * 20, {
            restitution: 0.7,
            friction: 0.2,
        });
    }

    // 添加初始速度
    body.velocity = PhysicsUtils.randomVelocity(50, 150);

    lifecycleManager.addBody(body);
    emit("bodyAdded", body.id);
}

/**
 * 添加随机物体
 */
function addRandomBodies() {
    for (let i = 0; i < 10; i++) {
        const position = PhysicsUtils.randomPosition({
            x: 50,
            y: 50,
            width: canvasSize.value.width - 100,
            height: canvasSize.value.height - 100,
        });
        createBodyAtPosition(position.x, position.y);
    }
}

/**
 * 清空所有物体
 */
function clearBodies() {
    if (lifecycleManager) {
        lifecycleManager.clear();

        // 重新创建边界
        const bounds = createPhysicsBody.bounds(
            canvasSize.value.width,
            canvasSize.value.height,
            50,
        );
        bounds.forEach((bound) => lifecycleManager.addBody(bound));
    }
}

/**
 * 切换重力
 */
function toggleGravity() {
    gravityEnabled.value = !gravityEnabled.value;
    if (physicsEngine) {
        physicsEngine.setGravity(
            gravityEnabled.value ? props.gravity : { x: 0, y: 0 },
        );
    }
}

/**
 * 切换调试信息显示
 */
function toggleDebug() {
    showDebug.value = !showDebug.value;
}

// 生命周期
onMounted(() => {
    initCanvas();
    initPhysics();

    // 启动渲染循环
    animationId = requestAnimationFrame(render);

    // 添加一些初始物体
    setTimeout(() => {
        addRandomBodies();
    }, 500);
});

onBeforeUnmount(() => {
    // 清理动画循环
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // 销毁物理引擎
    if (lifecycleManager) {
        lifecycleManager.destroy();
    }
    if (physicsEngine) {
        physicsEngine.destroy();
    }
});
</script>

<style scoped>
.physics-world {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

canvas {
    touch-action: none;
}
</style>
