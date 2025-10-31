<template>
    <div class="skills-display">
        <!-- 技能总览 -->
        <div class="skills-overview mb-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                    class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                    <div
                        class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {{ skillsData.skillSummary.totalSkills }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        技能总数
                    </div>
                </div>
                <div
                    class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                    <div
                        class="text-2xl font-bold text-green-600 dark:text-green-400">
                        {{ skillsData.skillSummary.averageLevel }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        平均等级
                    </div>
                </div>
                <div
                    class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                    <div
                        class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ skillsData.skillSummary.totalExperience }}年
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        总经验
                    </div>
                </div>
                <div
                    class="stat-card bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                    <div
                        class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {{ skillsData.skillCategories.length }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        技能分类
                    </div>
                </div>
            </div>
        </div>

        <!-- 技能分类展示 -->
        <div class="skills-categories space-y-8">
            <div
                v-for="category in skillsData.skillCategories"
                :key="category.id"
                class="skill-category">
                <!-- 分类标题 -->
                <div class="flex items-center mb-4">
                    <div
                        class="w-4 h-4 rounded-full mr-3"
                        :style="{ backgroundColor: category.color }"></div>
                    <h3
                        class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ category.name }}
                    </h3>
                    <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({{ category.skills.length }} 项)
                    </span>
                </div>

                <!-- 技能列表 -->
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        v-for="skill in category.skills"
                        :key="skill.id"
                        class="skill-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <!-- 技能头部 -->
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <div
                                    class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium mr-3"
                                    :style="{ backgroundColor: skill.color }">
                                    {{ skill.name.charAt(0) }}
                                </div>
                                <div>
                                    <h4
                                        class="font-medium text-gray-900 dark:text-white">
                                        {{ skill.name }}
                                    </h4>
                                    <p
                                        class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ skill.experience }}年经验
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div
                                    class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{ skill.level }}/10
                                </div>
                                <div
                                    class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ getSkillLevelLabel(skill.level) }}
                                </div>
                            </div>
                        </div>

                        <!-- 技能等级进度条 -->
                        <div class="mb-3">
                            <div
                                class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                    class="h-2 rounded-full transition-all duration-300"
                                    :style="{
                                        width: `${(skill.level / 10) * 100}%`,
                                        backgroundColor: skill.color,
                                    }"></div>
                            </div>
                        </div>

                        <!-- 技能描述 -->
                        <p
                            v-if="skill.description"
                            class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {{ skill.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 学习目标 -->
        <div
            class="learning-goals mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎯 学习目标
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                    v-for="goal in skillsData.skillSummary.learningGoals"
                    :key="goal"
                    class="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span class="text-gray-700 dark:text-gray-200">{{
                        goal
                    }}</span>
                </div>
            </div>
        </div>

        <!-- 最近学习的技能 -->
        <div class="recent-skills mt-6">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🆕 最近学习
            </h3>
            <div class="flex flex-wrap gap-2">
                <span
                    v-for="skillId in skillsData.skillSummary.recentlyLearned"
                    :key="skillId"
                    class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    {{ getSkillNameById(skillId) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ISkillsData } from "@/types/skills";
import { getSkillLevelLabel, getSkillById } from "@/utils/skills-data";

interface Props {
    skillsData: ISkillsData;
}

const props = defineProps<Props>();

// 计算属性
const getSkillNameById = (skillId: string): string => {
    const skill = getSkillById(props.skillsData, skillId);
    return skill?.name || skillId;
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.skill-card:hover {
    transform: translateY(-2px);
}

.stat-card {
    transition: all 0.2s ease-in-out;
}

.stat-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
