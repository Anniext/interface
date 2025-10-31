<template>
    <div
        ref="container"
        class="typewriter-container"
        :class="{ 'is-typing': isTyping, 'is-complete': isComplete }">
        <!-- 显示文本 -->
        <span
            ref="textElement"
            class="typewriter-text"
            :class="textClass"
            v-html="displayText">
        </span>

        <!-- 光标 -->
        <span
            v-if="showCursor"
            ref="cursor"
            class="typewriter-cursor"
            :class="cursorClass"
            :style="cursorStyle">
            {{ cursorChar }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { gsap } from "gsap";

interface Props {
    /** 要显示的文本 */
    text: string;
    /** 打字速度 (字符/秒) */
    speed?: number;
    /** 是否显示光标 */
    showCursor?: boolean;
    /** 光标字符 */
    cursorChar?: string;
    /** 光标闪烁速度 */
    cursorBlinkSpeed?: number;
    /** 是否自动开始 */
    autoStart?: boolean;
    /** 开始延迟 */
    startDelay?: number;
    /** 是否循环播放 */
    loop?: boolean;
    /** 循环间隔 */
    loopDelay?: number;
    /** 是否支持HTML标签 */
    allowHtml?: boolean;
    /** 文本样式类 */
    textClass?: string;
    /** 光标样式类 */
    cursorClass?: string;
    /** 打字音效 */
    enableSound?: boolean;
    /** 随机打字速度变化 */
    randomSpeed?: boolean;
    /** 暂停字符（遇到这些字符时会暂停） */
    pauseChars?: string[];
    /** 暂停时长 */
    pauseDuration?: number;
}

interface Emits {
    (e: "start"): void;
    (e: "progress", progress: number): void;
    (e: "complete"): void;
    (e: "loop"): void;
    (e: "pause"): void;
    (e: "resume"): void;
}

const props = withDefaults(defineProps<Props>(), {
    text: "",
    speed: 50, // 字符/秒
    showCursor: true,
    cursorChar: "|",
    cursorBlinkSpeed: 1, // 每秒闪烁次数
    autoStart: true,
    startDelay: 0,
    loop: false,
    loopDelay: 2,
    allowHtml: false,
    textClass: "",
    cursorClass: "",
    enableSound: false,
    randomSpeed: false,
    pauseChars: () => [".", "!", "?", ","],
    pauseDuration: 0.5,
});

const emit = defineEmits<Emits>();

// 组件引用
const container = ref<HTMLElement>();
const textElement = ref<HTMLElement>();
const cursor = ref<HTMLElement>();

// 状态管理
const displayText = ref("");
const currentIndex = ref(0);
const isTyping = ref(false);
const isComplete = ref(false);
const isPaused = ref(false);

// 动画相关
let typingTimeline: gsap.core.Timeline | null = null;
let cursorTimeline: gsap.core.Timeline | null = null;

// 计算属性
const cursorStyle = computed(() => ({
    animationDuration: `${1 / props.cursorBlinkSpeed}s`,
}));

const textArray = computed(() => {
    if (props.allowHtml) {
        // 如果允许HTML，需要特殊处理
        return parseHtmlText(props.text);
    }
    return props.text.split("");
});

/**
 * 解析HTML文本
 */
function parseHtmlText(html: string): Array<{ char: string; isTag: boolean }> {
    const result: Array<{ char: string; isTag: boolean }> = [];
    let inTag = false;
    let currentTag = "";

    for (let i = 0; i < html.length; i++) {
        const char = html[i];

        if (char === "<") {
            inTag = true;
            currentTag = char;
        } else if (char === ">" && inTag) {
            currentTag += char;
            result.push({ char: currentTag, isTag: true });
            inTag = false;
            currentTag = "";
        } else if (inTag) {
            currentTag += char;
        } else {
            result.push({ char, isTag: false });
        }
    }

    return result;
}

/**
 * 开始打字动画
 */
function startTyping(): void {
    if (isTyping.value || props.text.length === 0) return;

    isTyping.value = true;
    isComplete.value = false;
    currentIndex.value = 0;
    displayText.value = "";
    emit("start");

    // 开始光标闪烁
    startCursorBlink();

    // 创建打字时间轴
    typingTimeline = gsap.timeline({
        delay: props.startDelay,
        onComplete: () => {
            isTyping.value = false;
            isComplete.value = true;
            emit("complete");

            // 如果需要循环
            if (props.loop) {
                setTimeout(() => {
                    emit("loop");
                    resetTyping();
                    startTyping();
                }, props.loopDelay * 1000);
            }
        },
    });

    // 添加打字动画
    addTypingAnimation();
}

/**
 * 添加打字动画
 */
function addTypingAnimation(): void {
    if (!typingTimeline) return;

    const chars = props.allowHtml
        ? parseHtmlText(props.text)
        : props.text.split("").map((char) => ({ char, isTag: false }));

    chars.forEach((item, index) => {
        const baseDelay = index / props.speed;
        const randomDelay = props.randomSpeed ? (Math.random() - 0.5) * 0.1 : 0;
        const delay = baseDelay + randomDelay;

        // 检查是否是暂停字符
        const shouldPause = !item.isTag && props.pauseChars.includes(item.char);
        const pauseDelay = shouldPause ? props.pauseDuration : 0;

        typingTimeline!.call(
            () => {
                if (item.isTag) {
                    // HTML标签直接添加，不显示打字效果
                    displayText.value += item.char;
                } else {
                    // 普通字符逐个添加
                    displayText.value += item.char;
                    currentIndex.value = index + 1;

                    // 发射进度事件
                    const progress = (index + 1) / chars.length;
                    emit("progress", progress);

                    // 播放打字音效
                    if (props.enableSound) {
                        playTypingSound();
                    }
                }
            },
            [],
            delay + pauseDelay,
        );
    });
}

/**
 * 开始光标闪烁
 */
function startCursorBlink(): void {
    if (!props.showCursor || !cursor.value) return;

    cursorTimeline = gsap.timeline({ repeat: -1 });
    cursorTimeline.to(cursor.value, {
        opacity: 0,
        duration: 0.5 / props.cursorBlinkSpeed,
        ease: "power2.inOut",
    });
    cursorTimeline.to(cursor.value, {
        opacity: 1,
        duration: 0.5 / props.cursorBlinkSpeed,
        ease: "power2.inOut",
    });
}

/**
 * 停止光标闪烁
 */
function stopCursorBlink(): void {
    if (cursorTimeline) {
        cursorTimeline.kill();
        if (cursor.value) {
            gsap.set(cursor.value, { opacity: 1 });
        }
    }
}

/**
 * 播放打字音效
 */
function playTypingSound(): void {
    // 这里可以添加音效播放逻辑
    // 例如使用Web Audio API或HTML5 Audio
    console.log("打字音效");
}

/**
 * 暂停打字
 */
function pauseTyping(): void {
    if (!isTyping.value || isPaused.value) return;

    isPaused.value = true;
    if (typingTimeline) {
        typingTimeline.pause();
    }
    emit("pause");
}

/**
 * 恢复打字
 */
function resumeTyping(): void {
    if (!isPaused.value) return;

    isPaused.value = false;
    if (typingTimeline) {
        typingTimeline.resume();
    }
    emit("resume");
}

/**
 * 停止打字
 */
function stopTyping(): void {
    if (typingTimeline) {
        typingTimeline.kill();
    }
    stopCursorBlink();
    isTyping.value = false;
    isPaused.value = false;
}

/**
 * 重置打字状态
 */
function resetTyping(): void {
    stopTyping();
    displayText.value = "";
    currentIndex.value = 0;
    isComplete.value = false;
}

/**
 * 立即显示完整文本
 */
function showComplete(): void {
    stopTyping();
    displayText.value = props.text;
    currentIndex.value = props.text.length;
    isComplete.value = true;
    emit("complete");
}

/**
 * 设置打字速度
 */
function setSpeed(speed: number): void {
    if (typingTimeline && isTyping.value) {
        typingTimeline.timeScale(speed / props.speed);
    }
}

// 监听文本变化
watch(
    () => props.text,
    () => {
        if (props.autoStart) {
            resetTyping();
            startTyping();
        }
    },
);

// 生命周期
onMounted(() => {
    if (props.autoStart && props.text) {
        startTyping();
    }
});

onBeforeUnmount(() => {
    stopTyping();
});

// 暴露方法给父组件
defineExpose({
    start: startTyping,
    pause: pauseTyping,
    resume: resumeTyping,
    stop: stopTyping,
    reset: resetTyping,
    showComplete,
    setSpeed,
    isTyping: () => isTyping.value,
    isComplete: () => isComplete.value,
    isPaused: () => isPaused.value,
    progress: () => currentIndex.value / props.text.length,
});
</script>

<style scoped>
.typewriter-container {
    display: inline-block;
    position: relative;
}

.typewriter-text {
    display: inline;
    white-space: pre-wrap;
    word-break: break-word;
}

.typewriter-cursor {
    display: inline-block;
    animation: blink 1s infinite;
    font-weight: bold;
    margin-left: 1px;
}

@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}

/* 打字状态样式 */
.typewriter-container.is-typing .typewriter-cursor {
    animation-play-state: running;
}

.typewriter-container.is-complete .typewriter-cursor {
    animation-play-state: paused;
    opacity: 0;
}

/* 不同样式的光标 */
.typewriter-cursor.cursor-block {
    background-color: currentColor;
    color: transparent;
    width: 0.6em;
    height: 1.2em;
    display: inline-block;
    vertical-align: text-bottom;
}

.typewriter-cursor.cursor-underline {
    border-bottom: 2px solid currentColor;
    animation: none;
}

.typewriter-cursor.cursor-beam {
    width: 2px;
    height: 1.2em;
    background-color: currentColor;
    display: inline-block;
    vertical-align: text-bottom;
}

/* 文本样式变体 */
.typewriter-text.text-gradient {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.typewriter-text.text-glow {
    text-shadow: 0 0 10px currentColor;
}

.typewriter-text.text-typewriter {
    font-family: "Courier New", monospace;
    letter-spacing: 0.1em;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .typewriter-text {
        font-size: 0.9em;
        line-height: 1.4;
    }
}

/* 减少动画选项支持 */
@media (prefers-reduced-motion: reduce) {
    .typewriter-cursor {
        animation: none;
        opacity: 1;
    }

    .typewriter-container.is-typing .typewriter-cursor {
        animation: none;
    }
}

/* 无障碍访问 */
.typewriter-container[aria-live="polite"] {
    /* 为屏幕阅读器提供实时更新 */
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .typewriter-cursor {
        border: 1px solid currentColor;
        background-color: currentColor;
    }
}
</style>
