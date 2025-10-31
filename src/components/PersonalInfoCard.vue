<template>
    <div
        class="personal-info-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <!-- 头像和基本信息 -->
        <div class="flex items-center space-x-4 mb-6">
            <div class="relative">
                <img
                    :src="avatarUrl"
                    :alt="`${personalInfo.name}的头像`"
                    class="w-20 h-20 rounded-full object-cover border-4 border-primary-200 dark:border-primary-700"
                    @error="handleImageError" />
                <div
                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>

            <div class="flex-1">
                <h1
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {{ personalInfo.name }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                    {{ formatAge(personalInfo.birthDate) }} ·
                    {{ personalInfo.location }}
                </p>
                <p class="text-primary-600 dark:text-primary-400 font-medium">
                    期望薪资：{{ personalInfo.expectedSalary }}
                </p>
            </div>
        </div>

        <!-- 个人简介 -->
        <div class="mb-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                个人简介
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ personalInfo.bio }}
            </p>
        </div>

        <!-- 职业目标 -->
        <div class="mb-6" v-if="personalInfo.careerObjective">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                职业目标
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ personalInfo.careerObjective }}
            </p>
        </div>

        <!-- 联系方式 -->
        <div class="mb-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                联系方式
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                    v-for="contact in contactList"
                    :key="contact.type"
                    class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="w-5 h-5 text-primary-600 dark:text-primary-400">
                        <!-- 这里可以放置图标组件 -->
                        <span class="text-sm">{{ contact.icon }}</span>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ contact.label }}
                        </p>
                        <p class="text-gray-900 dark:text-white font-medium">
                            {{ contact.value }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 个人特质 -->
        <div class="mb-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                个人特质
            </h3>
            <div class="flex flex-wrap gap-2">
                <span
                    v-for="trait in personalInfo.personalTraits"
                    :key="trait"
                    class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm">
                    {{ trait }}
                </span>
            </div>
        </div>

        <!-- 语言能力 -->
        <div class="mb-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                语言能力
            </h3>
            <div class="space-y-3">
                <div
                    v-for="language in personalInfo.languages"
                    :key="language.name"
                    class="flex items-center justify-between">
                    <div>
                        <span
                            class="text-gray-900 dark:text-white font-medium"
                            >{{ language.name }}</span
                        >
                        <span class="text-gray-500 dark:text-gray-400 ml-2">{{
                            language.level
                        }}</span>
                    </div>
                    <div class="flex-1 mx-4">
                        <div
                            class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                :style="{
                                    width: `${language.proficiency}%`,
                                }"></div>
                        </div>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                        >{{ language.proficiency }}%</span
                    >
                </div>
            </div>
        </div>

        <!-- 工作可用性 -->
        <div>
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                工作可用性
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        当前状态
                    </p>
                    <p class="text-gray-900 dark:text-white font-medium">
                        {{ personalInfo.availability.status }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        通知期
                    </p>
                    <p class="text-gray-900 dark:text-white font-medium">
                        {{ personalInfo.availability.noticePeriod }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        工作类型
                    </p>
                    <p class="text-gray-900 dark:text-white font-medium">
                        {{ personalInfo.availability.workType.join("、") }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        期望地点
                    </p>
                    <p class="text-gray-900 dark:text-white font-medium">
                        {{
                            personalInfo.availability.preferredLocation.join(
                                "、",
                            )
                        }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { IPersonalInfo } from "@/types/personal";
import {
    getContactInfoList,
    formatAge,
    getAvatarUrl,
} from "@/utils/personal-data";

interface Props {
    personalInfo: IPersonalInfo;
}

const props = defineProps<Props>();

// 计算属性
const contactList = computed(() => getContactInfoList(props.personalInfo));
const avatarUrl = computed(() => getAvatarUrl(props.personalInfo.avatar));

// 响应式数据
const imageError = ref(false);

// 方法
const handleImageError = () => {
    imageError.value = true;
    // 可以在这里设置默认头像
};
</script>

<style scoped>
.personal-info-card {
    /* 自定义样式 */
}
</style>
