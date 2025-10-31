<!-- 物理动画效果演示页面 -->
<template>
    <div class="physics-animation-demo min-h-screen bg-gray-900 text-white">
        <!-- 页面标题 -->
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold text-center mb-8 text-blue-400">
                🎮 物理动画效果演示
            </h1>
            <p class="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                展示交互式简历网站中的各种物理动画效果，包括技能标签掉落、奖项碰撞、导航物理交互和页面过渡效果。
            </p>
        </div>

        <!-- 效果选择器 -->
        <div class="container mx-auto px-4 mb-8">
            <div class="flex flex-wrap justify-center gap-4">
                <button
                    v-for="effect in effects"
                    :key="effect.id"
                    @click="selectEffect(effect.id)"
                    :class="[
                        'px-6 py-3 rounded-lg font-medium transition-all duration-300',
                        'border-2 hover:scale-105 transform',
                        selectedEffect === effect.id
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-300',
                    ]">
                    {{ effect.icon }} {{ effect.name }}
                </button>
            </div>
        </div>

        <!-- 效果展示区域 -->
        <div class="container mx-auto px-4">
            <div class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                <!-- 技能掉落效果 -->
                <div v-if="selectedEffect === 'skill-drop'" class="h-96">
                    <h2 class="text-2xl font-bold mb-4 text-green-400">
                        ⚡ 技能标签物理掉落效果
                    </h2>
                    <SkillDropEffect
                        :width="800"
                        :height="320"
                        :show-controls="true"
                        :auto-start="false" />
                </div>

                <!-- 奖项碰撞效果 -->
                <div v-if="selectedEffect === 'award-collision'" class="h-96">
                    <h2 class="text-2xl font-bold mb-4 text-yellow-400">
                        🏆 奖项物理碰撞动画
                    </h2>
                    <AwardCollisionEffect
                        :width="800"
                        :height="320"
                        :show-controls="true"
                        :show-stats="true"
                        :auto-start="false" />
                </div>

                <!-- 导航物理交互 -->
                <div
                    v-if="selectedEffect === 'navigation-physics'"
                    class="h-96">
                    <h2 class="text-2xl font-bold mb-4 text-purple-400">
                        🧭 导航元素物理交互
                    </h2>
                    <NavigationPhysicsEffect
                        :width="800"
                        :height="320"
                        :show-controls="true"
                        :show-stats="true"
                        :auto-connect="true" />
                </div>

                <!-- 页面过渡效果 -->
                <div v-if="selectedEffect === 'page-transition'" class="h-96">
                    <h2 class="text-2xl font-bold mb-4 text-cyan-400">
                        🌊 物理驱动页面过渡
                    </h2>
                    <div
                        class="relative w-full h-80 bg-gray-700 rounded-lg overflow-hidden">
                        <!-- 模拟页面内容 -->
                        <div
                            ref="page1Ref"
                            class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <div class="text-center">
                                <h3 class="text-3xl font-bold mb-4">页面 A</h3>
                                <p class="text-lg opacity-80">
                                    这是第一个页面的内容
                                </p>
                            </div>
                        </div>
                        <div
                            ref="page2Ref"
                            class="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center opacity-0">
                            <div class="text-center">
                                <h3 class="text-3xl font-bold mb-4">页面 B</h3>
                                <p class="text-lg opacity-80">
                                    这是第二个页面的内容
                                </p>
                            </div>
                        </div>

                        <!-- 过渡控制 -->
                        <div class="absolute bottom-4 left-4 right-4">
                            <div class="flex justify-center space-x-4">
                                <button
                                    @click="startTransition('slide')"
                                    :disabled="isTransitioning"
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm font-medium transition-all">
                                    滑动过渡
                                </button>
                                <button
                                    @click="startTransition('fade')"
                                    :disabled="isTransitioning"
                                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded text-sm font-medium transition-all">
                                    淡入淡出
                                </button>
                                <button
                                    @click="startTransition('particle')"
                                    :disabled="isTransitioning"
                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm font-medium transition-all">
                                    粒子过渡
                                </button>
                            </div>
                        </div>

                        <!-- 页面过渡效果组件 -->
                        <PageTransitionEffect
                            ref="transitionRef"
                            :show-debug="true" />
                    </div>
                </div>

                <!-- 效果说明 -->
                <div class="mt-8 p-4 bg-gray-700 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2 text-blue-300">
                        💡 效果说明
                    </h3>
                    <p class="text-gray-300 text-sm leading-relaxed">
                        {{ currentEffectDescription }}
                    </p>
                </div>
            </div>
        </div>

        <!-- 技术说明 -->
        <div class="container mx-auto px-4 py-12">
            <div class="bg-gray-800 rounded-xl p-6">
                <h2 class="text-2xl font-bold mb-6 text-center text-blue-400">
                    🛠️ 技术实现
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-3xl mb-2">🎨</div>
                        <h3 class="font-semibold text-green-400 mb-2">
                            GSAP 动画
                        </h3>
                        <p class="text-sm text-gray-400">
                            高性能的 JavaScript 动画库，提供流畅的动画效果
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl mb-2">🎯</div>
                        <h3 class="font-semibold text-yellow-400 mb-2">
                            Canvas 渲染
                        </h3>
                        <p class="text-sm text-gray-400">
                            HTML5 Canvas 2D 渲染，支持复杂的图形和粒子效果
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl mb-2">⚡</div>
                        <h3 class="font-semibold text-purple-400 mb-2">
                            Vue 3 响应式
                        </h3>
                        <p class="text-sm text-gray-400">
                            基于 Vue 3 Composition API 的响应式状态管理
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl mb-2">🎮</div>
                        <h3 class="font-semibold text-cyan-400 mb-2">
                            交互体验
                        </h3>
                        <p class="text-sm text-gray-400">
                            丰富的鼠标和触摸交互，提供沉浸式用户体验
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SkillDropEffect from "@/components/physics/SkillDropEffect.vue";
import AwardCollisionEffect from "@/components/physics/AwardCollisionEffect.vue";
import NavigationPhysicsEffect from "@/components/physics/NavigationPhysicsEffect.vue";
import PageTransitionEffect from "@/components/physics/PageTransitionEffect.vue";

// 响应式数据
const selectedEffect = ref("skill-drop");
const isTransitioning = ref(false);

// 组件引用
const page1Ref = ref<HTMLElement>();
const page2Ref = ref<HTMLElement>();
const transitionRef = ref<InstanceType<typeof PageTransitionEffect>>();

// 效果列表
const effects = [
    {
        id: "skill-drop",
        name: "技能掉落",
        icon: "⚡",
        description:
            "技能标签从顶部掉落，具有重力效果和弹性碰撞。支持不同技能等级的视觉差异，包括发光效果和粒子特效。用户可以调整重力强度、弹性系数等物理参数。",
    },
    {
        id: "award-collision",
        name: "奖项碰撞",
        icon: "🏆",
        description:
            "奖项图标在空间中自由移动并发生碰撞，产生火花效果和震动反馈。不同等级的奖项具有不同的物理属性和视觉效果。支持音效反馈和实时碰撞统计。",
    },
    {
        id: "navigation-physics",
        name: "导航交互",
        icon: "🧭",
        description:
            "导航元素具有磁性吸引效果，鼠标靠近时会产生物理交互。导航项之间可以建立弹性连接，形成动态的网络结构。支持键盘导航和无障碍访问。",
    },
    {
        id: "page-transition",
        name: "页面过渡",
        icon: "🌊",
        description:
            "物理驱动的页面切换效果，包括滑动、淡入淡出、粒子分解等多种过渡方式。每种过渡都具有独特的物理特性和视觉效果，提供流畅的页面切换体验。",
    },
];

// 计算属性
const currentEffectDescription = computed(() => {
    const effect = effects.find((e) => e.id === selectedEffect.value);
    return effect?.description || "";
});

/**
 * 选择效果
 */
function selectEffect(effectId: string) {
    selectedEffect.value = effectId;
}

/**
 * 开始页面过渡
 */
async function startTransition(type: "slide" | "fade" | "particle") {
    if (isTransitioning.value || !transitionRef.value) return;

    isTransitioning.value = true;

    try {
        // 设置过渡类型
        transitionRef.value.setTransitionType(type);

        // 开始过渡
        await transitionRef.value.startTransition(
            page1Ref.value,
            page2Ref.value,
            {
                type,
                physics: {
                    velocity: 200,
                    friction: 0.8,
                    elasticity: 0.6,
                    turbulence: 50,
                },
                visual: {
                    particleCount: 100,
                    trailLength: 20,
                    colorGradient: ["#3b82f6", "#8b5cf6", "#06b6d4"],
                    blendMode: "normal",
                },
            },
        );

        // 交换页面显示状态
        if (page1Ref.value && page2Ref.value) {
            const page1Opacity = page1Ref.value.style.opacity;
            page1Ref.value.style.opacity = page2Ref.value.style.opacity;
            page2Ref.value.style.opacity = page1Opacity || "1";
        }
    } catch (error) {
        console.error("页面过渡失败:", error);
    } finally {
        isTransitioning.value = false;
    }
}
</script>

<style scoped>
.physics-animation-demo {
    font-family: "Inter", system-ui, sans-serif;
}

/* 自定义滚动条 */
.physics-animation-demo::-webkit-scrollbar {
    width: 8px;
}

.physics-animation-demo::-webkit-scrollbar-track {
    background: #1f2937;
}

.physics-animation-demo::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
}

.physics-animation-demo::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}
</style>
