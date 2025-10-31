<template>
    <div class="skills-test-page min-h-screen bg-gray-900 text-white p-8">
        <h1 class="text-3xl font-bold mb-8">技能数据测试页面</h1>

        <!-- 数据加载状态 -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">数据加载状态</h2>
            <div class="bg-gray-800 p-4 rounded">
                <p>技能数据是否加载: {{ skillsData ? "是" : "否" }}</p>
                <p v-if="skillsData">
                    技能分类数量: {{ skillsData.skillCategories.length }}
                </p>
                <p v-if="skillsData">总技能数量: {{ allSkillsCount }}</p>
                <p>等级>=7的技能数量: {{ topSkillsCount }}</p>
            </div>
        </div>

        <!-- 原始技能数据 -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">原始技能数据</h2>
            <div class="bg-gray-800 p-4 rounded max-h-96 overflow-y-auto">
                <pre class="text-sm">{{
                    JSON.stringify(skillsData, null, 2)
                }}</pre>
            </div>
        </div>

        <!-- 处理后的 topSkills -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">处理后的 topSkills</h2>
            <div class="bg-gray-800 p-4 rounded">
                <pre class="text-sm">{{
                    JSON.stringify(topSkills, null, 2)
                }}</pre>
            </div>
        </div>

        <!-- 技能列表展示 -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">技能列表展示</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="skill in topSkills"
                    :key="skill.id"
                    class="bg-gray-800 p-4 rounded"
                    :style="{ borderLeft: `4px solid ${skill.color}` }">
                    <h3 class="font-semibold">{{ skill.name }}</h3>
                    <p class="text-sm text-gray-400">
                        等级: {{ skill.level }}/10
                    </p>
                    <p class="text-sm" :style="{ color: skill.color }">
                        {{ skill.color }}
                    </p>
                </div>
            </div>
        </div>

        <!-- SkillDropEffect 组件测试 -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">SkillDropEffect 组件测试</h2>
            <div class="bg-gray-800 p-4 rounded">
                <SkillDropEffect
                    :skills="topSkills"
                    :width="800"
                    :height="400"
                    :show-controls="true"
                    :auto-start="false" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSkillsData } from "@/utils/skills-data";
import SkillDropEffect from "@/components/physics/SkillDropEffect.vue";
import type { ISkillsData } from "@/types/skills";

// 响应式数据
const skillsData = ref<ISkillsData | null>(null);

// 计算属性
const allSkillsCount = computed(() => {
    if (!skillsData.value) return 0;
    return skillsData.value.skillCategories.reduce(
        (total, cat) => total + cat.skills.length,
        0,
    );
});

const topSkills = computed(() => {
    if (!skillsData.value) {
        console.log("技能数据未加载");
        return [];
    }

    const allSkills = skillsData.value.skillCategories.flatMap(
        (cat) => cat.skills,
    );
    console.log("所有技能:", allSkills);

    const filteredSkills = allSkills.filter((skill) => skill.level >= 7);
    console.log("过滤后的技能 (level >= 7):", filteredSkills);

    const result = filteredSkills.slice(0, 12).map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        color: skill.color,
        icon: skill.icon,
    }));

    console.log("最终的 topSkills:", result);
    return result;
});

const topSkillsCount = computed(() => topSkills.value.length);

// 加载数据
const loadData = async () => {
    try {
        console.log("开始加载技能数据...");
        const data = await getSkillsData();
        console.log("技能数据加载成功:", data);
        skillsData.value = data;
    } catch (error) {
        console.error("加载技能数据失败:", error);
    }
};

onMounted(() => {
    loadData();
});
</script>
