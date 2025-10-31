<!-- 导航元素物理交互组件 -->
<template>
    <div
        class="navigation-physics-effect relative w-full h-full bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <!-- Canvas 渲染层 -->
        <canvas
            ref="canvasRef"
            :width="canvasSize.width * pixelRatio"
            :height="canvasSize.height * pixelRatio"
            :style="{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
            }"
            class="absolute inset-0"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave" />

        <!-- 连接线渲染层 -->
        <svg
            class="absolute inset-0 pointer-events-none"
            :width="canvasSize.width"
            :height="canvasSize.height">
            <defs>
                <linearGradient
                    id="connectionGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop
                        offset="0%"
                        style="stop-color: #3b82f6; stop-opacity: 0.8" />
                    <stop
                        offset="50%"
                        style="stop-color: #8b5cf6; stop-opacity: 0.6" />
                    <stop
                        offset="100%"
                        style="stop-color: #06b6d4; stop-opacity: 0.8" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <!-- 连接线 -->
            <path
                v-for="connection in connections"
                :key="connection.id"
                :d="connection.path"
                :stroke="connection.color"
                :stroke-width="connection.width"
                :stroke-opacity="connection.opacity"
                fill="none"
                stroke-linecap="round"
                :filter="connection.isActive ? 'url(#glow)' : 'none'"
                class="transition-all duration-300" />
        </svg>

        <!-- 导航项 HTML 层 -->
        <div class="absolute inset-0">
            <div
                v-for="navItem in navigationItems"
                :key="navItem.id"
                :style="{
                    transform: `translate(${navItem.position.x - 60}px, ${
                        navItem.position.y - 25
                    }px) rotate(${navItem.rotation}deg) scale(${
                        navItem.scale
                    })`,
                    transition: navItem.isAnimating
                        ? 'none'
                        : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }"
                class="absolute nav-item cursor-pointer"
                :class="[
                    'w-32 h-12 rounded-xl flex items-center justify-center',
                    'border-2 backdrop-blur-sm transition-all duration-300',
                    navItem.isHovered ? 'shadow-2xl' : 'shadow-lg',
                    navItem.isMagnetic ? 'z-10' : 'z-0',
                ]"
                :style="{
                    backgroundColor: navItem.backgroundColor,
                    borderColor: navItem.borderColor,
                    boxShadow: navItem.isHovered
                        ? `0 0 30px ${navItem.glowColor}, 0 20px 40px ${navItem.shadowColor}`
                        : `0 8px 25px ${navItem.shadowColor}`,
                }"
                @mouseenter="handleNavItemHover(navItem, true)"
                @mouseleave="handleNavItemHover(navItem, false)"
                @click="handleNavItemClick(navItem)">
                <!-- 导航图标和文字 -->
                <div class="flex items-center space-x-2">
                    <!-- 图标 -->
                    <div
                        class="text-lg transition-transform duration-300"
                        :class="navItem.isHovered ? 'scale-110' : 'scale-100'"
                        :style="{ color: navItem.iconColor }">
                        {{ navItem.icon }}
                    </div>

                    <!-- 文字 -->
                    <span
                        class="text-sm font-medium transition-all duration-300"
                        :class="
                            navItem.isHovered
                                ? 'tracking-wide'
                                : 'tracking-normal'
                        "
                        :style="{ color: navItem.textColor }">
                        {{ navItem.label }}
                    </span>
                </div>

                <!-- 磁性效果指示器 -->
                <div
                    v-if="navItem.isMagnetic"
                    class="absolute -inset-1 rounded-xl border-2 border-dashed animate-pulse"
                    :style="{ borderColor: navItem.glowColor }" />

                <!-- 点击波纹效果 -->
                <div
                    v-if="navItem.ripple"
                    :style="{
                        transform: `scale(${navItem.ripple.scale})`,
                        opacity: navItem.ripple.opacity,
                        borderColor: navItem.glowColor,
                    }"
                    class="absolute inset-0 rounded-xl border-2 pointer-events-none" />
            </div>
        </div>

        <!-- 鼠标磁场可视化 -->
        <div
            v-if="showMagneticField && mousePosition"
            :style="{
                transform: `translate(${mousePosition.x - magneticRange}px, ${
                    mousePosition.y - magneticRange
                }px)`,
                width: `${magneticRange * 2}px`,
                height: `${magneticRange * 2}px`,
            }"
            class="absolute rounded-full border border-blue-400 opacity-30 pointer-events-none"
            :class="isMouseInRange ? 'animate-pulse' : ''" />

        <!-- 控制面板 -->
        <div
            v-if="showControls"
            class="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm">
            <h3 class="text-sm font-bold mb-3 text-blue-400">
                🧭 导航物理控制
            </h3>
            <div class="space-y-3">
                <button
                    @click="resetNavigation"
                    class="w-full px-3 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded text-sm font-medium transition-all">
                    重置位置
                </button>

                <button
                    @click="toggleConnections"
                    class="w-full px-3 py-2 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded text-sm font-medium transition-all">
                    {{ connectionsEnabled ? "隐藏连接" : "显示连接" }}
                </button>

                <button
                    @click="addNavItem"
                    class="w-full px-3 py-2 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded text-sm font-medium transition-all">
                    添加导航项
                </button>

                <div class="pt-3 border-t border-gray-600">
                    <label class="block text-xs mb-2 text-gray-300"
                        >磁性范围</label
                    >
                    <input
                        v-model.number="magneticRange"
                        type="range"
                        min="50"
                        max="200"
                        step="10"
                        class="w-full accent-blue-500" />
                    <span class="text-xs text-gray-400"
                        >{{ magneticRange }}px</span
                    >
                </div>

                <div>
                    <label class="block text-xs mb-2 text-gray-300"
                        >磁性强度</label
                    >
                    <input
                        v-model.number="magneticStrength"
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        class="w-full accent-blue-500" />
                    <span class="text-xs text-gray-400">{{
                        magneticStrength
                    }}</span>
                </div>

                <div>
                    <label class="block text-xs mb-2 text-gray-300"
                        >阻尼系数</label
                    >
                    <input
                        v-model.number="dampingFactor"
                        type="range"
                        min="0.8"
                        max="0.99"
                        step="0.01"
                        class="w-full accent-blue-500" />
                    <span class="text-xs text-gray-400">{{
                        dampingFactor
                    }}</span>
                </div>

                <div class="flex items-center space-x-2">
                    <input
                        v-model="showMagneticField"
                        type="checkbox"
                        id="magnetic-field-toggle"
                        class="accent-blue-500" />
                    <label
                        for="magnetic-field-toggle"
                        class="text-xs text-gray-300"
                        >显示磁场</label
                    >
                </div>
            </div>
        </div>

        <!-- 统计信息 -->
        <div
            v-if="showStats"
            class="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
            <div class="space-y-1">
                <div>导航项数量: {{ navigationItems.length }}</div>
                <div>活跃连接: {{ activeConnections }}</div>
                <div>磁性交互: {{ magneticInteractions }}</div>
                <div>
                    鼠标位置:
                    {{
                        mousePosition
                            ? `${Math.round(mousePosition.x)}, ${Math.round(
                                  mousePosition.y,
                              )}`
                            : "无"
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { gsap } from "gsap";
import { PhysicsAnimationEffects } from "@/utils/physics/SimplePhysicsAnimationEffects";
import type { INavigationPhysicsConfig } from "@/utils/physics/SimplePhysicsAnimationEffects";

// Props
interface Props {
    /** 导航项数据 */
    items?: Array<{
        id: string;
        label: string;
        icon: string;
        path: string;
        color?: string;
    }>;
    /** 画布尺寸 */
    width?: number;
    height?: number;
    /** 是否显示控制面板 */
    showControls?: boolean;
    /** 是否显示统计信息 */
    showStats?: boolean;
    /** 自动启用连接 */
    autoConnect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [
        { id: "home", label: "首页", icon: "🏠", path: "/", color: "#3b82f6" },
        {
            id: "about",
            label: "关于",
            icon: "👤",
            path: "/about",
            color: "#8b5cf6",
        },
        {
            id: "skills",
            label: "技能",
            icon: "⚡",
            path: "/skills",
            color: "#06b6d4",
        },
        {
            id: "projects",
            label: "项目",
            icon: "💼",
            path: "/projects",
            color: "#10b981",
        },
        {
            id: "contact",
            label: "联系",
            icon: "📧",
            path: "/contact",
            color: "#f59e0b",
        },
    ],
    width: 800,
    height: 600,
    showControls: false,
    showStats: false,
    autoConnect: true,
});

// Emits
interface Emits {
    (e: "navigate", item: any): void;
    (e: "itemHover", item: any, isHovered: boolean): void;
    (e: "connectionChange", connections: any[]): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const pixelRatio = window.devicePixelRatio || 1;
const magneticRange = ref(120);
const magneticStrength = ref(1.0);
const dampingFactor = ref(0.95);
const showMagneticField = ref(false);
const connectionsEnabled = ref(props.autoConnect);

// 画布尺寸
const canvasSize = computed(() => ({
    width: props.width,
    height: props.height,
}));

// 鼠标状态
const mousePosition = ref<{ x: number; y: number } | null>(null);
const isMouseInRange = ref(false);

// 导航项状态
const navigationItems = ref(
    props.items.map((item, index) => {
        const x = 150 + index * 120;
        const y = canvasSize.value.height / 2;

        return {
            ...item,
            position: { x, y },
            originalPosition: { x, y },
            velocity: { x: 0, y: 0 },
            rotation: 0,
            scale: 1,
            isAnimating: false,
            isHovered: false,
            isMagnetic: false,
            ripple: null as any,
            // 样式属性
            backgroundColor: `${item.color || "#3b82f6"}20`,
            borderColor: item.color || "#3b82f6",
            glowColor: item.color || "#3b82f6",
            shadowColor: `${item.color || "#3b82f6"}40`,
            iconColor: item.color || "#3b82f6",
            textColor: item.color || "#3b82f6",
        };
    }),
);

// 连接线状态
const connections = ref<
    Array<{
        id: string;
        from: string;
        to: string;
        path: string;
        color: string;
        width: number;
        opacity: number;
        isActive: boolean;
    }>
>([]);

// 统计数据
const magneticInteractions = ref(0);

// 计算属性
const activeConnections = computed(
    () => connections.value.filter((conn) => conn.isActive).length,
);

// 动画效果系统
let animationEffects: PhysicsAnimationEffects | null = null;
let animationFrame: number = 0;

/**
 * 初始化物理系统
 */
function initPhysicsSystem() {
    if (!canvasRef.value) return;

    // 使用简化的动画效果系统
    animationEffects = new PhysicsAnimationEffects(canvasRef.value);

    // 创建导航物理交互
    createNavigationPhysics();

    // 启动更新循环
    startUpdateLoop();

    console.log("导航动画系统初始化完成");
}

/**
 * 创建导航物理交互
 */
function createNavigationPhysics() {
    if (!animationEffects) return;

    const config: INavigationPhysicsConfig = {
        items: props.items,
        interaction: {
            hoverForce: magneticStrength.value,
            clickImpulse: 2.0,
            magneticRange: magneticRange.value,
            dampingFactor: dampingFactor.value,
        },
        connections: {
            enabled: connectionsEnabled.value,
            maxDistance: 200,
            springStiffness: 0.1,
            lineOpacity: 0.6,
        },
    };

    animationEffects.createNavigationPhysicsEffect(config);

    // 初始化连接
    if (connectionsEnabled.value) {
        updateConnections();
    }
}

/**
 * 启动更新循环
 */
function startUpdateLoop() {
    const update = () => {
        updatePhysics();
        updateConnections();
        animationFrame = requestAnimationFrame(update);
    };
    update();
}

/**
 * 更新物理模拟
 */
function updatePhysics() {
    navigationItems.value.forEach((item) => {
        // 应用磁性效果
        if (mousePosition.value && item.isMagnetic) {
            const dx = mousePosition.value.x - item.position.x;
            const dy = mousePosition.value.y - item.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < magneticRange.value && distance > 0) {
                const force =
                    ((magneticRange.value - distance) / magneticRange.value) *
                    magneticStrength.value;
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;

                item.velocity.x += normalizedDx * force * 0.5;
                item.velocity.y += normalizedDy * force * 0.5;
            }
        }

        // 回弹到原始位置
        const restoreForce = 0.02;
        const dx = item.originalPosition.x - item.position.x;
        const dy = item.originalPosition.y - item.position.y;

        item.velocity.x += dx * restoreForce;
        item.velocity.y += dy * restoreForce;

        // 应用阻尼
        item.velocity.x *= dampingFactor.value;
        item.velocity.y *= dampingFactor.value;

        // 更新位置
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;

        // 限制移动范围
        const maxDistance = 80;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        if (currentDistance > maxDistance) {
            const ratio = maxDistance / currentDistance;
            item.position.x = item.originalPosition.x - dx * ratio;
            item.position.y = item.originalPosition.y - dy * ratio;
        }
    });
}

/**
 * 更新连接线
 */
function updateConnections() {
    if (!connectionsEnabled.value) {
        connections.value = [];
        return;
    }

    const newConnections: typeof connections.value = [];

    for (let i = 0; i < navigationItems.value.length - 1; i++) {
        const itemA = navigationItems.value[i];
        const itemB = navigationItems.value[i + 1];

        const distance = Math.sqrt(
            Math.pow(itemB.position.x - itemA.position.x, 2) +
                Math.pow(itemB.position.y - itemA.position.y, 2),
        );

        if (distance <= 200) {
            const connection = {
                id: `${itemA.id}-${itemB.id}`,
                from: itemA.id,
                to: itemB.id,
                path: createConnectionPath(itemA.position, itemB.position),
                color: "url(#connectionGradient)",
                width: Math.max(1, 4 - distance / 50),
                opacity: Math.max(0.2, 1 - distance / 200),
                isActive:
                    itemA.isHovered ||
                    itemB.isHovered ||
                    itemA.isMagnetic ||
                    itemB.isMagnetic,
            };

            newConnections.push(connection);
        }
    }

    connections.value = newConnections;
    emit("connectionChange", connections.value);
}

/**
 * 创建连接路径
 */
function createConnectionPath(
    from: { x: number; y: number },
    to: { x: number; y: number },
): string {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2),
    );
    const curvature = Math.min(50, distance * 0.2);

    // 创建贝塞尔曲线
    const controlY = midY - curvature;

    return `M ${from.x} ${from.y} Q ${midX} ${controlY} ${to.x} ${to.y}`;
}

/**
 * 处理鼠标移动
 */
function handleMouseMove(event: MouseEvent) {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (!rect) return;

    mousePosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };

    // 检查磁性交互
    let hasInteraction = false;
    navigationItems.value.forEach((item) => {
        const distance = Math.sqrt(
            Math.pow(mousePosition.value!.x - item.position.x, 2) +
                Math.pow(mousePosition.value!.y - item.position.y, 2),
        );

        const wasMagnetic = item.isMagnetic;
        item.isMagnetic = distance < magneticRange.value;

        if (item.isMagnetic && !wasMagnetic) {
            magneticInteractions.value++;
        }

        if (item.isMagnetic) {
            hasInteraction = true;
        }
    });

    isMouseInRange.value = hasInteraction;
}

/**
 * 处理鼠标离开
 */
function handleMouseLeave() {
    mousePosition.value = null;
    isMouseInRange.value = false;

    navigationItems.value.forEach((item) => {
        item.isMagnetic = false;
    });
}

/**
 * 处理导航项悬停
 */
function handleNavItemHover(item: any, isHovered: boolean) {
    item.isHovered = isHovered;

    if (isHovered) {
        gsap.to(item, {
            scale: 1.1,
            rotation: (Math.random() - 0.5) * 10,
            duration: 0.3,
            ease: "back.out(1.7)",
        });
    } else {
        gsap.to(item, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
        });
    }

    emit("itemHover", item, isHovered);
}

/**
 * 处理导航项点击
 */
function handleNavItemClick(item: any) {
    // 创建点击波纹效果
    item.ripple = {
        scale: 0,
        opacity: 1,
    };

    gsap.to(item.ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            item.ripple = null;
        },
    });

    // 添加点击冲量
    const impulse = 20;
    item.velocity.x += (Math.random() - 0.5) * impulse;
    item.velocity.y += (Math.random() - 0.5) * impulse;

    // 旋转效果
    gsap.to(item, {
        rotation: item.rotation + 360,
        duration: 0.8,
        ease: "back.out(1.7)",
    });

    emit("navigate", item);
}

/**
 * 重置导航位置
 */
function resetNavigation() {
    navigationItems.value.forEach((item, index) => {
        item.isAnimating = false;
        item.isHovered = false;
        item.isMagnetic = false;
        item.velocity = { x: 0, y: 0 };

        gsap.to(item.position, {
            x: item.originalPosition.x,
            y: item.originalPosition.y,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
        });

        gsap.to(item, {
            rotation: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
        });
    });

    magneticInteractions.value = 0;
}

/**
 * 切换连接显示
 */
function toggleConnections() {
    connectionsEnabled.value = !connectionsEnabled.value;

    if (!connectionsEnabled.value) {
        connections.value = [];
    }
}

/**
 * 添加导航项
 */
function addNavItem() {
    const navLabels = ["博客", "作品集", "简历", "服务", "团队"];
    const navIcons = ["📝", "🎨", "📄", "🛠️", "👥"];
    const navColors = ["#ef4444", "#f97316", "#84cc16", "#06b6d4", "#8b5cf6"];

    const randomIndex = Math.floor(Math.random() * navLabels.length);
    const selectedLabel = navLabels[randomIndex] || "默认";
    const selectedIcon = navIcons[randomIndex] || "📄";
    const selectedColor = navColors[randomIndex] || "#3b82f6";

    const newItem = {
        id: `nav-${Date.now()}`,
        label: selectedLabel,
        icon: selectedIcon,
        path: `/${selectedLabel.toLowerCase()}`,
        color: selectedColor,
        position: {
            x: canvasSize.value.width / 2,
            y: canvasSize.value.height / 2,
        },
        originalPosition: {
            x: 150 + navigationItems.value.length * 120,
            y: canvasSize.value.height / 2,
        },
        velocity: { x: 0, y: 0 },
        rotation: 0,
        scale: 0,
        isAnimating: false,
        isHovered: false,
        isMagnetic: false,
        ripple: null,
        backgroundColor: `${selectedColor}20`,
        borderColor: selectedColor,
        glowColor: selectedColor,
        shadowColor: `${selectedColor}40`,
        iconColor: selectedColor,
        textColor: selectedColor,
    };

    navigationItems.value.push(newItem);

    // 动画新项目进入
    gsap.fromTo(
        newItem,
        { scale: 0, rotation: -180 },
        {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
        },
    );

    // 移动到最终位置
    gsap.to(newItem.position, {
        x: newItem.originalPosition.x,
        y: newItem.originalPosition.y,
        duration: 1.0,
        ease: "power2.out",
        delay: 0.3,
    });
}

// 监听配置变化
watch([magneticRange, magneticStrength, dampingFactor], () => {
    // 更新物理配置
});

// 生命周期
onMounted(() => {
    initPhysicsSystem();
});

onBeforeUnmount(() => {
    // 清理动画循环
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    // 清理动画效果
    if (animationEffects) {
        animationEffects.clearAllEffects();
    }
});

// 暴露方法
defineExpose({
    resetNavigation,
    toggleConnections,
    addNavItem,
});
</script>

<style scoped>
.navigation-physics-effect {
    user-select: none;
    -webkit-user-select: none;
}

.nav-item {
    transform-origin: center;
}

.nav-item:hover {
    z-index: 10;
}
</style>
