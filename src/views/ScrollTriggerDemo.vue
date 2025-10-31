<template>
    <div class="scroll-trigger-demo">
        <!-- ScrollTrigger 动画容器 -->
        <ScrollTriggerAnimation
            :show-progress="true"
            progress-type="horizontal"
            progress-position="top"
            progress-color="#3b82f6"
            :debug="debugMode"
            auto-animate-selector=".animate-on-scroll"
            :parallax-config="parallaxConfig"
            ref="scrollTriggerRef">
            <!-- 英雄区域 -->
            <section
                class="hero-section min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                <div class="parallax-bg absolute inset-0 opacity-30">
                    <div class="floating-shapes">
                        <div class="shape shape-1"></div>
                        <div class="shape shape-2"></div>
                        <div class="shape shape-3"></div>
                    </div>
                </div>

                <div class="hero-content text-center text-white z-10">
                    <h1 class="text-6xl font-bold mb-6 animate-on-scroll">
                        ScrollTrigger 演示
                    </h1>
                    <p class="text-xl mb-8 animate-on-scroll">
                        体验强大的滚动触发动画效果
                    </p>
                    <button
                        @click="scrollToNext"
                        class="btn-primary animate-on-scroll">
                        开始探索
                    </button>
                </div>
            </section>

            <!-- 功能展示区域 -->
            <section class="features-section py-20 bg-white">
                <div class="container mx-auto px-4">
                    <h2
                        class="text-4xl font-bold text-center mb-16 animate-on-scroll">
                        核心功能
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div
                            class="feature-card p-6 bg-gray-50 rounded-lg animate-on-scroll">
                            <div class="feature-icon text-4xl mb-4">🎯</div>
                            <h3 class="text-xl font-semibold mb-4">精确触发</h3>
                            <p class="text-gray-600">
                                基于元素位置精确控制动画触发时机
                            </p>
                        </div>

                        <div
                            class="feature-card p-6 bg-gray-50 rounded-lg animate-on-scroll">
                            <div class="feature-icon text-4xl mb-4">⚡</div>
                            <h3 class="text-xl font-semibold mb-4">
                                高性能动画
                            </h3>
                            <p class="text-gray-600">
                                GSAP 驱动的高性能动画效果
                            </p>
                        </div>

                        <div
                            class="feature-card p-6 bg-gray-50 rounded-lg animate-on-scroll">
                            <div class="feature-icon text-4xl mb-4">📱</div>
                            <h3 class="text-xl font-semibold mb-4">
                                响应式设计
                            </h3>
                            <p class="text-gray-600">
                                完美适配各种设备和屏幕尺寸
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 视差滚动区域 -->
            <section
                class="parallax-section min-h-screen relative overflow-hidden">
                <div class="parallax-bg-1 absolute inset-0"></div>
                <div class="parallax-bg-2 absolute inset-0"></div>

                <div
                    class="parallax-content text-center text-white z-10 min-h-screen flex items-center justify-center">
                    <div>
                        <h2 class="text-5xl font-bold mb-6 animate-on-scroll">
                            视差滚动效果
                        </h2>
                        <p class="text-xl animate-on-scroll">
                            创造深度感和沉浸式体验
                        </p>
                    </div>
                </div>
            </section>

            <!-- 批量动画区域 -->
            <section class="batch-animation-section py-20 bg-gray-100">
                <div class="container mx-auto px-4">
                    <h2
                        class="text-4xl font-bold text-center mb-16 animate-on-scroll">
                        批量动画效果
                    </h2>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div
                            v-for="i in 12"
                            :key="i"
                            class="batch-item p-4 bg-white rounded-lg shadow-sm">
                            <div class="item-content text-center">
                                <div class="item-number">
                                    {{ i.toString().padStart(2, "0") }}
                                </div>
                                <div class="item-title">动画项目</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 固定元素区域 -->
            <section class="pin-section min-h-screen bg-black text-white">
                <div class="pin-content">
                    <div class="pinned-element">
                        <h2 class="text-4xl font-bold mb-6">固定元素动效果</h2>
                        <p class="text-lg">元素在滚动过程中保持固定位置</p>
                    </div>
                </div>
            </section>
        </ScrollTriggerAnimation>

        <!-- 调试控制面板 -->
        <div
            class="debug-panel fixed bottom-4 right-4 p-4 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 class="font-bold mb-2">调试控制</h3>
            <div class="space-y-2">
                <label class="flex items-center">
                    <input v-model="debugMode" type="checkbox" class="mr-2" />
                    调试模式
                </label>
                <button
                    @click="refreshAnimations"
                    class="w-full px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    刷新动画
                </button>
                <button
                    @click="toggleAnimations"
                    class="w-full px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                    切换动画
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ScrollTriggerAnimation from "@/components/animation/ScrollTriggerAnimation.vue";

// 组件引用
const scrollTriggerRef = ref();

// 响应式数据
const debugMode = ref(false);
const animationsEnabled = ref(true);

// 视差配置
const parallaxConfig = computed(() => [
    {
        element: ".parallax-bg-1",
        speed: -0.5,
        direction: "vertical" as const,
    },
    {
        element: ".parallax-bg-2",
        speed: 0.3,
        direction: "vertical" as const,
    },
    {
        element: ".floating-shapes",
        speed: 0.2,
        direction: "vertical" as const,
    },
]);

// 方法
const scrollToNext = () => {
    const nextSection = document.querySelector(".features-section");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};

const refreshAnimations = () => {
    if (scrollTriggerRef.value) {
        scrollTriggerRef.value.refresh();
    }
};

const toggleAnimations = () => {
    animationsEnabled.value = !animationsEnabled.value;
    // 这里可以添加禁用/启用动画的逻辑
};

// 生命周期
onMounted(() => {
    // 添加自定义滚动触发器
    setTimeout(() => {
        if (scrollTriggerRef.value) {
            // 添加批量动画
            scrollTriggerRef.value.addBatchAnimation(
                ".batch-item",
                {
                    y: 30,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                },
                {
                    duration: 0.4,
                    stagger: 0.1,
                },
            );

            // 添加固定元素动画
            scrollTriggerRef.value.addPinAnimation({
                trigger: ".pin-section",
                pin: ".pinned-element",
                start: "top top",
                end: "bottom top",
                scrub: true,
                pinSpacing: true,
                markers: debugMode.value,
            });
        }
    }, 200);
});
</script>

<style scoped>
/* 基础样式 */
.scroll-trigger-demo {
    overflow-x: hidden;
}

/* 英雄区域样式 */
.hero-section {
    position: relative;
}

.floating-shapes {
    position: absolute;
    inset: 0;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
}

.shape-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.shape-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 70%;
    animation-delay: 4s;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* 按钮样式 */
.btn-primary {
    padding: 2rem 2rem;
    background-color: #2563eb;
    color: white;
    border-radius: 0.5rem;
    font-weight: bold;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #1d4ed8;
    transform: scale(1.05);
}

/* 功能卡片样式 */
.feature-card {
    transition: all 0.3s ease;
}

.feature-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    background-color: #f3f4f6;
}

.feature-icon {
    color: #2563eb;
}

/* 视差背景样式 */
.parallax-bg-1 {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        45deg,
        rgba(59, 130, 246, 0.1),
        rgba(147, 51, 234, 0.1)
    );
    background-size: 100px 100px;
    background-image: radial-gradient(
        circle at 50px 50px,
        rgba(255, 255, 255, 0.1) 2px,
        transparent 2px
    );
}

.parallax-bg-2 {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        -45deg,
        rgba(236, 72, 153, 0.1),
        rgba(59, 130, 246, 0.1)
    );
    background-size: 150px 150px;
    background-image: radial-gradient(
        circle at 75px 75px,
        rgba(255, 255, 255, 0.05) 3px,
        transparent 3px
    );
}

/* 批量动画项目样式 */
.batch-item {
    text-align: center;
    transition: background-color 0.3s ease;
}

.batch-item:hover {
    background-color: #e5e7eb;
}

.item-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.item-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
}

.item-title {
    font-size: 0.875rem;
    color: #4b5563;
}

/* 固定元素样式 */
.pin-content {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pinned-element {
    text-align: center;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0.5rem;
    backdrop-filter: blur(4px);
}

/* 调试面板样式 */
.debug-panel {
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.9);
    z-index: 1000;
}

.debug-panel h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.debug-panel button {
    transition: all 0.2s ease;
}

.debug-panel button:hover {
    transform: scale(1.05);
}

/* 响应式适配 */
@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2.25rem;
    }

    .hero-content p {
        font-size: 1.125rem;
    }

    .features-section h2 {
        font-size: 1.875rem;
    }

    .parallax-content h2 {
        font-size: 1.875rem;
    }

    .debug-panel {
        bottom: 0.5rem;
        right: 0.5rem;
        min-width: 150px;
    }

    .shape {
        opacity: 0.5;
    }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    .feature-card {
        background-color: #1f2937;
        color: white;
    }

    .batch-item {
        background-color: #1f2937;
        color: white;
    }

    .batch-item:hover {
        background-color: #374151;
    }

    .item-title {
        color: #d1d5db;
    }
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
    .shape {
        animation: none;
    }

    .btn-primary,
    .feature-card,
    .batch-item {
        transition: none;
    }

    .feature-card:hover {
        transform: none;
    }
}
</style>
