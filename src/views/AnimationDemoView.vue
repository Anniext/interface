<template>
    <div
        class="animation-demo-view min-h-screen bg-linear-to-br from-slate-900 via-violet-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        动画演示
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示 GSAP 动画库的各种效果和交互动画
                </p>
            </div>

            <!-- 动画演示区域 -->
            <div class="space-y-8">
                <!-- 基础动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">基础动画</h2>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div
                                ref="fadeBox"
                                class="w-20 h-20 bg-blue-500 rounded-lg mx-auto mb-4 cursor-pointer"></div>
                            <button
                                @click="animateFade"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                                淡入淡出
                            </button>
                        </div>

                        <div class="text-center">
                            <div
                                ref="scaleBox"
                                class="w-20 h-20 bg-green-500 rounded-lg mx-auto mb-4 cursor-pointer"></div>
                            <button
                                @click="animateScale"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                                缩放动画
                            </button>
                        </div>

                        <div class="text-center">
                            <div
                                ref="rotateBox"
                                class="w-20 h-20 bg-purple-500 rounded-lg mx-auto mb-4 cursor-pointer"></div>
                            <button
                                @click="animateRotate"
                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
                                旋转动画
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 时间轴动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">
                        时间轴动画
                    </h2>
                    <div class="flex justify-center mb-6">
                        <button
                            @click="playTimeline"
                            class="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors">
                            播放时间轴动画
                        </button>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <div
                            v-for="(box, index) in timelineBoxes"
                            :key="index"
                            :ref="(el) => (timelineBoxes[index] = el)"
                            class="w-16 h-16 bg-orange-500 rounded-lg"></div>
                    </div>
                </div>

                <!-- 文字动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">文字动画</h2>
                    <div class="text-center mb-6">
                        <button
                            @click="animateText"
                            class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors">
                            播放文字动画
                        </button>
                    </div>
                    <div class="text-center">
                        <h3
                            ref="animatedText"
                            class="text-4xl font-bold text-white opacity-0">
                            欢迎来到动画世界
                        </h3>
                    </div>
                </div>

                <!-- 路径动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">路径动画</h2>
                    <div class="flex justify-center mb-6">
                        <button
                            @click="animatePath"
                            class="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors">
                            播放路径动画
                        </button>
                    </div>
                    <div
                        class="relative h-64 bg-black/30 rounded-lg overflow-hidden">
                        <svg
                            class="absolute inset-0 w-full h-full"
                            viewBox="0 0 400 200">
                            <path
                                ref="animationPath"
                                d="M 50 100 Q 200 50 350 100"
                                stroke="#64748b"
                                stroke-width="2"
                                fill="none"
                                stroke-dasharray="5,5" />
                        </svg>
                        <div
                            ref="pathBall"
                            class="absolute w-6 h-6 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                <!-- 交互动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">交互动画</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="text-center">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                悬停效果
                            </h3>
                            <div
                                ref="hoverCard"
                                class="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl cursor-pointer transform transition-transform hover:scale-105">
                                <p class="text-white">悬停我试试</p>
                            </div>
                        </div>

                        <div class="text-center">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                点击效果
                            </h3>
                            <div
                                ref="clickCard"
                                @click="animateClick"
                                class="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl cursor-pointer">
                                <p class="text-white">点击我试试</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 粒子动画 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2 class="text-2xl font-bold text-white mb-6">粒子动画</h2>
                    <div class="text-center mb-6">
                        <button
                            @click="createParticles"
                            class="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors">
                            创建粒子效果
                        </button>
                    </div>
                    <div
                        ref="particleContainer"
                        class="relative h-32 bg-black/30 rounded-lg overflow-hidden"></div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center mt-12">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores";

// 使用应用状态
const appStore = useAppStore();

// DOM 引用
const fadeBox = ref<HTMLElement>();
const scaleBox = ref<HTMLElement>();
const rotateBox = ref<HTMLElement>();
const animatedText = ref<HTMLElement>();
const animationPath = ref<SVGPathElement>();
const pathBall = ref<HTMLElement>();
const hoverCard = ref<HTMLElement>();
const clickCard = ref<HTMLElement>();
const particleContainer = ref<HTMLElement>();

// 时间轴动画的盒子
const timelineBoxes = ref<HTMLElement[]>([]);

/**
 * 淡入淡出动画
 */
function animateFade() {
    if (!fadeBox.value) return;

    // 模拟 GSAP 动画效果
    fadeBox.value.style.transition = "opacity 0.5s ease";
    fadeBox.value.style.opacity = "0";

    setTimeout(() => {
        if (fadeBox.value) {
            fadeBox.value.style.opacity = "1";
        }
    }, 500);
}

/**
 * 缩放动画
 */
function animateScale() {
    if (!scaleBox.value) return;

    scaleBox.value.style.transition = "transform 0.5s ease";
    scaleBox.value.style.transform = "scale(1.5)";

    setTimeout(() => {
        if (scaleBox.value) {
            scaleBox.value.style.transform = "scale(1)";
        }
    }, 500);
}

/**
 * 旋转动画
 */
function animateRotate() {
    if (!rotateBox.value) return;

    rotateBox.value.style.transition = "transform 0.5s ease";
    rotateBox.value.style.transform = "rotate(360deg)";

    setTimeout(() => {
        if (rotateBox.value) {
            rotateBox.value.style.transform = "rotate(0deg)";
        }
    }, 500);
}

/**
 * 时间轴动画
 */
function playTimeline() {
    timelineBoxes.value.forEach((box, index) => {
        if (box) {
            box.style.transition = `transform 0.3s ease ${index * 0.1}s`;
            box.style.transform = "translateY(-50px) scale(1.2)";

            setTimeout(
                () => {
                    box.style.transform = "translateY(0) scale(1)";
                },
                300 + index * 100,
            );
        }
    });
}

/**
 * 文字动画
 */
function animateText() {
    if (!animatedText.value) return;

    const text = "欢迎来到动画世界";
    animatedText.value.textContent = "";
    animatedText.value.style.opacity = "1";

    // 逐字显示动画
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            if (animatedText.value) {
                animatedText.value.textContent += text[i];
            }
        }, i * 100);
    }
}

/**
 * 路径动画
 */
function animatePath() {
    if (!pathBall.value || !animationPath.value) return;

    const path = animationPath.value;
    const pathLength = path.getTotalLength();

    let progress = 0;
    const duration = 2000; // 2秒
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        const point = path.getPointAtLength(progress * pathLength);

        if (pathBall.value) {
            pathBall.value.style.left = point.x + "px";
            pathBall.value.style.top = point.y + "px";
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

/**
 * 点击动画
 */
function animateClick() {
    if (!clickCard.value) return;

    clickCard.value.style.transition = "transform 0.1s ease";
    clickCard.value.style.transform = "scale(0.95)";

    setTimeout(() => {
        if (clickCard.value) {
            clickCard.value.style.transform = "scale(1)";
        }
    }, 100);

    // 创建涟漪效果
    const ripple = document.createElement("div");
    ripple.className = "absolute inset-0 bg-white/20 rounded-xl";
    ripple.style.animation = "ripple 0.6s ease-out";

    clickCard.value.style.position = "relative";
    clickCard.value.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * 创建粒子效果
 */
function createParticles() {
    if (!particleContainer.value) return;

    // 清理现有粒子
    particleContainer.value.innerHTML = "";

    // 创建粒子
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute w-2 h-2 bg-yellow-400 rounded-full";
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.transition = "all 2s ease-out";

        particleContainer.value.appendChild(particle);

        // 随机方向和距离
        setTimeout(() => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = "0";
        }, 50);

        // 清理粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2500);
    }
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("animation-demo");

    // 设置页面标题
    document.title = "动画演示 - 交互式简历网站";

    // 初始化时间轴盒子
    for (let i = 0; i < 5; i++) {
        timelineBoxes.value.push(null as any);
    }
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}

/* 涟漪动画 */
@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0;
    }
}

/* 响应式适配 */
@media (max-width: 768px) {
    .text-4xl {
        font-size: 2rem;
    }

    .md\:text-6xl {
        font-size: 2.5rem;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
