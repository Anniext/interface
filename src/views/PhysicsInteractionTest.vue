<!-- 物理交互系统测试页面 -->
<template>
    <div class="physics-interaction-test min-h-screen bg-gray-900 text-white">
        <!-- 页面标题 -->
        <div class="p-6 border-b border-gray-700">
            <h1 class="text-3xl font-bold text-center">物理交互系统测试</h1>
            <p class="text-center text-gray-400 mt-2">
                测试鼠标/触摸交互、碰撞检测和约束系统
            </p>
        </div>

        <!-- 交互式物理世界 -->
        <div class="p-6">
            <InteractivePhysicsWorld
                :width="800"
                :height="600"
                :debug="true"
                :gravity="{ x: 0, y: 0.5 }"
                :interaction-radius="60"
                @body-added="onBodyAdded"
                @body-removed="onBodyRemoved"
                @collision="onCollision"
                @constraint-created="onConstraintCreated"
                @constraint-broken="onConstraintBroken" />
        </div>

        <!-- 使用说明 -->
        <div class="p-6 border-t border-gray-700">
            <h2 class="text-xl font-bold mb-4">使用说明</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h3 class="font-bold text-blue-400 mb-2">鼠标交互</h3>
                    <ul class="space-y-1 text-sm text-gray-300">
                        <li>• 点击空白区域：创建新物体</li>
                        <li>• 点击物体：拖拽物体</li>
                        <li>• 拖拽移动：应用力到物体</li>
                        <li>• 释放鼠标：结束交互</li>
                    </ul>
                </div>

                <div class="bg-gray-800 p-4 rounded-lg">
                    <h3 class="font-bold text-green-400 mb-2">触摸交互</h3>
                    <ul class="space-y-1 text-sm text-gray-300">
                        <li>• 单指触摸：与鼠标交互相同</li>
                        <li>• 双指触摸：在中心点应用强力</li>
                        <li>• 多点触摸：支持多点交互</li>
                        <li>• 手势识别：缩放和旋转</li>
                    </ul>
                </div>

                <div class="bg-gray-800 p-4 rounded-lg">
                    <h3 class="font-bold text-yellow-400 mb-2">约束系统</h3>
                    <ul class="space-y-1 text-sm text-gray-300">
                        <li>• 弹簧约束：连接两个物体</li>
                        <li>• 绳索约束：限制最大距离</li>
                        <li>• 固定约束：固定到世界坐标</li>
                        <li>• 约束断裂：超过阈值自动断裂</li>
                    </ul>
                </div>

                <div class="bg-gray-800 p-4 rounded-lg">
                    <h3 class="font-bold text-purple-400 mb-2">碰撞检测</h3>
                    <ul class="space-y-1 text-sm text-gray-300">
                        <li>• 圆形-圆形碰撞</li>
                        <li>• 圆形-矩形碰撞</li>
                        <li>• 矩形-矩形碰撞</li>
                        <li>• 多边形碰撞检测</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 事件日志 -->
        <div class="p-6 border-t border-gray-700">
            <h2 class="text-xl font-bold mb-4">事件日志</h2>
            <div class="bg-gray-800 p-4 rounded-lg h-40 overflow-y-auto">
                <div
                    v-for="(log, index) in eventLogs"
                    :key="index"
                    class="text-sm font-mono mb-1"
                    :class="{
                        'text-green-400': log.type === 'body',
                        'text-blue-400': log.type === 'collision',
                        'text-yellow-400': log.type === 'constraint',
                        'text-red-400': log.type === 'error',
                    }">
                    <span class="text-gray-500">{{ log.timestamp }}</span>
                    {{ log.message }}
                </div>
                <div
                    v-if="eventLogs.length === 0"
                    class="text-gray-500 text-center">
                    暂无事件日志
                </div>
            </div>
        </div>

        <!-- 性能统计 -->
        <div class="p-6 border-t border-gray-700">
            <h2 class="text-xl font-bold mb-4">性能统计</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-800 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-400">
                        {{ stats.totalBodies }}
                    </div>
                    <div class="text-sm text-gray-400">总物体数</div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-400">
                        {{ stats.totalConstraints }}
                    </div>
                    <div class="text-sm text-gray-400">总约束数</div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-400">
                        {{ stats.totalCollisions }}
                    </div>
                    <div class="text-sm text-gray-400">总碰撞数</div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-400">
                        {{ stats.interactionCount }}
                    </div>
                    <div class="text-sm text-gray-400">交互次数</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import InteractivePhysicsWorld from "@/components/physics/InteractivePhysicsWorld.vue";
import type { ICollisionEvent } from "@/types/physics";

// 事件日志
interface EventLog {
    timestamp: string;
    type: "body" | "collision" | "constraint" | "error";
    message: string;
}

const eventLogs = ref<EventLog[]>([]);
const maxLogs = 50;

// 性能统计
const stats = reactive({
    totalBodies: 0,
    totalConstraints: 0,
    totalCollisions: 0,
    interactionCount: 0,
});

/**
 * 添加事件日志
 */
function addLog(type: EventLog["type"], message: string) {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift({ timestamp, type, message });

    // 限制日志数量
    if (eventLogs.value.length > maxLogs) {
        eventLogs.value = eventLogs.value.slice(0, maxLogs);
    }
}

/**
 * 物体添加事件
 */
function onBodyAdded(bodyId: string) {
    stats.totalBodies++;
    addLog("body", `物体已添加: ${bodyId}`);
}

/**
 * 物体移除事件
 */
function onBodyRemoved(bodyId: string) {
    stats.totalBodies--;
    addLog("body", `物体已移除: ${bodyId}`);
}

/**
 * 碰撞事件
 */
function onCollision(event: ICollisionEvent) {
    stats.totalCollisions++;
    addLog(
        "collision",
        `碰撞发生: ${event.bodyA.id} <-> ${
            event.bodyB.id
        } (强度: ${event.impulse.toFixed(2)})`,
    );
}

/**
 * 约束创建事件
 */
function onConstraintCreated(constraintId: string) {
    stats.totalConstraints++;
    addLog("constraint", `约束已创建: ${constraintId}`);
}

/**
 * 约束断裂事件
 */
function onConstraintBroken(constraintId: string) {
    stats.totalConstraints--;
    addLog("constraint", `约束已断裂: ${constraintId}`);
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
