<!-- 技能标签物理掉落效果组件 -->
<template>
    <div class="skill-drop-effect relative w-full h-full">
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

        <!-- 技能标签 HTML 层 -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                v-for="skill in skillsWithPosition"
                :key="skill.id"
                :style="{
                    transform: `translate(${skill.position.x - 40}px, ${
                        skill.position.y - 20
                    }px)`,
                    transition: skill.isAnimating
                        ? 'none'
                        : 'transform 0.3s ease',
                    backgroundColor: skill.color + '20',
                    borderColor: skill.color,
                    color: skill.color,
                    boxShadow: skill.isGlowing
                        ? `0 0 20px ${skill.color}80, 0 0 40px ${skill.color}40`
                        : `0 4px 12px ${skill.color}30`,
                }"
                class="absolute skill-tag"
                :class="[
                    'px-3 py-1 rounded-full text-sm font-medium shadow-lg',
                    'border-2 transition-all duration-300',
                    skill.isGlowing ? 'animate-pulse shadow-2xl' : '',
                ]">
                <!-- 技能图标 -->
                <div class="flex items-center space-x-2">
                    <div
                        v-if="skill.icon"
                        class="w-4 h-4 shrink-0"
                        v-html="skill.icon" />
                    <span>{{ skill.name }}</span>
                    <!-- 技能等级指示器 -->
                    <div class="flex space-x-1">
                        <div
                            v-for="i in 5"
                            :key="i"
                            class="w-1 h-1 rounded-full"
                            :class="
                                i <= skill.level
                                    ? 'bg-current'
                                    : 'bg-current opacity-30'
                            " />
                    </div>
                </div>
            </div>
        </div>

        <!-- 控制面板 -->
        <div
            v-if="showControls"
            class="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg">
            <h3 class="text-sm font-bold mb-2">技能掉落控制</h3>
            <div class="space-y-2">
                <button
                    @click="startDropEffect"
                    :disabled="isDropping"
                    class="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm">
                    {{ isDropping ? "掉落中..." : "开始掉落" }}
                </button>
                <button
                    @click="resetSkills"
                    class="w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                    重置位置
                </button>
                <button
                    @click="addRandomSkill"
                    class="w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                    添加技能
                </button>
                <div class="pt-2 border-t border-gray-600">
                    <label class="block text-xs mb-1">重力强度</label>
                    <input
                        v-model.number="gravityStrength"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        class="w-full" />
                    <span class="text-xs text-gray-400">{{
                        gravityStrength
                    }}</span>
                </div>
                <div>
                    <label class="block text-xs mb-1">弹性系数</label>
                    <input
                        v-model.number="bounceStrength"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        class="w-full" />
                    <span class="text-xs text-gray-400">{{
                        bounceStrength
                    }}</span>
                </div>
            </div>
        </div>

        <!-- 粒子效果层 -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                v-for="particle in particles"
                :key="particle.id"
                :style="{
                    transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
                    opacity: particle.opacity,
                    backgroundColor: particle.color,
                }"
                class="absolute w-2 h-2 rounded-full" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { gsap } from "gsap";
import { PhysicsAnimationEffects } from "@/utils/physics/SimplePhysicsAnimationEffects";
import type { ISkillDropConfig } from "@/utils/physics/SimplePhysicsAnimationEffects";

// Props
interface Props {
    /** 技能数据 */
    skills?: Array<{
        id: string;
        name: string;
        level: number;
        color: string;
        icon?: string;
    }>;
    /** 画布尺寸 */
    width?: number;
    height?: number;
    /** 是否显示控制面板 */
    showControls?: boolean;
    /** 自动开始掉落 */
    autoStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    skills: () => [
        {
            id: "javascript",
            name: "JavaScript",
            level: 5,
            color: "#f7df1e",
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.77l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-.998l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z"/></svg>`,
        },
        {
            id: "typescript",
            name: "TypeScript",
            level: 4,
            color: "#3178c6",
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>`,
        },
        {
            id: "vue",
            name: "Vue.js",
            level: 5,
            color: "#4fc08d",
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>`,
        },
        {
            id: "nodejs",
            name: "Node.js",
            level: 4,
            color: "#339933",
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/></svg>`,
        },
        {
            id: "python",
            name: "Python",
            level: 3,
            color: "#3776ab",
            icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>`,
        },
    ],
    width: 800,
    height: 600,
    showControls: false,
    autoStart: false,
});

// Emits
interface Emits {
    (e: "skillClicked", skill: any): void;
    (e: "dropComplete"): void;
    (e: "collision", event: any): void;
}

const emit = defineEmits<Emits>();

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>();
const pixelRatio = window.devicePixelRatio || 1;
const isDropping = ref(false);
const gravityStrength = ref(1.0);
const bounceStrength = ref(0.8);

// 画布尺寸
const canvasSize = computed(() => ({
    width: props.width,
    height: props.height,
}));

// 技能位置状态
const skillsWithPosition = ref(
    props.skills.map((skill) => ({
        ...skill,
        position: { x: 100 + Math.random() * 600, y: 50 },
        isAnimating: false,
        isGlowing: false,
    })),
);

// 粒子效果
const particles = ref<
    Array<{
        id: string;
        x: number;
        y: number;
        scale: number;
        opacity: number;
        color: string;
    }>
>([]);

// 动画效果系统
let animationEffects: PhysicsAnimationEffects | null = null;
let currentEffectId: string | null = null;

/**
 * 初始化物理系统
 */
function initPhysicsSystem() {
    if (!canvasRef.value) return;

    // 使用简化的动画效果系统
    animationEffects = new PhysicsAnimationEffects(canvasRef.value);

    console.log("技能掉落动画系统初始化完成");
}

/**
 * 开始掉落效果
 */
function startDropEffect() {
    if (!animationEffects || isDropping.value) return;

    isDropping.value = true;

    // 配置掉落效果
    const config: ISkillDropConfig = {
        skills: props.skills,
        dropArea: {
            x: 50,
            y: 0,
            width: canvasSize.value.width - 100,
            height: 100,
        },
        physics: {
            gravity: gravityStrength.value,
            bounce: bounceStrength.value,
            friction: 0.3,
            mass: 1.0,
        },
        animation: {
            staggerDelay: 200,
            fallDuration: 2000,
            bounceCount: 3,
        },
    };

    // 创建掉落效果
    currentEffectId = animationEffects.createSkillDropEffect(config);

    // 更新技能位置状态
    skillsWithPosition.value.forEach((skill, index) => {
        skill.isAnimating = true;

        // 延迟开始动画
        setTimeout(() => {
            const startX =
                config.dropArea.x + Math.random() * config.dropArea.width;
            const startY = -50 - index * 20;

            // 使用 GSAP 同步 HTML 元素位置
            gsap.to(skill.position, {
                x: startX,
                y: startY,
                duration: 0.1,
                ease: "none",
                onComplete: () => {
                    // 开始物理掉落
                    animateSkillFall(skill);
                },
            });
        }, index * config.animation.staggerDelay);
    });

    // 设置完成回调
    setTimeout(() => {
        isDropping.value = false;
        emit("dropComplete");
    }, config.animation.fallDuration + props.skills.length * config.animation.staggerDelay);
}

/**
 * 动画技能掉落
 */
function animateSkillFall(skill: any) {
    const finalY = canvasSize.value.height - 100 - Math.random() * 200;
    const finalX = 100 + Math.random() * (canvasSize.value.width - 200);

    // 掉落动画
    gsap.to(skill.position, {
        x: finalX,
        y: finalY,
        duration: 1.5,
        ease: "bounce.out",
        onUpdate: () => {
            // 添加旋转效果
            if (Math.random() < 0.1) {
                skill.isGlowing = true;
                setTimeout(() => {
                    skill.isGlowing = false;
                }, 200);
            }
        },
        onComplete: () => {
            skill.isAnimating = false;
            // 创建着陆粒子效果
            createLandingParticles(skill.position, skill.color);
        },
    });

    // 添加随机的侧向运动
    gsap.to(skill.position, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
    });
}

/**
 * 创建着陆粒子效果
 */
function createLandingParticles(
    position: { x: number; y: number },
    color: string,
) {
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const particle = {
            id: `particle-${Date.now()}-${i}`,
            x: position.x + (Math.random() - 0.5) * 40,
            y: position.y + (Math.random() - 0.5) * 20,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 1,
            color: color,
        };

        particles.value.push(particle);

        // 动画粒子
        gsap.to(particle, {
            x: particle.x + (Math.random() - 0.5) * 60,
            y: particle.y - Math.random() * 40,
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                // 移除粒子
                const index = particles.value.findIndex(
                    (p) => p.id === particle.id,
                );
                if (index > -1) {
                    particles.value.splice(index, 1);
                }
            },
        });
    }
}

/**
 * 重置技能位置
 */
function resetSkills() {
    if (isDropping.value) return;

    skillsWithPosition.value.forEach((skill, index) => {
        skill.isAnimating = false;
        skill.isGlowing = false;

        gsap.to(skill.position, {
            x: 100 + index * 120,
            y: 50,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: index * 0.1,
        });
    });

    // 清理物理效果
    if (animationEffects && currentEffectId) {
        animationEffects.removeEffect(currentEffectId);
        currentEffectId = null;
    }

    // 清理粒子
    particles.value = [];
}

/**
 * 添加随机技能
 */
function addRandomSkill() {
    const skillNames = [
        "React",
        "Angular",
        "Svelte",
        "Docker",
        "Kubernetes",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "GraphQL",
        "REST API",
    ];
    const colors = [
        "#61dafb",
        "#dd0031",
        "#ff3e00",
        "#2496ed",
        "#326ce5",
        "#47a248",
        "#336791",
        "#dc382d",
        "#e10098",
        "#ff6b35",
    ];

    const randomIndex = Math.floor(Math.random() * skillNames.length);
    const newSkill = {
        id: `skill-${Date.now()}`,
        name: skillNames[randomIndex] || "Unknown Skill",
        level: Math.floor(Math.random() * 5) + 1,
        color: colors[randomIndex] || "#666666",
        position: {
            x: Math.random() * (canvasSize.value.width - 100) + 50,
            y: -50,
        },
        isAnimating: false,
        isGlowing: false,
    };

    skillsWithPosition.value.push(newSkill);

    // 动画新技能进入
    gsap.fromTo(
        newSkill.position,
        { y: -50, scale: 0 },
        {
            y: 50 + Math.random() * 100,
            scale: 1,
            duration: 0.8,
            ease: "bounce.out",
        },
    );
}

// 监听重力变化
watch(gravityStrength, () => {
    // 重力变化处理（简化版本）
    console.log("重力强度已更新:", gravityStrength.value);
});

// 生命周期
onMounted(() => {
    initPhysicsSystem();

    if (props.autoStart) {
        setTimeout(() => {
            startDropEffect();
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
    startDropEffect,
    resetSkills,
    addRandomSkill,
});
</script>

<style scoped>
.skill-drop-effect {
    user-select: none;
    -webkit-user-select: none;
}

.skill-tag {
    cursor: pointer;
    transform-origin: center;
}

.skill-tag:hover {
    transform: scale(1.05);
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

.animate-pulse {
    animation: pulse 0.5s ease-in-out infinite;
}
</style>
