<template>
    <div
        class="certificate-card relative overflow-hidden rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
        @click="handleClick"
        @mouseenter="handleHover">
        <!-- 背景装饰 -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50"></div>

        <!-- 有效期指示器 -->
        <div
            class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
            :class="statusClasses">
            {{ statusText }}
        </div>

        <!-- 主要内容 -->
        <div class="relative p-4 z-10">
            <!-- 图标和标题 -->
            <div class="flex items-start gap-3 mb-3">
                <div
                    class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                    <i
                        :class="`icon-${certificate.icon}`"
                        v-if="certificate.icon"></i>
                    <span v-else>📜</span>
                </div>

                <div class="flex-1 min-w-0">
                    <h3
                        class="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                        {{ certificate.name }}
                    </h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ certificate.issuer }}
                    </p>
                </div>
            </div>

            <!-- 证书信息 -->
            <div class="space-y-2 mb-3">
                <div class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400"
                        >颁发时间:</span
                    >
                    <span class="text-gray-700 dark:text-gray-300">{{
                        formatDate(certificate.issueDate)
                    }}</span>
                </div>

                <div
                    v-if="certificate.expiryDate"
                    class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400"
                        >有效期至:</span
                    >
                    <span class="text-gray-700 dark:text-gray-300">{{
                        formatDate(certificate.expiryDate)
                    }}</span>
                </div>

                <div
                    v-if="certificate.credentialId"
                    class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400"
                        >证书编号:</span
                    >
                    <span class="text-gray-700 dark:text-gray-300 font-mono">{{
                        certificate.credentialId
                    }}</span>
                </div>
            </div>

            <!-- 底部操作 -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div
                        class="w-2 h-2 rounded-full"
                        :class="
                            isActive
                                ? 'bg-green-500'
                                : isExpiring
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                        "></div>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                        {{ validityText }}
                    </span>
                </div>

                <button
                    v-if="certificate.url"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    @click.stop="openCertificate">
                    查看证书
                </button>
            </div>
        </div>

        <!-- 发光效果 -->
        <div
            v-if="isHighlighted"
            class="absolute inset-0 rounded-lg pointer-events-none border-2 border-blue-400 shadow-lg shadow-blue-400/50"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ICertificate } from "@/types/achievements";

interface Props {
    certificate: ICertificate;
    isHighlighted?: boolean;
    size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
    isHighlighted: false,
    size: "medium",
});

const emit = defineEmits<{
    click: [certificate: ICertificate];
    hover: [certificate: ICertificate];
}>();

// 检查证书是否有效
const isActive = computed(() => {
    if (!props.certificate.expiryDate) return true;
    return new Date(props.certificate.expiryDate) > new Date();
});

// 检查证书是否即将过期（6个月内）
const isExpiring = computed(() => {
    if (!props.certificate.expiryDate) return false;
    const expiryDate = new Date(props.certificate.expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiryDate <= sixMonthsFromNow && expiryDate > new Date();
});

// 状态样式类
const statusClasses = computed(() => {
    if (isActive.value && !isExpiring.value) {
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (isExpiring.value) {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else {
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
});

// 状态文本
const statusText = computed(() => {
    if (isActive.value && !isExpiring.value) {
        return "有效";
    } else if (isExpiring.value) {
        return "即将过期";
    } else {
        return "已过期";
    }
});

// 有效性文本
const validityText = computed(() => {
    if (!props.certificate.expiryDate) {
        return "永久有效";
    }

    const expiryDate = new Date(props.certificate.expiryDate);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `已过期 ${Math.abs(diffDays)} 天`;
    } else if (diffDays < 30) {
        return `${diffDays} 天后过期`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} 个月后过期`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} 年后过期`;
    }
});

// 格式化日期
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// 处理点击事件
function handleClick() {
    emit("click", props.certificate);
}

// 处理悬停事件
function handleHover() {
    emit("hover", props.certificate);
}

// 打开证书链接
function openCertificate() {
    if (props.certificate.url) {
        window.open(props.certificate.url, "_blank");
    }
}
</script>

<style scoped>
.certificate-card:hover {
    transform: translateY(-2px);
}
</style>
