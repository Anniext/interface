<!-- 交互式物理世界组件 -->
<template>
    <div
        class="interactive-physics-world relative w-full h-full bg-gray-900 overflow-hidden">
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
            @mouseleave="handleMouseLeave"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"></canvas>

        <!-- 交互指示器 -->
        <div
            v-if="showInteractionArea && interactionState.isInteracting"
            class="absolute pointer-events-none border-2 border-blue-400 rounded-full opacity-50"
            :style="{
                left: `${
                    interactionState.interactionPoint.x - interactionRadius
                }px`,
                top: `${
                    interactionState.interactionPoint.y - interactionRadius
                }px`,
                width: `${interactionRadius * 2}px`,
                height: `${interactionRadius * 2}px`,
            }"></div>

        <!-- 调试信息面板 -->
        <div
            v-if="showDebug"
            class="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm font-mono max-w-xs">
            <h3 class="text-lg font-bold mb-2">物理交互系统</h3>

            <!-- 基础信息 -->
            <div class="space-y-1 mb-3">
                <div>物理体: {{ debugInfo.bodyCount }}</div>
                <div>约束: {{ constraintStats.totalConstraints }}</div>
                <div>碰撞: {{ debugInfo.collisionCount }}</div>
                <div>FPS: {{ fps.toFixed(1) }}</div>
            </div>

            <!-- 交互状态 -->
            <div class="mb-3 pt-2 border-t border-gray-600">
                <h4 class="font-bold mb-1">交互状态</h4>
                <div>
                    交互中: {{ interactionState.isInteracting ? "是" : "否" }}
                </div>
                <div v-if="interactionState.draggedBody">
                    拖拽物体: {{ interactionState.draggedBody }}
                </div>
                <div>约束数: {{ interactionState.constraintCount }}</div>
            </div>

            <!-- 碰撞统计 -->
            <div class="mb-3 pt-2 border-t border-gray-600">
                <h4 class="font-bold mb-1">碰撞统计</h4>
                <div>活跃碰撞: {{ collisionEvents.length }}</div>
                <div>总碰撞数: {{ totalCollisions }}</div>
            </div>

            <!-- 约束统计 -->
            <div class="pt-2 border-t border-gray-600">
                <h4 class="font-bold mb-1">约束统计</h4>
                <div>活跃: {{ constraintStats.activeConstraints }}</div>
                <div>断裂: {{ constraintStats.brokenConstraints }}</div>
                <div>能量: {{ constraintStats.totalEnergy.toFixed(2) }}</div>
            </div>
        </div>

        <!-- 控制面板 -->
        <div
            class="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-2">交互控制</h3>
            <div class="space-y-2">
                <button
                    @click="toggleDebug"
                    class="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                    {{ showDebug ? "隐藏" : "显示" }}调试信息
                </button>
                <button
                    @click="toggleInteractionArea"
                    class="w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                    {{ showInteractionArea ? "隐藏" : "显示" }}交互区域
                </button>
                <button
                    @click="addRandomBodies"
                    class="w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                    添加随机物体
                </button>
                <button
                    @click="createConstraintDemo"
                    class="w-full px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                    创建约束演示
                </button>
                <button
                    @click="clearAll"
                    class="w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                    清空所有
                </button>
                <button
                    @click="toggleGravity"
                    class="w-full px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm">
                    {{ gravityEnabled ? "关闭" : "开启" }}重力
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import {
    createPhysicsInteractionSystem,
    createPhysicsBody,
    PhysicsUtils,
    ConstraintType,
} from "@/utils/physics";
import type { IPhysicsDebugInfo, ICollisionEvent } from "@/types/physics";

// Props
interface Props {
    /** 是否显示调试信息 */
    debug?: boolean;
    /** 重力设置 */
    gravity?: { x: number; y: number };
    /** 画布尺寸 */
    width?: number;
    height?: number;
    /** 交互半径 */
    interactionRadius?: number;
}

const props = withDefaults(defineProps<Props>(), {
    debug: false,
    gravity: () => ({ x: 0, y: 1 }),
    width: 800,
    height: 600,
    interactionRadius: 50,
});

// Emits
interface Emits {
    (e: "bodyAdded", bodyId: string): void;
    (e: "bodyRemoved", bodyId: string): void;
    (e: "collision", event: ICollisionEvent): void;
    (e: "constraintCreated", constraintId: string): void;
    (e: "constraintBroken", constraintId: string): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const showDebug = ref(props.debug);
const showInteractionArea = ref(false);
const gravityEnabled = ref(true);
const pixelRatio = window.devicePixelRatio || 1;
const interactionRadius = ref(props.interactionRadius);

// 画布尺寸
const canvasSize = computed(() => ({
    width: props.width,
    height: props.height,
}));

// 物理系统相关
let physicsSystem: any = null;
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

const interactionState = ref({
    isInteracting: false,
    interactionPoint: { x: 0, y: 0 },
    draggedBody: null as string | null,
    constraintCount: 0,
});

const constraintStats = ref({
    totalConstraints: 0,
    activeConstraints: 0,
    brokenConstraints: 0,
    totalEnergy: 0,
});

const collisionEvents = ref<ICollisionEvent[]>([]);
const totalCollisions = ref(0);
const fps = ref(60);

/**
 * 初始化物理系统
 */
function initPhysicsSystem() {
    physicsSystem = createPhysicsInteractionSystem(
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
        {
            enableMouse: true,
            enableTouch: true,
            forceStrength: 0.001,
            interactionRadius: interactionRadius.value,
            showInteractionArea: false,
            dragDamping: 0.9,
        },
    );

    // 创建边界墙体
    const bounds = createPhysicsBody.bounds(
        canvasSize.value.width,
        canvasSize.value.height,
        50,
    );
    bounds.forEach((bound) => physicsSystem.lifecycleManager.addBody(bound));

    // 注册碰撞响应
    setupCollisionHandling();

    console.log("交互式物理系统初始化完成");
}

/**
 * 设置碰撞处理
 */
function setupCollisionHandling() {
    // 这里可以注册特定的碰撞响应
    console.log("碰撞处理系统已设置");
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
    if (!ctx || !physicsSystem) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 计算 FPS
    if (deltaTime > 0) {
        fps.value = 1000 / deltaTime;
    }

    // 更新物理系统
    physicsSystem.engine.update(deltaTime);
    physicsSystem.lifecycleManager.update(deltaTime);
    physicsSystem.interactionSystem.update(
        physicsSystem.lifecycleManager.getActiveBodies(),
    );

    // 更新碰撞系统
    const newCollisions = physicsSystem.collisionSystem.update(
        physicsSystem.lifecycleManager.getActiveBodies(),
    );
    collisionEvents.value = newCollisions;
    totalCollisions.value += newCollisions.length;

    // 更新约束系统
    physicsSystem.constraintSystem.update(deltaTime);

    // 更新调试信息
    updateDebugInfo();

    // 清空画布
    ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height);

    // 渲染物理体
    renderBodies();

    // 渲染约束
    physicsSystem.constraintSystem.render(ctx);

    // 继续动画循环
    animationId = requestAnimationFrame(render);
}

/**
 * 更新调试信息
 */
function updateDebugInfo() {
    debugInfo.value = physicsSystem.engine.getDebugInfo();
    interactionState.value =
        physicsSystem.interactionSystem.getInteractionState();
    constraintStats.value = physicsSystem.constraintSystem.getStats();
}

/**
 * 渲染所有物理体
 */
function renderBodies() {
    if (!ctx) return;

    const bodies = physicsSystem.lifecycleManager.getActiveBodies();

    bodies.forEach((body: any) => {
        ctx!.save();

        // 移动到物理体位置
        ctx!.translate(body.position.x, body.position.y);
        ctx!.rotate(body.angle);

        // 根据类型渲染
        switch (body.type) {
            case "circle":
                renderCircle(body);
                break;
            case "rectangle":
                renderRectangle(body);
                break;
            case "polygon":
                renderPolygon(body);
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
    const position = getMousePosition(event);
    physicsSystem.interactionSystem.startMouseInteraction(position, event);
}

/**
 * 鼠标移动事件
 */
function handleMouseMove(event: MouseEvent) {
    const position = getMousePosition(event);
    physicsSystem.interactionSystem.updateMouseInteraction(position);
}

/**
 * 鼠标释放事件
 */
function handleMouseUp() {
    physicsSystem.interactionSystem.endMouseInteraction();
}

/**
 * 鼠标离开事件
 */
function handleMouseLeave() {
    physicsSystem.interactionSystem.endMouseInteraction();
}

/**
 * 触摸开始事件
 */
function handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    const touches = Array.from(event.touches).map((touch) =>
        getTouchPosition(touch),
    );
    physicsSystem.interactionSystem.startTouchInteraction(touches);
}

/**
 * 触摸移动事件
 */
function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touches = Array.from(event.touches).map((touch) =>
        getTouchPosition(touch),
    );
    physicsSystem.interactionSystem.updateTouchInteraction(touches);
}

/**
 * 触摸结束事件
 */
function handleTouchEnd(event: TouchEvent) {
    event.preventDefault();
    physicsSystem.interactionSystem.endTouchInteraction();
}

/**
 * 获取鼠标位置
 */
function getMousePosition(event: MouseEvent): { x: number; y: number } {
    if (!canvasRef.value) return { x: 0, y: 0 };

    const rect = canvasRef.value.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

/**
 * 获取触摸位置
 */
function getTouchPosition(touch: Touch): { x: number; y: number } {
    if (!canvasRef.value) return { x: 0, y: 0 };

    const rect = canvasRef.value.getBoundingClientRect();
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
    };
}

/**
 * 添加随机物体
 */
function addRandomBodies() {
    for (let i = 0; i < 5; i++) {
        const position = PhysicsUtils.randomPosition({
            x: 50,
            y: 50,
            width: canvasSize.value.width - 100,
            height: canvasSize.value.height - 100,
        });

        const bodyType = Math.random();
        let body;

        if (bodyType < 0.4) {
            // 创建圆形
            body = createPhysicsBody.circle(
                position.x,
                position.y,
                10 + Math.random() * 20,
                {
                    restitution: 0.8,
                    friction: 0.1,
                },
            );
        } else if (bodyType < 0.8) {
            // 创建矩形
            const size = 15 + Math.random() * 25;
            body = createPhysicsBody.rectangle(
                position.x,
                position.y,
                size,
                size,
                {
                    restitution: 0.6,
                    friction: 0.3,
                },
            );
        } else {
            // 创建三角形
            body = createPhysicsBody.triangle(
                position.x,
                position.y,
                20 + Math.random() * 20,
                {
                    restitution: 0.7,
                    friction: 0.2,
                },
            );
        }

        // 添加初始速度
        body.velocity = PhysicsUtils.randomVelocity(50, 150);

        physicsSystem.lifecycleManager.addBody(body);
        emit("bodyAdded", body.id);
    }
}

/**
 * 创建约束演示
 */
function createConstraintDemo() {
    const bodies = physicsSystem.lifecycleManager.getActiveBodies();
    const nonStaticBodies = bodies.filter((body: any) => !body.isStatic);

    if (nonStaticBodies.length >= 2) {
        // 随机选择两个物体创建弹簧约束
        const bodyA =
            nonStaticBodies[Math.floor(Math.random() * nonStaticBodies.length)];
        const bodyB =
            nonStaticBodies[Math.floor(Math.random() * nonStaticBodies.length)];

        if (bodyA !== bodyB) {
            const constraintId = physicsSystem.constraintSystem.createSpring(
                bodyA,
                bodyB,
                {
                    stiffness: 0.3,
                    damping: 0.1,
                },
            );
            emit("constraintCreated", constraintId);
        }
    }

    // 创建一个固定约束
    if (nonStaticBodies.length >= 1) {
        const body =
            nonStaticBodies[Math.floor(Math.random() * nonStaticBodies.length)];
        const pinPoint = {
            x: canvasSize.value.width / 2,
            y: 100,
        };

        const constraintId = physicsSystem.constraintSystem.createPin(
            body,
            pinPoint,
            {
                stiffness: 0.8,
                damping: 0.2,
            },
        );
        emit("constraintCreated", constraintId);
    }
}

/**
 * 清空所有物体和约束
 */
function clearAll() {
    physicsSystem.lifecycleManager.clear();
    physicsSystem.constraintSystem.destroy();

    // 重新创建边界
    const bounds = createPhysicsBody.bounds(
        canvasSize.value.width,
        canvasSize.value.height,
        50,
    );
    bounds.forEach((bound: any) =>
        physicsSystem.lifecycleManager.addBody(bound),
    );

    // 重置统计
    totalCollisions.value = 0;
    collisionEvents.value = [];
}

/**
 * 切换重力
 */
function toggleGravity() {
    gravityEnabled.value = !gravityEnabled.value;
    physicsSystem.engine.setGravity(
        gravityEnabled.value ? props.gravity : { x: 0, y: 0 },
    );
}

/**
 * 切换调试信息显示
 */
function toggleDebug() {
    showDebug.value = !showDebug.value;
}

/**
 * 切换交互区域显示
 */
function toggleInteractionArea() {
    showInteractionArea.value = !showInteractionArea.value;
    physicsSystem.interactionSystem.updateConfig({
        showInteractionArea: showInteractionArea.value,
    });
}

// 生命周期
onMounted(() => {
    initCanvas();
    initPhysicsSystem();

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

    // 销毁物理系统
    if (physicsSystem) {
        physicsSystem.lifecycleManager.destroy();
        physicsSystem.engine.destroy();
        physicsSystem.interactionSystem.destroy();
        physicsSystem.collisionSystem.destroy();
        physicsSystem.constraintSystem.destroy();
    }
});
</script>

<style scoped>
.interactive-physics-world {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

canvas {
    touch-action: none;
}
</style>
