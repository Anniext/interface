<!-- 奖项物理碰撞动画组件 -->
<template>
    <div
        class="award-collision-effect relative w-full h-full bg-linear-to-br from-gray-900 to-black overflow-hidden">
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
            @mouseup="handleMouseUp" />

        <!-- 奖项 HTML 层 -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                v-for="award in awardsWithPosition"
                :key="award.id"
                :style="{
                    transform: `translate(${award.position.x - 50}px, ${
                        award.position.y - 50
                    }px) rotate(${award.rotation}deg) scale(${award.scale})`,
                    transition: award.isAnimating
                        ? 'none'
                        : 'transform 0.3s ease',
                }"
                class="absolute award-item pointer-events-auto cursor-pointer"
                :class="[
                    'w-20 h-20 rounded-full flex items-center justify-center',
                    'border-4 shadow-2xl transition-all duration-300',
                    award.isShaking ? 'animate-shake' : '',
                    award.isGlowing ? 'animate-glow' : '',
                ]"
                :style="{
                    backgroundColor: award.backgroundColor,
                    borderColor: award.borderColor,
                    boxShadow: award.isGlowing
                        ? `0 0 30px ${award.glowColor}, 0 0 60px ${award.glowColor}40, inset 0 0 20px ${award.glowColor}20`
                        : `0 8px 32px ${award.shadowColor}`,
                }"
                @click="handleAwardClick(award)">
                <!-- 奖项图标 -->
                <div class="relative">
                    <!-- 主图标 -->
                    <div
                        class="text-3xl font-bold"
                        :style="{ color: award.iconColor }">
                        {{ award.icon }}
                    </div>

                    <!-- 等级指示器 -->
                    <div
                        class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :style="{
                            backgroundColor: award.levelColor,
                            color: award.levelTextColor,
                        }">
                        {{ award.levelText }}
                    </div>
                </div>

                <!-- 火花效果 -->
                <div v-if="award.sparkles.length > 0" class="absolute inset-0">
                    <div
                        v-for="sparkle in award.sparkles"
                        :key="sparkle.id"
                        :style="{
                            transform: `translate(${sparkle.x}px, ${sparkle.y}px) rotate(${sparkle.rotation}deg) scale(${sparkle.scale})`,
                            opacity: sparkle.opacity,
                            backgroundColor: sparkle.color,
                        }"
                        class="absolute w-2 h-2 pointer-events-none">
                        ✨
                    </div>
                </div>
            </div>
        </div>

        <!-- 碰撞波纹效果 -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                v-for="ripple in ripples"
                :key="ripple.id"
                :style="{
                    transform: `translate(${ripple.x - ripple.radius}px, ${
                        ripple.y - ripple.radius
                    }px)`,
                    width: `${ripple.radius * 2}px`,
                    height: `${ripple.radius * 2}px`,
                    opacity: ripple.opacity,
                    borderColor: ripple.color,
                }"
                class="absolute rounded-full border-2" />
        </div>

        <!-- 控制面板 -->
        <div
            v-if="showControls"
            class="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm">
            <h3 class="text-sm font-bold mb-3 text-yellow-400">
                🏆 奖项碰撞控制
            </h3>
            <div class="space-y-3">
                <button
                    @click="startCollisionDemo"
                    :disabled="isDemoRunning"
                    class="w-full px-3 py-2 bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 rounded text-sm font-medium transition-all">
                    {{ isDemoRunning ? "演示中..." : "开始碰撞演示" }}
                </button>

                <button
                    @click="resetAwards"
                    class="w-full px-3 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded text-sm font-medium transition-all">
                    重置位置
                </button>

                <button
                    @click="addRandomAward"
                    class="w-full px-3 py-2 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded text-sm font-medium transition-all">
                    添加奖项
                </button>

                <div class="pt-3 border-t border-gray-600">
                    <label class="block text-xs mb-2 text-gray-300"
                        >碰撞强度</label
                    >
                    <input
                        v-model.number="collisionIntensity"
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        class="w-full accent-yellow-500" />
                    <span class="text-xs text-gray-400">{{
                        collisionIntensity
                    }}</span>
                </div>

                <div>
                    <label class="block text-xs mb-2 text-gray-300"
                        >火花数量</label
                    >
                    <input
                        v-model.number="sparkleCount"
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        class="w-full accent-yellow-500" />
                    <span class="text-xs text-gray-400">{{
                        sparkleCount
                    }}</span>
                </div>

                <div class="flex items-center space-x-2">
                    <input
                        v-model="soundEnabled"
                        type="checkbox"
                        id="sound-toggle"
                        class="accent-yellow-500" />
                    <label for="sound-toggle" class="text-xs text-gray-300"
                        >启用音效</label
                    >
                </div>
            </div>
        </div>

        <!-- 统计信息 -->
        <div
            v-if="showStats"
            class="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
            <div class="space-y-1">
                <div>总碰撞次数: {{ collisionStats.totalCollisions }}</div>
                <div>活跃奖项: {{ awardsWithPosition.length }}</div>
                <div>火花粒子: {{ totalSparkles }}</div>
                <div>波纹效果: {{ ripples.length }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { gsap } from "gsap";
import { PhysicsAnimationEffects } from "@/utils/physics/SimplePhysicsAnimationEffects";
import type { IAwardCollisionConfig } from "@/utils/physics/SimplePhysicsAnimationEffects";

// Props
interface Props {
    /** 奖项数据 */
    awards?: Array<{
        id: string;
        title: string;
        level: "gold" | "silver" | "bronze" | "special";
        icon: string;
        year: string;
        organization?: string;
    }>;
    /** 画布尺寸 */
    width?: number;
    height?: number;
    /** 是否显示控制面板 */
    showControls?: boolean;
    /** 是否显示统计信息 */
    showStats?: boolean;
    /** 自动开始演示 */
    autoStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    awards: () => [
        {
            id: "best-developer-2023",
            title: "最佳开发者奖",
            level: "gold",
            icon: "🏆",
            year: "2023",
            organization: "Tech Awards",
        },
        {
            id: "innovation-award-2022",
            title: "创新奖",
            level: "silver",
            icon: "💡",
            year: "2022",
            organization: "Innovation Hub",
        },
        {
            id: "team-player-2022",
            title: "团队合作奖",
            level: "bronze",
            icon: "🤝",
            year: "2022",
            organization: "Company Awards",
        },
        {
            id: "hackathon-winner-2021",
            title: "黑客马拉松冠军",
            level: "special",
            icon: "⚡",
            year: "2021",
            organization: "Global Hackathon",
        },
    ],
    width: 800,
    height: 600,
    showControls: false,
    showStats: false,
    autoStart: false,
});

// Emits
interface Emits {
    (e: "awardClicked", award: any): void;
    (e: "collision", event: any): void;
    (e: "demoComplete"): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const pixelRatio = window.devicePixelRatio || 1;
const isDemoRunning = ref(false);
const collisionIntensity = ref(1.0);
const sparkleCount = ref(15);
const soundEnabled = ref(true);

// 画布尺寸
const canvasSize = computed(() => ({
    width: props.width,
    height: props.height,
}));

// 奖项位置和状态
const awardsWithPosition = ref(
    props.awards.map((award, index) => {
        const angle = (index / props.awards.length) * Math.PI * 2;
        const radius =
            Math.min(canvasSize.value.width, canvasSize.value.height) * 0.25;
        const centerX = canvasSize.value.width / 2;
        const centerY = canvasSize.value.height / 2;

        return {
            ...award,
            position: {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
            },
            rotation: 0,
            scale: 1,
            isAnimating: false,
            isShaking: false,
            isGlowing: false,
            sparkles: [] as Array<{
                id: string;
                x: number;
                y: number;
                rotation: number;
                scale: number;
                opacity: number;
                color: string;
            }>,
            // 样式属性
            ...getAwardStyles(award.level),
        };
    }),
);

// 波纹效果
const ripples = ref<
    Array<{
        id: string;
        x: number;
        y: number;
        radius: number;
        opacity: number;
        color: string;
    }>
>([]);

// 碰撞统计
const collisionStats = reactive({
    totalCollisions: 0,
    lastCollisionTime: 0,
});

// 计算属性
const totalSparkles = computed(() =>
    awardsWithPosition.value.reduce(
        (total, award) => total + award.sparkles.length,
        0,
    ),
);

// 动画效果系统
let animationEffects: PhysicsAnimationEffects | null = null;
let currentEffectId: string | null = null;

/**
 * 获取奖项样式
 */
function getAwardStyles(level: string) {
    switch (level) {
        case "gold":
            return {
                backgroundColor: "linear-gradient(135deg, #ffd700, #ffed4e)",
                borderColor: "#b8860b",
                glowColor: "#ffd700",
                shadowColor: "#ffd70080",
                iconColor: "#b8860b",
                levelColor: "#ff6b35",
                levelTextColor: "#ffffff",
                levelText: "1",
            };
        case "silver":
            return {
                backgroundColor: "linear-gradient(135deg, #c0c0c0, #e8e8e8)",
                borderColor: "#808080",
                glowColor: "#c0c0c0",
                shadowColor: "#c0c0c080",
                iconColor: "#606060",
                levelColor: "#6366f1",
                levelTextColor: "#ffffff",
                levelText: "2",
            };
        case "bronze":
            return {
                backgroundColor: "linear-gradient(135deg, #cd7f32, #daa520)",
                borderColor: "#8b4513",
                glowColor: "#cd7f32",
                shadowColor: "#cd7f3280",
                iconColor: "#654321",
                levelColor: "#f59e0b",
                levelTextColor: "#ffffff",
                levelText: "3",
            };
        default: // special
            return {
                backgroundColor: "linear-gradient(135deg, #9333ea, #c084fc)",
                borderColor: "#7c3aed",
                glowColor: "#9333ea",
                shadowColor: "#9333ea80",
                iconColor: "#581c87",
                levelColor: "#ec4899",
                levelTextColor: "#ffffff",
                levelText: "★",
            };
    }
}

/**
 * 初始化物理系统
 */
function initPhysicsSystem() {
    if (!canvasRef.value) return;

    // 使用简化的动画效果系统
    animationEffects = new PhysicsAnimationEffects(canvasRef.value);

    console.log("奖项碰撞动画系统初始化完成");
}

/**
 * 开始碰撞演示
 */
function startCollisionDemo() {
    if (!animationEffects || isDemoRunning.value) return;

    isDemoRunning.value = true;

    // 配置碰撞效果
    const config: IAwardCollisionConfig = {
        awards: props.awards,
        collision: {
            sparkleCount: sparkleCount.value,
            shakeIntensity: collisionIntensity.value * 10,
            glowDuration: 1000,
            soundEnabled: soundEnabled.value,
        },
        physics: {
            restitution: 0.8,
            friction: 0.1,
            density: 1.0,
        },
    };

    // 创建碰撞效果
    currentEffectId = animationEffects.createAwardCollisionEffect(config);

    // 给奖项添加随机初始速度
    awardsWithPosition.value.forEach((award, index) => {
        award.isAnimating = true;

        setTimeout(() => {
            // 随机方向的初始冲量
            const angle = Math.random() * Math.PI * 2;
            const force = 100 + Math.random() * 200;

            gsap.to(award.position, {
                x: award.position.x + Math.cos(angle) * force,
                y: award.position.y + Math.sin(angle) * force,
                duration: 0.1,
                ease: "none",
            });

            // 添加旋转
            gsap.to(award, {
                rotation: award.rotation + (Math.random() - 0.5) * 720,
                duration: 2,
                ease: "power2.out",
            });
        }, index * 100);
    });

    // 模拟碰撞检测和效果
    simulateCollisions();

    // 设置演示完成
    setTimeout(() => {
        isDemoRunning.value = false;
        emit("demoComplete");
    }, 5000);
}

/**
 * 模拟碰撞效果
 */
function simulateCollisions() {
    const checkCollisions = () => {
        if (!isDemoRunning.value) return;

        for (let i = 0; i < awardsWithPosition.value.length; i++) {
            for (let j = i + 1; j < awardsWithPosition.value.length; j++) {
                const awardA = awardsWithPosition.value[i];
                const awardB = awardsWithPosition.value[j];

                const distance = Math.sqrt(
                    Math.pow(awardA.position.x - awardB.position.x, 2) +
                        Math.pow(awardA.position.y - awardB.position.y, 2),
                );

                if (distance < 100) {
                    // 碰撞检测阈值
                    handleCollision(awardA, awardB);
                }
            }
        }

        setTimeout(checkCollisions, 100);
    };

    checkCollisions();
}

/**
 * 处理碰撞
 */
function handleCollision(awardA: any, awardB: any) {
    if (!awardA || !awardB) return;

    // 更新统计
    collisionStats.totalCollisions++;
    collisionStats.lastCollisionTime = Date.now();

    // 计算碰撞点
    const collisionPoint = {
        x: (awardA.position.x + awardB.position.x) / 2,
        y: (awardA.position.y + awardB.position.y) / 2,
    };

    // 创建波纹效果
    createRippleEffect(collisionPoint);

    // 添加震动效果
    addShakeEffect(awardA);
    addShakeEffect(awardB);

    // 创建火花效果
    createSparkleEffect(awardA, collisionPoint);
    createSparkleEffect(awardB, collisionPoint);

    // 播放碰撞音效
    if (soundEnabled.value) {
        playCollisionSound();
    }

    // 发射碰撞事件
    emit("collision", {
        awardA,
        awardB,
        collisionPoint,
        intensity: collisionIntensity.value,
    });
}

/**
 * 创建波纹效果
 */
function createRippleEffect(position: { x: number; y: number }) {
    const ripple = {
        id: `ripple-${Date.now()}-${Math.random()}`,
        x: position.x,
        y: position.y,
        radius: 0,
        opacity: 1,
        color: "#ffd700",
    };

    ripples.value.push(ripple);

    gsap.to(ripple, {
        radius: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
            const index = ripples.value.findIndex((r) => r.id === ripple.id);
            if (index > -1) {
                ripples.value.splice(index, 1);
            }
        },
    });
}

/**
 * 添加震动效果
 */
function addShakeEffect(award: any) {
    award.isShaking = true;

    const originalPosition = { ...award.position };
    const shakeIntensity = collisionIntensity.value * 5;

    gsap.to(award.position, {
        x: originalPosition.x + (Math.random() - 0.5) * shakeIntensity,
        y: originalPosition.y + (Math.random() - 0.5) * shakeIntensity,
        duration: 0.05,
        repeat: 10,
        yoyo: true,
        ease: "power2.out",
        onComplete: () => {
            award.isShaking = false;
            award.position.x = originalPosition.x;
            award.position.y = originalPosition.y;
        },
    });
}

/**
 * 创建火花效果
 */
function createSparkleEffect(
    award: any,
    collisionPoint: { x: number; y: number },
) {
    award.isGlowing = true;

    // 创建火花粒子
    for (let i = 0; i < sparkleCount.value; i++) {
        const sparkle = {
            id: `sparkle-${Date.now()}-${i}`,
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 1,
            color: award.glowColor,
        };

        award.sparkles.push(sparkle);

        // 动画火花
        gsap.to(sparkle, {
            x: sparkle.x + (Math.random() - 0.5) * 100,
            y: sparkle.y + (Math.random() - 0.5) * 100,
            rotation: sparkle.rotation + 360,
            scale: 0,
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            onComplete: () => {
                const index = award.sparkles.findIndex(
                    (s: any) => s.id === sparkle.id,
                );
                if (index > -1) {
                    award.sparkles.splice(index, 1);
                }
            },
        });
    }

    // 发光效果
    setTimeout(() => {
        award.isGlowing = false;
    }, 1000);
}

/**
 * 播放碰撞音效
 */
function playCollisionSound() {
    // 这里可以集成 Web Audio API 或使用 HTML5 Audio
    console.log("播放奖项碰撞音效");

    // 简单的音频反馈（如果浏览器支持）
    if ("AudioContext" in window) {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            200,
            audioContext.currentTime + 0.1,
        );

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

/**
 * 重置奖项位置
 */
function resetAwards() {
    if (isDemoRunning.value) return;

    awardsWithPosition.value.forEach((award, index) => {
        const angle = (index / awardsWithPosition.value.length) * Math.PI * 2;
        const radius =
            Math.min(canvasSize.value.width, canvasSize.value.height) * 0.25;
        const centerX = canvasSize.value.width / 2;
        const centerY = canvasSize.value.height / 2;

        award.isAnimating = false;
        award.isShaking = false;
        award.isGlowing = false;
        award.sparkles = [];

        gsap.to(award.position, {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
        });

        gsap.to(award, {
            rotation: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
        });
    });

    // 清理效果
    ripples.value = [];
    collisionStats.totalCollisions = 0;

    if (animationEffects && currentEffectId) {
        animationEffects.removeEffect(currentEffectId);
        currentEffectId = null;
    }
}

/**
 * 添加随机奖项
 */
function addRandomAward() {
    const awardTypes = [
        { title: "编程大赛冠军", icon: "🥇", level: "gold" },
        { title: "最佳创意奖", icon: "💎", level: "silver" },
        { title: "团队协作奖", icon: "🤝", level: "bronze" },
        { title: "技术突破奖", icon: "🚀", level: "special" },
        { title: "用户体验奖", icon: "❤️", level: "special" },
    ];

    const randomType =
        awardTypes[Math.floor(Math.random() * awardTypes.length)];
    if (!randomType) return;

    const newAward = {
        id: `award-${Date.now()}`,
        title: randomType.title,
        level: randomType.level as "gold" | "silver" | "bronze" | "special",
        icon: randomType.icon,
        year: new Date().getFullYear().toString(),
        organization: "Random Awards",
        position: {
            x: canvasSize.value.width / 2,
            y: canvasSize.value.height / 2,
        },
        rotation: 0,
        scale: 0,
        isAnimating: false,
        isShaking: false,
        isGlowing: false,
        sparkles: [],
        ...getAwardStyles(randomType.level),
    };

    awardsWithPosition.value.push(newAward);

    // 动画新奖项进入
    gsap.fromTo(
        newAward,
        { scale: 0, rotation: -180 },
        {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
        },
    );

    // 随机位置
    gsap.to(newAward.position, {
        x: 100 + Math.random() * (canvasSize.value.width - 200),
        y: 100 + Math.random() * (canvasSize.value.height - 200),
        duration: 1.0,
        ease: "power2.out",
        delay: 0.3,
    });
}

/**
 * 处理奖项点击
 */
function handleAwardClick(award: any) {
    if (award.isAnimating) return;

    // 创建点击效果
    award.isGlowing = true;
    award.scale = 1.2;

    gsap.to(award, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
    });

    setTimeout(() => {
        award.isGlowing = false;
    }, 500);

    // 创建点击火花
    createSparkleEffect(award, award.position);

    emit("awardClicked", award);
}

/**
 * 处理鼠标按下
 */
function handleMouseDown(event: MouseEvent) {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (!rect) return;

    const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };

    // 创建鼠标点击波纹
    createRippleEffect(mousePos);
}

/**
 * 处理鼠标移动
 */
function handleMouseMove() {
    // 可以添加鼠标跟随效果
}

/**
 * 处理鼠标释放
 */
function handleMouseUp() {
    // 鼠标释放处理
}

// 生命周期
onMounted(() => {
    initPhysicsSystem();

    if (props.autoStart) {
        setTimeout(() => {
            startCollisionDemo();
        }, 1000);
    }
});

onBeforeUnmount(() => {
    // 清理动画效果
    if (animationEffects) {
        animationEffects.clearAllEffects();
    }
});

// 暴露方法
defineExpose({
    startCollisionDemo,
    resetAwards,
    addRandomAward,
});
</script>

<style scoped>
.award-collision-effect {
    user-select: none;
    -webkit-user-select: none;
}

.award-item {
    transform-origin: center;
}

.award-item:hover {
    transform: scale(1.1);
}

@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-2px);
    }
    75% {
        transform: translateX(2px);
    }
}

@keyframes glow {
    0%,
    100% {
        filter: brightness(1) drop-shadow(0 0 5px currentColor);
    }
    50% {
        filter: brightness(1.3) drop-shadow(0 0 15px currentColor);
    }
}

.animate-shake {
    animation: shake 0.1s ease-in-out infinite;
}

.animate-glow {
    animation: glow 0.5s ease-in-out infinite;
}
</style>
