<template>
    <div
        class="achievement-test-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div class="container mx-auto px-4">
            <!-- 页面标题 -->
            <div class="text-center mb-8">
                <h1
                    class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    成就与证书展示测试
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    测试成就数据加载和展示功能
                </p>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="text-center py-12">
                <div class="text-red-500 mb-2">❌</div>
                <p class="text-red-600 dark:text-red-400">{{ error }}</p>
                <button
                    @click="loadData"
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    重新加载
                </button>
            </div>

            <!-- 数据展示 -->
            <div v-else class="space-y-8">
                <!-- 统计信息 -->
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <h2
                        class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        统计信息
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">
                                {{
                                    achievementData?.achievementSummary
                                        .totalAchievements || 0
                                }}
                            </div>
                            <div
                                class="text-sm text-gray-600 dark:text-gray-400">
                                总成就数
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">
                                {{
                                    achievementData?.achievementSummary
                                        .totalCertificates || 0
                                }}
                            </div>
                            <div
                                class="text-sm text-gray-600 dark:text-gray-400">
                                证书数量
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">
                                {{
                                    achievementData?.achievementSummary
                                        .goldAchievements || 0
                                }}
                            </div>
                            <div
                                class="text-sm text-gray-600 dark:text-gray-400">
                                金奖数量
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">
                                {{
                                    achievementData?.achievementSummary
                                        .competitionStats.winRate || 0
                                }}%
                            </div>
                            <div
                                class="text-sm text-gray-600 dark:text-gray-400">
                                获奖率
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 成就展示 -->
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <h2
                        class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        成就展示
                    </h2>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AchievementCard
                            v-for="achievement in displayedAchievements"
                            :key="achievement.id"
                            :achievement="achievement"
                            @click="handleAchievementClick" />
                    </div>
                </div>

                <!-- 证书展示 -->
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <h2
                        class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        证书展示
                    </h2>

                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CertificateCard
                            v-for="certificate in achievementData?.certificates ||
                            []"
                            :key="certificate.id"
                            :certificate="certificate"
                            @click="handleCertificateClick" />
                    </div>
                </div>

                <!-- 详细信息面板 -->
                <div
                    v-if="selectedItem"
                    class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <h2
                        class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        详细信息
                    </h2>
                    <pre
                        class="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto"
                        >{{ JSON.stringify(selectedItem, null, 2) }}</pre
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AchievementCard from "@/components/AchievementCard.vue";
import CertificateCard from "@/components/CertificateCard.vue";
import { loadAchievementData } from "@/utils/achievement-data";
import type { AchievementData } from "@/utils/achievement-data";
import type { IAchievement, ICertificate } from "@/types/achievements";

// 响应式数据
const loading = ref(true);
const error = ref<string | null>(null);
const achievementData = ref<AchievementData | null>(null);
const selectedItem = ref<IAchievement | ICertificate | null>(null);

// 计算属性
const displayedAchievements = computed(() => {
    if (!achievementData.value) return [];
    return achievementData.value.achievements.slice(0, 6);
});

// 加载数据
async function loadData() {
    try {
        loading.value = true;
        error.value = null;
        achievementData.value = await loadAchievementData();
    } catch (err) {
        error.value = err instanceof Error ? err.message : "加载数据失败";
        console.error("加载成就数据失败:", err);
    } finally {
        loading.value = false;
    }
}

// 处理成就点击
function handleAchievementClick(achievement: IAchievement) {
    selectedItem.value = achievement;
    console.log("点击成就:", achievement);
}

// 处理证书点击
function handleCertificateClick(certificate: ICertificate) {
    selectedItem.value = certificate;
    console.log("点击证书:", certificate);
}

// 组件挂载时加载数据
onMounted(() => {
    loadData();
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}
</style>
