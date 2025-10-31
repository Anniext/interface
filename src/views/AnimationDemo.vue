<template>
    <div
        class="animation-demo min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <AnimationController :debug-mode="debugMode" ref="animationController">
            <div class="max-w-4xl mx-auto">
                <!-- 标题区域 -->
                <div class="text-center mb-12">
                    <h1
                        ref="titleRef"
                        class="text-4xl font-bold text-white mb-4 opacity-0">
                        GSAP 动画系统演示
                    </h1>
                    <p
                        ref="subtitleRef"
                        class="text-xl text-gray-300 opacity-0">
                        展示动画控制器和时间轴管理功能
                    </p>
                </div>

                <!-- 控制面板 -->
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
                    <div class="flex flex-wrap gap-4 justify-center">
                        <button
                            @click="playIntroAnimation"
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            播放入场动画
                        </button>
                        <button
                            @click="playCardAnimation"
                            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            播放卡片动画
                        </button>
                        <button
                            @click="playStaggerAnimation"
                            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                            播放交错动画
                        </button>
                        <button
                            @click="resetAllAnimations"
                            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                            重置所有动画
                        </button>
                        <button
                            @click="debugMode = !debugMode"
                            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                            {{ debugMode ? "关闭" : "开启" }}调试
                        </button>
                    </div>
                </div>

                <!-- 演示卡片 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        v-for="(card, index) in demoCards"
                        :key="card.id"
                        :ref="(el) => (cardRefs[index] = el)"
                        class="demo-card bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white opacity-0 transform translate-y-8">
                        <div class="text-2xl mb-2">{{ card.icon }}</div>
                        <h3 class="text-lg font-semibold mb-2">
                            {{ card.title }}
                        </h3>
                        <p class="text-gray-300 text-sm">
                            {{ card.description }}
                        </p>
                    </div>
                </div>

                <!-- 交错动画元素 -->
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-white mb-6">
                        交错动画演示
                    </h2>
                    <div class="flex justify-center gap-2 flex-wrap">
                        <div
                            v-for="i in 12"
                            :key="i"
                            :ref="(el) => (staggerRefs[i - 1] = el)"
                            class="stagger-item w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 transform scale-0"></div>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="mt-12 bg-black/20 rounded-lg p-6">
                    <h3 class="text-xl font-bold text-white mb-4">动画统计</h3>
                    <div
                        class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="text-white">
                            <div class="text-2xl font-bold text-blue-400">
                                {{ stats.activeAnimations }}
                            </div>
                            <div class="text-sm text-gray-300">活跃动画</div>
                        </div>
                        <div class="text-white">
                            <div class="text-2xl font-bold text-green-400">
                                {{ stats.totalAnimations }}
                            </div>
                            <div class="text-sm text-gray-300">总动画数</div>
                        </div>
                        <div class="text-white">
                            <div class="text-2xl font-bold text-yellow-400">
                                {{ stats.averageFPS.toFixed(1) }}
                            </div>
                            <div class="text-sm text-gray-300">平均帧率</div>
                        </div>
                        <div class="text-white">
                            <div class="text-2xl font-bold text-purple-400">
                                {{ stats.memoryUsage.toFixed(1) }}MB
                            </div>
                            <div class="text-sm text-gray-300">内存使用</div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimationController>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from "vue";
import AnimationController from "@/components/animation/AnimationController.vue";
import {
    fadeIn,
    slideInUp,
    scaleIn,
    createStaggerAnimation,
    type IAnimationConfig,
} from "@/utils/animation";
import type { IAnimationManager } from "@/types/animation";

// 响应式数据
const debugMode = ref(false);
const animationController = ref<InstanceType<typeof AnimationController>>();

// 元素引用
const titleRef = ref<HTMLElement>();
const subtitleRef = ref<HTMLElement>();
const cardRefs = ref<HTMLElement[]>([]);
const staggerRefs = ref<HTMLElement[]>([]);

// 演示数据
const demoCards = reactive([
    {
        id: 1,
        icon: "🎨",
        title: "视觉效果",
        description: "丰富的视觉动画效果，提升用户体验",
    },
    {
        id: 2,
        icon: "⚡",
        title: "高性能",
        description: "优化的动画性能，流畅的60fps体验",
    },
    {
        id: 3,
        icon: "🎯",
        title: "精确控制",
        description: "精确的时间轴控制和动画管理",
    },
]);

// 统计信息
const stats = reactive({
    activeAnimations: 0,
    totalAnimations: 0,
    averageFPS: 60,
    memoryUsage: 0,
});

// 动画方法
const playIntroAnimation = () => {
    const animationManager = animationController.value?.animationManager;
    if (!animationManager || !titleRef.value || !subtitleRef.value) return;

    // 创建入场动画时间轴
    const timeline = animationManager.createTimeline("intro-animation");
    const gsapTimeline =
        animationController.value?.animationManager.getTimeline(
            "intro-animation",
        );

    if (gsapTimeline) {
        // 重置元素状态
        titleRef.value.style.opacity = "0";
        subtitleRef.value.style.opacity = "0";

        // 添加动画到时间轴
        fadeIn(titleRef.value, { duration: 1, ease: "power2.out" });

        setTimeout(() => {
            if (subtitleRef.value) {
                slideInUp(subtitleRef.value, {
                    duration: 0.8,
                    ease: "back.out(1.7)",
                });
            }
        }, 500);
    }

    updateStats();
};

const playCardAnimation = () => {
    if (cardRefs.value.length === 0) return;

    // 重置卡片状态
    cardRefs.value.forEach((card) => {
        if (card) {
            card.style.opacity = "0";
            card.style.transform = "translateY(32px)";
        }
    });

    // 创建交错动画
    createStaggerAnimation(
        cardRefs.value.filter(Boolean),
        (target, config) => slideInUp(target, config),
        0.2,
        { duration: 0.6, ease: "back.out(1.7)" },
    );

    updateStats();
};

const playStaggerAnimation = () => {
    if (staggerRefs.value.length === 0) return;

    // 重置元素状态
    staggerRefs.value.forEach((item) => {
        if (item) {
            item.style.opacity = "0";
            item.style.transform = "scale(0)";
        }
    });

    // 创建交错缩放动画
    createStaggerAnimation(
        staggerRefs.value.filter(Boolean),
        (target, config) => scaleIn(target, config),
        0.1,
        { duration: 0.4, ease: "back.out(1.7)" },
    );

    updateStats();
};

const resetAllAnimations = () => {
    const animationManager = animationController.value?.animationManager;
    if (!animationManager) return;

    // 清理所有动画
    animationManager.clear();

    // 重置所有元素状态
    if (titleRef.value) {
        titleRef.value.style.opacity = "0";
    }
    if (subtitleRef.value) {
        subtitleRef.value.style.opacity = "0";
    }

    cardRefs.value.forEach((card) => {
        if (card) {
            card.style.opacity = "0";
            card.style.transform = "translateY(32px)";
        }
    });

    staggerRefs.value.forEach((item) => {
        if (item) {
            item.style.opacity = "0";
            item.style.transform = "scale(0)";
        }
    });

    updateStats();
};

const updateStats = () => {
    const animationManager = animationController.value?.animationManager;
    if (animationManager) {
        const currentStats = animationManager.getStats();
        Object.assign(stats, currentStats);
    }
};

// 定期更新统计信息
onMounted(() => {
    setInterval(updateStats, 1000);
});
</script>

<style scoped>
.demo-card {
    transition: all 0.3s ease;
}

.demo-card:hover {
    transform: translateY(-4px) !important;
    background: rgba(255, 255, 255, 0.15);
}

.stagger-item {
    transition: all 0.3s ease;
}

.stagger-item:hover {
    transform: scale(1.1) !important;
}
</style>
