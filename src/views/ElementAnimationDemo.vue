<template>
    <div
        class="element-animation-demo min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
        <div class="container mx-auto px-4 py-12">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <TypewriterText
                    text="元素动画效果演示"
                    :speed="30"
                    :show-cursor="true"
                    cursor-char="|"
                    text-class="text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                    :auto-start="true" />
                <p class="text-xl text-gray-300 max-w-2xl mx-auto mt-6">
                    展示各种交互式动画效果和用户反馈
                </p>
            </div>

            <!-- 动画效果网格 -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- 卡片翻转动画 -->
                <div class="demo-section">
                    <h3 class="text-xl font-bold mb-4 text-blue-400">
                        卡片翻转动画
                    </h3>
                    <CardFlipAnimation
                        trigger="click"
                        :duration="0.8"
                        axis="y"
                        :enable3D="true"
                        class="w-full h-48 rounded-xl">
                        <template #front>
                            <div
                                class="w-full h-full bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                                <div class="text-center">
                                    <div class="text-4xl mb-2">🎯</div>
                                    <div class="font-bold">点击翻转</div>
                                </div>
                            </div>
                        </template>
                        <template #back>
                            <div
                                class="w-full h-full bg-linear-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                                <div class="text-center">
                                    <div class="text-4xl mb-2">✨</div>
                                    <div class="font-bold">翻转成功！</div>
                                    <div class="text-sm mt-2">再次点击返回</div>
                                </div>
                            </div>
                        </template>
                    </CardFlipAnimation>
                </div>

                <!-- 卡片展开动画 -->
                <div class="demo-section">
                    <h3 class="text-xl font-bold mb-4 text-green-400">
                        卡片展开动画
                    </h3>
                    <CardExpandAnimation
                        :duration="0.5"
                        :show-expand-icon="true"
                        class="bg-gray-800/50 rounded-xl border border-gray-700">
                        <template #header>
                            <div class="flex items-center">
                                <div class="text-2xl mr-3">📋</div>
                                <div>
                                    <div class="font-bold">项目详情</div>
                                    <div class="text-sm text-gray-400">
                                        点击展开查看更多
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">技术栈:</span>
                                    <span class="text-blue-400"
                                        >Vue 3 + TypeScript</span
                                    >
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">开发时间:</span>
                                    <span class="text-green-400">3个月</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">团队规模:</span>
                                    <span class="text-purple-400">5人</span>
                                </div>
                                <div class="mt-4 p-3 bg-gray-700/50 rounded-lg">
                                    <p class="text-sm text-gray-300">
                                        这是一个展示各种动画效果的演示项目，包含了卡片翻转、展开、进度条、打字机等多种交互动画。
                                    </p>
                                </div>
                            </div>
                        </template>
                    </CardExpandAnimation>
                </div>

                <!-- 交互反馈动画 -->
                <div class="demo-section">
                    <h3 class="text-xl font-bold mb-4 text-purple-400">
                        交互反馈动画
                    </h3>
                    <div class="space-y-4">
                        <InteractiveFeedback
                            type="button"
                            :hover-scale="1.05"
                            :click-scale="0.95"
                            :show-ripple="true"
                            :show-glow="true"
                            :show-particles="true"
                            class="w-full">
                            <button
                                class="w-full px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg font-bold">
                                点击我试试
                            </button>
                        </InteractiveFeedback>

                        <InteractiveFeedback
                            type="card"
                            :hover-scale="1.02"
                            :show-ripple="false"
                            :show-glow="true"
                            glow-color="rgba(34, 197, 94, 0.5)"
                            class="w-full">
                            <div
                                class="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div class="flex items-center">
                                    <div class="text-2xl mr-3">💡</div>
                                    <div>
                                        <div class="font-bold">悬停卡片</div>
                                        <div class="text-sm text-gray-400">
                                            鼠标悬停查看效果
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InteractiveFeedback>
                    </div>
                </div>
            </div>

            <!-- 技能进度条演示 -->
            <div class="mb-16">
                <h2 class="text-3xl font-bold mb-8 text-center">
                    技能进度条动画
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <SkillProgressBar
                            skill-name="Vue.js"
                            :level="90"
                            :experience="3"
                            :gradient="['#4ade80', '#22c55e']"
                            :duration="2"
                            :delay="0"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />

                        <SkillProgressBar
                            skill-name="TypeScript"
                            :level="85"
                            :experience="2"
                            :gradient="['#3b82f6', '#1d4ed8']"
                            :duration="2.2"
                            :delay="0.3"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />

                        <SkillProgressBar
                            skill-name="GSAP"
                            :level="75"
                            :experience="1"
                            :gradient="['#8b5cf6', '#7c3aed']"
                            :duration="2.4"
                            :delay="0.6"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />
                    </div>

                    <div class="space-y-6">
                        <SkillProgressBar
                            skill-name="Canvas"
                            :level="80"
                            :experience="2"
                            :gradient="['#f59e0b', '#d97706']"
                            :duration="2.6"
                            :delay="0.9"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />

                        <SkillProgressBar
                            skill-name="Matter.js"
                            :level="70"
                            :experience="1"
                            :gradient="['#ef4444', '#dc2626']"
                            :duration="2.8"
                            :delay="1.2"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />

                        <SkillProgressBar
                            skill-name="Lottie"
                            :level="65"
                            :experience="1"
                            :gradient="['#06b6d4', '#0891b2']"
                            :duration="3"
                            :delay="1.5"
                            :show-glow="true"
                            :show-indicator="true"
                            :auto-start="true" />
                    </div>
                </div>
            </div>

            <!-- 打字机效果演示 -->
            <div class="mb-16">
                <h2 class="text-3xl font-bold mb-8 text-center">
                    打字机效果演示
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                        class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-bold mb-4 text-blue-400">
                            基础打字机效果
                        </h4>
                        <TypewriterText
                            text="欢迎来到我的交互式简历网站！这里展示了各种精美的动画效果。"
                            :speed="40"
                            :show-cursor="true"
                            cursor-char="|"
                            :auto-start="true"
                            :start-delay="2"
                            class="text-lg" />
                    </div>

                    <div
                        class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-bold mb-4 text-green-400">
                            代码风格打字机
                        </h4>
                        <TypewriterText
                            text="const developer = {
  name: '徐思宏',
  experience: '4年',
  skills: ['Java', 'Python', 'Go'],
  passion: '游戏后端开发'
};"
                            :speed="60"
                            :show-cursor="true"
                            cursor-char="_"
                            :auto-start="true"
                            :start-delay="4"
                            :random-speed="true"
                            text-class="font-mono text-sm text-green-400"
                            cursor-class="cursor-beam" />
                    </div>
                </div>
            </div>

            <!-- 控制按钮 -->
            <div class="text-center space-x-4">
                <InteractiveFeedback
                    type="button"
                    :show-ripple="true"
                    :show-particles="true">
                    <button
                        @click="resetAllAnimations"
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
                        重置所有动画
                    </button>
                </InteractiveFeedback>

                <router-link to="/" class="inline-block">
                    <InteractiveFeedback type="button" :show-ripple="true">
                        <div
                            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-colors">
                            返回首页
                        </div>
                    </InteractiveFeedback>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardFlipAnimation from "@/components/animation/CardFlipAnimation.vue";
import CardExpandAnimation from "@/components/animation/CardExpandAnimation.vue";
import SkillProgressBar from "@/components/animation/SkillProgressBar.vue";
import InteractiveFeedback from "@/components/animation/InteractiveFeedback.vue";
import TypewriterText from "@/components/animation/TypewriterText.vue";

// 组件引用
const skillBars = ref<InstanceType<typeof SkillProgressBar>[]>([]);
const typewriters = ref<InstanceType<typeof TypewriterText>[]>([]);

/**
 * 重置所有动画
 */
function resetAllAnimations(): void {
    // 重置技能进度条
    skillBars.value.forEach((skillBar) => {
        if (skillBar) {
            skillBar.reset();
            setTimeout(() => {
                skillBar.start();
            }, 100);
        }
    });

    // 重置打字机效果
    typewriters.value.forEach((typewriter) => {
        if (typewriter) {
            typewriter.reset();
            setTimeout(() => {
                typewriter.start();
            }, 200);
        }
    });
}

onMounted(() => {
    console.log("元素动画演示页面已加载");
});
</script>

<style scoped>
.element-animation-demo {
    animation: fadeInUp 0.8s ease-out;
}

.demo-section {
    opacity: 0;
    transform: translateY(30px);
    animation: slideInUp 0.6s ease-out forwards;
}

.demo-section:nth-child(1) {
    animation-delay: 0.2s;
}

.demo-section:nth-child(2) {
    animation-delay: 0.4s;
}

.demo-section:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .demo-section {
        margin-bottom: 2rem;
    }
}
</style>
