<!-- 物理驱动的页面过渡效果组件 -->
<template>
    <div class="page-transition-effect fixed inset-0 z-50 pointer-events-none">
        <!-- Canvas 渲染层 -->
        <canvas
            ref="canvasRef"
            :width="canvasSize.width * pixelRatio"
            :height="canvasSize.height * pixelRatio"
            :style="{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
            }"
            class="absolute inset-0" />

        <!-- 过渡遮罩层 -->
        <div
            ref="overlayRef"
            class="absolute inset-0 transition-opacity duration-300"
            :style="{
                background: overlayGradient,
                opacity: overlayOpacity,
                mixBlendMode: blendMode as any,
            }" />

        <!-- 粒子容器 -->
        <div class="absolute inset-0">
            <div
                v-for="particle in particles"
                :key="particle.id"
                :style="{
                    transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                    opacity: particle.opacity,
                }"
                class="absolute pointer-events-none"
                :style="{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    borderRadius: particle.shape === 'circle' ? '50%' : '0',
                }" />
        </div>

        <!-- 液体效果 SVG -->
        <svg
            v-if="transitionType === 'liquid'"
            class="absolute inset-0 w-full h-full"
            :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`">
            <defs>
                <filter id="liquidFilter">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                    <feColorMatrix
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
                </filter>
                <linearGradient
                    id="liquidGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%">
                    <stop
                        offset="0%"
                        :style="`stop-color:${liquidColors[0]};stop-opacity:0.8`" />
                    <stop
                        offset="50%"
                        :style="`stop-color:${liquidColors[1]};stop-opacity:0.6`" />
                    <stop
                        offset="100%"
                        :style="`stop-color:${liquidColors[2]};stop-opacity:0.8`" />
                </linearGradient>
            </defs>

            <path
                v-for="blob in liquidBlobs"
                :key="blob.id"
                :d="blob.path"
                fill="url(#liquidGradient)"
                filter="url(#liquidFilter)"
                :opacity="blob.opacity" />
        </svg>

        <!-- 变形效果 SVG -->
        <svg
            v-if="transitionType === 'morph'"
            class="absolute inset-0 w-full h-full"
            :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`">
            <defs>
                <linearGradient
                    id="morphGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop
                        offset="0%"
                        :style="`stop-color:${morphColors[0]};stop-opacity:0.9`" />
                    <stop
                        offset="100%"
                        :style="`stop-color:${morphColors[1]};stop-opacity:0.9`" />
                </linearGradient>
            </defs>

            <path
                :d="morphPath"
                fill="url(#morphGradient)"
                :opacity="morphOpacity" />
        </svg>

        <!-- 调试信息 -->
        <div
            v-if="showDebug"
            class="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
            <div class="space-y-1">
                <div>过渡类型: {{ transitionType }}</div>
                <div>进度: {{ Math.round(progress * 100) }}%</div>
                <div>粒子数: {{ particles.length }}</div>
                <div>状态: {{ isTransitioning ? "过渡中" : "空闲" }}</div>
                <div>持续时间: {{ duration }}ms</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { gsap } from "gsap";
import { PhysicsAnimationEffects } from "@/utils/physics/SimplePhysicsAnimationEffects";
import type { IPageTransitionConfig } from "@/utils/physics/SimplePhysicsAnimationEffects";

// Props
interface Props {
    /** 过渡类型 */
    type?: "slide" | "fade" | "morph" | "particle" | "liquid";
    /** 持续时间 */
    duration?: number;
    /** 是否显示调试信息 */
    showDebug?: boolean;
    /** 颜色主题 */
    colorTheme?: string[];
    /** 混合模式 */
    blendMode?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "particle",
    duration: 1200,
    showDebug: false,
    colorTheme: () => ["#3b82f6", "#8b5cf6", "#06b6d4"],
    blendMode: "normal",
});

// Emits
interface Emits {
    (e: "transitionStart"): void;
    (e: "transitionProgress", progress: number): void;
    (e: "transitionComplete"): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const overlayRef = ref<HTMLDivElement>();
const pixelRatio = window.devicePixelRatio || 1;
const isTransitioning = ref(false);
const progress = ref(0);
const transitionType = ref(props.type);
const duration = ref(props.duration);

// 画布尺寸
const canvasSize = computed(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
}));

// 过渡效果状态
const overlayOpacity = ref(0);
const overlayGradient = computed(() => {
    const colors = props.colorTheme;
    return `linear-gradient(135deg, ${colors[0]}40, ${colors[1]}60, ${colors[2]}40)`;
});

// 粒子系统
const particles = ref<
    Array<{
        id: string;
        x: number;
        y: number;
        scale: number;
        rotation: number;
        opacity: number;
        size: number;
        color: string;
        shape: "circle" | "square";
        velocity: { x: number; y: number };
        life: number;
        maxLife: number;
    }>
>([]);

// 液体效果
const liquidBlobs = ref<
    Array<{
        id: string;
        path: string;
        opacity: number;
        scale: number;
    }>
>([]);

const liquidColors = computed(() => props.colorTheme);

// 变形效果
const morphPath = ref("");
const morphOpacity = ref(0);
const morphColors = computed(() => props.colorTheme);

// 动画效果系统
let animationEffects: PhysicsAnimationEffects | null = null;
let animationFrame: number = 0;
let transitionTimeline: gsap.core.Timeline | null = null;

/**
 * 初始化物理系统
 */
function initPhysicsSystem() {
    if (!canvasRef.value) return;

    // 使用简化的动画效果系统
    animationEffects = new PhysicsAnimationEffects(canvasRef.value);

    console.log("页面过渡动画系统初始化完成");
}

/**
 * 开始页面过渡
 */
async function startTransition(
    config?: Partial<IPageTransitionConfig>,
): Promise<void> {
    if (isTransitioning.value) return;

    isTransitioning.value = true;
    progress.value = 0;
    emit("transitionStart");

    const transitionConfig: IPageTransitionConfig = {
        type: transitionType.value,
        physics: {
            velocity: 200,
            friction: 0.8,
            elasticity: 0.6,
            turbulence: 50,
        },
        visual: {
            particleCount: 100,
            trailLength: 20,
            colorGradient: props.colorTheme,
            blendMode: props.blendMode,
        },
        ...config,
    };

    try {
        switch (transitionType.value) {
            case "slide":
                await executeSlideTransition();
                break;
            case "fade":
                await executeFadeTransition();
                break;
            case "morph":
                await executeMorphTransition();
                break;
            case "particle":
                await executeParticleTransition(transitionConfig);
                break;
            case "liquid":
                await executeLiquidTransition();
                break;
        }
    } finally {
        isTransitioning.value = false;
        progress.value = 1;
        emit("transitionComplete");
    }
}

/**
 * 执行滑动过渡
 */
async function executeSlideTransition(): Promise<void> {
    return new Promise((resolve) => {
        transitionTimeline = gsap.timeline({
            onUpdate: () => {
                progress.value = transitionTimeline!.progress();
                emit("transitionProgress", progress.value);
            },
            onComplete: resolve,
        });

        // 创建滑动遮罩
        overlayOpacity.value = 0;

        transitionTimeline
            .to(overlayRef.value!, {
                x: "0%",
                duration: duration.value / 2000,
                ease: "power2.inOut",
            })
            .to(
                overlayOpacity,
                {
                    value: 1,
                    duration: duration.value / 4000,
                },
                0,
            )
            .to(
                overlayOpacity,
                {
                    value: 0,
                    duration: duration.value / 4000,
                },
                duration.value / 2000,
            )
            .to(
                overlayRef.value!,
                {
                    x: "100%",
                    duration: duration.value / 2000,
                    ease: "power2.inOut",
                },
                duration.value / 2000,
            );
    });
}

/**
 * 执行淡入淡出过渡
 */
async function executeFadeTransition(): Promise<void> {
    return new Promise((resolve) => {
        transitionTimeline = gsap.timeline({
            onUpdate: () => {
                progress.value = transitionTimeline!.progress();
                emit("transitionProgress", progress.value);
            },
            onComplete: resolve,
        });

        transitionTimeline
            .to(overlayOpacity, {
                value: 1,
                duration: duration.value / 2000,
                ease: "power2.out",
            })
            .to(overlayOpacity, {
                value: 0,
                duration: duration.value / 2000,
                ease: "power2.in",
            });
    });
}

/**
 * 执行变形过渡
 */
async function executeMorphTransition(): Promise<void> {
    return new Promise((resolve) => {
        // 创建变形路径
        const startPath = createMorphPath(0);
        const endPath = createMorphPath(1);

        morphPath.value = startPath;
        morphOpacity.value = 0;

        transitionTimeline = gsap.timeline({
            onUpdate: () => {
                progress.value = transitionTimeline!.progress();
                emit("transitionProgress", progress.value);

                // 更新变形路径
                const currentProgress = progress.value;
                morphPath.value = interpolatePath(
                    startPath,
                    endPath,
                    currentProgress,
                );
            },
            onComplete: resolve,
        });

        transitionTimeline
            .to(morphOpacity, {
                value: 1,
                duration: duration.value / 4000,
                ease: "power2.out",
            })
            .to(
                morphOpacity,
                {
                    value: 0,
                    duration: duration.value / 4000,
                    ease: "power2.in",
                },
                duration.value / 1000 - duration.value / 4000,
            );
    });
}

/**
 * 执行粒子过渡
 */
async function executeParticleTransition(
    config?: IPageTransitionConfig,
): Promise<void> {
    return new Promise((resolve) => {
        // 创建粒子
        createTransitionParticles(config?.visual?.particleCount || 100);

        transitionTimeline = gsap.timeline({
            onUpdate: () => {
                progress.value = transitionTimeline!.progress();
                emit("transitionProgress", progress.value);
                updateParticles();
            },
            onComplete: () => {
                particles.value = [];
                resolve();
            },
        });

        // 粒子动画阶段
        transitionTimeline.to(
            {},
            {
                duration: duration.value / 1000,
                ease: "none",
            },
        );

        // 启动粒子物理模拟
        startParticlePhysics();
    });
}

/**
 * 执行液体过渡
 */
async function executeLiquidTransition(): Promise<void> {
    return new Promise((resolve) => {
        // 创建液体blob
        createLiquidBlobs();

        transitionTimeline = gsap.timeline({
            onUpdate: () => {
                progress.value = transitionTimeline!.progress();
                emit("transitionProgress", progress.value);
                updateLiquidBlobs();
            },
            onComplete: () => {
                liquidBlobs.value = [];
                resolve();
            },
        });

        transitionTimeline.to(
            {},
            {
                duration: duration.value / 1000,
                ease: "power2.inOut",
            },
        );
    });
}

/**
 * 创建过渡粒子
 */
function createTransitionParticles(count: number) {
    particles.value = [];

    for (let i = 0; i < count; i++) {
        const particle = {
            id: `particle-${i}`,
            x: Math.random() * canvasSize.value.width,
            y: Math.random() * canvasSize.value.height,
            scale: 0.5 + Math.random() * 0.5,
            rotation: Math.random() * 360,
            opacity: 0.8 + Math.random() * 0.2,
            size: 4 + Math.random() * 8,
            color:
                props.colorTheme[
                    Math.floor(Math.random() * props.colorTheme.length)
                ] || "#3b82f6",
            shape:
                Math.random() > 0.5
                    ? "circle"
                    : ("square" as "circle" | "square"),
            velocity: {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
            },
            life: 1.0,
            maxLife: 1.0,
        };

        particles.value.push(particle);
    }
}

/**
 * 启动粒子物理模拟
 */
function startParticlePhysics() {
    particles.value.forEach((particle) => {
        // 简化版本：不创建实际物理体，只是记录粒子信息
        console.log("创建粒子:", particle.id);
    });
}

/**
 * 更新粒子状态
 */
function updateParticles() {
    particles.value.forEach((particle) => {
        // 更新位置
        particle.x += particle.velocity.x * 0.016;
        particle.y += particle.velocity.y * 0.016;

        // 应用重力
        particle.velocity.y += 300 * 0.016;

        // 应用阻力
        particle.velocity.x *= 0.99;
        particle.velocity.y *= 0.99;

        // 边界检测
        if (particle.x < 0 || particle.x > canvasSize.value.width) {
            particle.velocity.x *= -0.8;
            particle.x = Math.max(
                0,
                Math.min(canvasSize.value.width, particle.x),
            );
        }
        if (particle.y < 0 || particle.y > canvasSize.value.height) {
            particle.velocity.y *= -0.8;
            particle.y = Math.max(
                0,
                Math.min(canvasSize.value.height, particle.y),
            );
        }

        // 更新生命周期
        particle.life -= 0.016 / (duration.value / 1000);
        particle.opacity = particle.life;
        particle.scale = particle.life * 0.5 + 0.5;

        // 旋转
        particle.rotation += particle.velocity.x * 0.1;
    });

    // 移除死亡粒子
    particles.value = particles.value.filter((particle) => particle.life > 0);
}

/**
 * 创建液体blob
 */
function createLiquidBlobs() {
    liquidBlobs.value = [];

    for (let i = 0; i < 8; i++) {
        const blob = {
            id: `blob-${i}`,
            path: createBlobPath(
                Math.random() * canvasSize.value.width,
                Math.random() * canvasSize.value.height,
                50 + Math.random() * 100,
            ),
            opacity: 0.6 + Math.random() * 0.4,
            scale: 0.5 + Math.random() * 0.5,
        };

        liquidBlobs.value.push(blob);
    }
}

/**
 * 更新液体blob
 */
function updateLiquidBlobs() {
    liquidBlobs.value.forEach((blob, index) => {
        const time = progress.value * Math.PI * 2 + index;
        const x = canvasSize.value.width / 2 + Math.sin(time) * 200;
        const y = canvasSize.value.height / 2 + Math.cos(time * 0.7) * 150;
        const radius = 50 + Math.sin(time * 2) * 30;

        blob.path = createBlobPath(x, y, radius);
        blob.opacity = 0.8 - progress.value * 0.3;
    });
}

/**
 * 创建blob路径
 */
function createBlobPath(x: number, y: number, radius: number): string {
    const points = 8;
    let path = "";

    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const variation = 0.3 + Math.random() * 0.4;
        const currentRadius = radius * variation;
        const px = x + Math.cos(angle) * currentRadius;
        const py = y + Math.sin(angle) * currentRadius;

        if (i === 0) {
            path += `M ${px} ${py}`;
        } else {
            const prevAngle = ((i - 1) / points) * Math.PI * 2;
            const prevRadius = radius * (0.3 + Math.random() * 0.4);
            const cpx1 = x + Math.cos(prevAngle + 0.3) * prevRadius;
            const cpy1 = y + Math.sin(prevAngle + 0.3) * prevRadius;
            const cpx2 = x + Math.cos(angle - 0.3) * currentRadius;
            const cpy2 = y + Math.sin(angle - 0.3) * currentRadius;

            path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${px} ${py}`;
        }
    }

    path += " Z";
    return path;
}

/**
 * 创建变形路径
 */
function createMorphPath(progress: number): string {
    const centerX = canvasSize.value.width / 2;
    const centerY = canvasSize.value.height / 2;
    const baseRadius =
        Math.min(canvasSize.value.width, canvasSize.value.height) * 0.3;

    if (progress === 0) {
        // 起始形状：圆形
        return `M ${
            centerX + baseRadius
        } ${centerY} A ${baseRadius} ${baseRadius} 0 1 1 ${
            centerX - baseRadius
        } ${centerY} A ${baseRadius} ${baseRadius} 0 1 1 ${
            centerX + baseRadius
        } ${centerY}`;
    } else {
        // 结束形状：矩形
        const width = baseRadius * 2;
        const height = baseRadius * 1.5;
        return `M ${centerX - width / 2} ${centerY - height / 2} L ${
            centerX + width / 2
        } ${centerY - height / 2} L ${centerX + width / 2} ${
            centerY + height / 2
        } L ${centerX - width / 2} ${centerY + height / 2} Z`;
    }
}

/**
 * 插值路径
 */
function interpolatePath(
    startPath: string,
    endPath: string,
    progress: number,
): string {
    // 简化版本的路径插值
    // 实际实现需要更复杂的SVG路径插值算法
    return progress < 0.5 ? startPath : endPath;
}

/**
 * 停止过渡
 */
function stopTransition() {
    if (transitionTimeline) {
        transitionTimeline.kill();
        transitionTimeline = null;
    }

    isTransitioning.value = false;
    progress.value = 0;
    overlayOpacity.value = 0;
    particles.value = [];
    liquidBlobs.value = [];
    morphOpacity.value = 0;

    // 清理简化版本
    console.log("清理过渡效果");
}

/**
 * 设置过渡类型
 */
function setTransitionType(type: typeof transitionType.value) {
    if (!isTransitioning.value) {
        transitionType.value = type;
    }
}

/**
 * 设置持续时间
 */
function setDuration(newDuration: number) {
    if (!isTransitioning.value) {
        duration.value = newDuration;
    }
}

// 生命周期
onMounted(() => {
    initPhysicsSystem();
});

onBeforeUnmount(() => {
    stopTransition();

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    if (animationEffects) {
        animationEffects.clearAllEffects();
    }
});

// 暴露方法
defineExpose({
    startTransition,
    stopTransition,
    setTransitionType,
    setDuration,
    isTransitioning: computed(() => isTransitioning.value),
    progress: computed(() => progress.value),
});
</script>

<style scoped>
.page-transition-effect {
    user-select: none;
    -webkit-user-select: none;
}
</style>
