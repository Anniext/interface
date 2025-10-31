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
            class="absolute inset-0 z-10"></canvas>

        <!-- 调试信息 -->
        <div
            class="absolute top-2 left-2 bg-black/80 text-white p-2 rounded text-xs z-50">
            <div>Props技能数量: {{ props.skills?.length || 0 }}</div>
            <div>位置状态数量: {{ skillsWithPosition.length }}</div>
            <div>容器尺寸: {{ props.width }}x{{ props.height }}</div>
            <button
                @click="forceRefresh"
                class="mt-1 px-2 py-1 bg-blue-600 rounded text-xs">
                强制刷新
            </button>
        </div>

        <!-- 技能标签 HTML 层 -->
        <div class="absolute inset-0 z-20">
            <!-- 如果没有技能数据，显示提示 -->
            <div
                v-if="skillsWithPosition.length === 0"
                class="absolute inset-0 flex items-center justify-center z-30">
                <div class="text-white/60 text-center">
                    <div class="text-lg mb-2">🎯</div>
                    <div>等待技能数据加载...</div>
                    <div class="text-sm mt-2">
                        Props: {{ props.skills?.length || 0 }} 个技能
                    </div>
                </div>
            </div>

            <!-- 技能标签 -->
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
                    zIndex: 25,
                }"
                class="absolute skill-tag cursor-pointer"
                :class="[
                    'px-3 py-1 rounded-full text-sm font-medium shadow-lg',
                    'border-2 transition-all duration-300',
                    skill.isGlowing ? 'animate-pulse shadow-2xl' : '',
                ]"
                @click="emit('skillClicked', skill)">
                <!-- 技能图标 -->
                <div class="flex items-center space-x-2">
                    <div
                        v-if="skill.icon"
                        class="w-4 h-4 shrink-0"
                        v-html="skill.icon"></div>
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
                            "></div>
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
        <div class="absolute inset-0 pointer-events-none z-15">
            <div
                v-for="particle in particles"
                :key="particle.id"
                :style="{
                    transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
                    opacity: particle.opacity,
                    backgroundColor: particle.color,
                }"
                class="absolute w-2 h-2 rounded-full"></div>
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

// 技能位置状态 - 初始化为空数组
const skillsWithPosition = ref<
    Array<{
        id: string;
        name: string;
        level: number;
        color: string;
        icon?: string;
        position: { x: number; y: number };
        isAnimating: boolean;
        isGlowing: boolean;
    }>
>([]);

/**
 * 计算技能网格位置
 */
function calculateSkillPositions(skills: typeof props.skills) {
    return skills.map((skill, index) => {
        // 计算网格布局位置
        const itemsPerRow = Math.floor(props.width / 140); // 每行最多显示的技能数
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        // 计算居中位置
        const totalWidth = Math.min(skills.length, itemsPerRow) * 140;
        const startX = (props.width - totalWidth) / 2 + 70;

        return {
            ...skill,
            position: {
                x: startX + col * 140,
                y: 60 + row * 50,
            },
            isAnimating: false,
            isGlowing: false,
        };
    });
}

// 初始化技能位置
if (props.skills && props.skills.length > 0) {
    skillsWithPosition.value = calculateSkillPositions(props.skills);
}

// 调试信息
console.log("SkillDropEffect 接收到的技能数据:", props.skills);
console.log("技能位置状态:", skillsWithPosition.value);

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
    if (isDropping.value) return;

    isDropping.value = true;
    console.log("开始技能掉落动画");

    // 创建主时间轴
    const masterTimeline = gsap.timeline({
        onComplete: () => {
            isDropping.value = false;
            emit("dropComplete");
            console.log("技能掉落动画完成");
        },
    });

    // 为每个技能创建掉落动画
    skillsWithPosition.value.forEach((skill, index) => {
        skill.isAnimating = true;

        // 计算随机的掉落起始位置
        const dropStartX = 50 + Math.random() * (canvasSize.value.width - 100);
        const dropStartY = -100 - Math.random() * 200; // 从更高的位置开始

        // 计算最终落地位置
        const finalX = 50 + Math.random() * (canvasSize.value.width - 150);
        const finalY = canvasSize.value.height - 80 - Math.random() * 150;

        // 创建单个技能的动画时间轴
        const skillTimeline = gsap.timeline();

        // 第一阶段：移动到掉落起始位置
        skillTimeline.to(skill.position, {
            x: dropStartX,
            y: dropStartY,
            duration: 0.3,
            ease: "power2.out",
        });

        // 第二阶段：自由落体 + 弹跳
        skillTimeline.to(skill.position, {
            x: finalX,
            y: finalY,
            duration: 1.2 + Math.random() * 0.6, // 随机化下落时间
            ease: "bounce.out",
            onUpdate: () => {
                // 随机发光效果
                if (Math.random() < 0.05) {
                    skill.isGlowing = true;
                    setTimeout(() => {
                        skill.isGlowing = false;
                    }, 150);
                }
            },
            onComplete: () => {
                skill.isAnimating = false;
                // 创建着陆效果
                createLandingParticles(skill.position, skill.color);

                // 添加轻微的震动效果
                gsap.to(skill.position, {
                    x: `+=${(Math.random() - 0.5) * 10}`,
                    y: `+=${(Math.random() - 0.5) * 5}`,
                    duration: 0.1,
                    repeat: 3,
                    yoyo: true,
                    ease: "power2.out",
                });
            },
        });

        // 第三阶段：添加轻微的侧向漂移
        skillTimeline.to(
            skill.position,
            {
                x: `+=${(Math.random() - 0.5) * 60}`,
                duration: 0.8,
                ease: "power2.out",
            },
            "-=0.8",
        ); // 与下落同时进行

        // 将技能动画添加到主时间轴，带有交错延迟
        masterTimeline.add(skillTimeline, index * 0.15);
    });
}

/**
 * 创建着陆粒子效果
 */
function createLandingParticles(
    position: { x: number; y: number },
    color: string,
) {
    const particleCount = 12; // 增加粒子数量

    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount; // 均匀分布角度
        const velocity = 30 + Math.random() * 40; // 随机速度

        const particle = {
            id: `particle-${Date.now()}-${i}`,
            x: position.x + (Math.random() - 0.5) * 20,
            y: position.y + (Math.random() - 0.5) * 10,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 0.9,
            color: color,
        };

        particles.value.push(particle);

        // 计算粒子飞散方向
        const targetX = particle.x + Math.cos(angle) * velocity;
        const targetY =
            particle.y + Math.sin(angle) * velocity - Math.random() * 20; // 向上飞散

        // 动画粒子
        gsap.to(particle, {
            x: targetX,
            y: targetY,
            scale: 0,
            opacity: 0,
            duration: 0.6 + Math.random() * 0.4,
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

    console.log("重置技能位置");

    skillsWithPosition.value.forEach((skill, index) => {
        skill.isAnimating = false;
        skill.isGlowing = false;

        // 计算网格布局位置
        const itemsPerRow = Math.floor(props.width / 140);
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        // 计算居中位置
        const totalWidth =
            Math.min(skillsWithPosition.value.length, itemsPerRow) * 140;
        const startX = (props.width - totalWidth) / 2 + 70;

        const targetX = startX + col * 140;
        const targetY = 60 + row * 50;

        gsap.to(skill.position, {
            x: targetX,
            y: targetY,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: index * 0.08, // 稍微减少延迟，让重置更快
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

// 监听技能数据变化
watch(
    () => props.skills,
    (newSkills) => {
        console.log(
            "SkillDropEffect: 接收到技能数据:",
            newSkills?.length || 0,
            "个技能",
        );

        if (newSkills && newSkills.length > 0) {
            skillsWithPosition.value = newSkills.map((skill, index) => ({
                ...skill,
                position: { x: 100 + index * 120, y: 50 },
                isAnimating: false,
                isGlowing: false,
            }));
            console.log("SkillDropEffect: 技能位置状态已更新");
        } else {
            skillsWithPosition.value = [];
        }
    },
    { immediate: true, deep: true },
);

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

/**
 * 手动刷新技能数据
 */
function refreshSkills() {
    console.log("手动刷新技能数据");
    console.log("当前 props.skills:", props.skills);
    console.log("props.skills 长度:", props.skills?.length || 0);

    if (props.skills && props.skills.length > 0) {
        skillsWithPosition.value = calculateSkillPositions(props.skills);
        console.log("刷新后的技能位置状态:", skillsWithPosition.value);
    } else {
        console.log("没有技能数据可刷新");
        skillsWithPosition.value = [];
    }
}

/**
 * 强制刷新（用于调试）
 */
function forceRefresh() {
    console.log("=== 强制刷新 ===");
    console.log("props.skills:", props.skills);
    console.log("skillsWithPosition.value:", skillsWithPosition.value);

    // 强制重新计算
    if (props.skills && props.skills.length > 0) {
        skillsWithPosition.value = calculateSkillPositions(props.skills);
        console.log("强制刷新后:", skillsWithPosition.value);
    }
}

// 暴露方法
defineExpose({
    startDropEffect,
    resetSkills,
    addRandomSkill,
    refreshSkills,
    forceRefresh,
});
</script>

<style scoped>
.skill-drop-effect {
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden; /* 防止技能标签超出容器 */
}

.skill-tag {
    cursor: pointer;
    transform-origin: center;
    will-change: transform; /* 优化动画性能 */
    backface-visibility: hidden; /* 防止动画闪烁 */
    transition: all 0.2s ease-out;
}

.skill-tag:hover {
    transform: scale(1.08) translateZ(0); /* 添加 translateZ 启用硬件加速 */
    filter: brightness(1.1);
}

.skill-tag:active {
    transform: scale(0.95) translateZ(0);
}

/* 发光动画 */
@keyframes glow-pulse {
    0%,
    100% {
        opacity: 1;
        filter: brightness(1) drop-shadow(0 0 8px currentColor);
    }
    50% {
        opacity: 0.8;
        filter: brightness(1.2) drop-shadow(0 0 16px currentColor);
    }
}

.animate-pulse {
    animation: glow-pulse 0.4s ease-in-out infinite;
}

/* 粒子效果优化 */
.absolute.w-2.h-2.rounded-full {
    will-change: transform, opacity;
    pointer-events: none;
}
</style>
