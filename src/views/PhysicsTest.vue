<!-- 物理引擎测试页面 -->
<template>
    <div class="physics-test min-h-screen bg-gray-900 text-white">
        <!-- 页面标题 -->
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold text-center mb-8">
                Matter.js 物理引擎测试
            </h1>

            <!-- 说明文字 -->
            <div class="text-center mb-8 text-gray-300">
                <p class="mb-2">点击或触摸画布添加物理体</p>
                <p>使用右侧控制面板管理物理世界</p>
            </div>

            <!-- 物理世界组件 -->
            <div class="flex justify-center">
                <div
                    class="border-2 border-gray-700 rounded-lg overflow-hidden">
                    <PhysicsWorld
                        :width="800"
                        :height="600"
                        :debug="true"
                        :gravity="{ x: 0, y: 1 }"
                        @body-added="handleBodyAdded"
                        @body-removed="handleBodyRemoved"
                        @collision="handleCollision" />
                </div>
            </div>

            <!-- 事件日志 -->
            <div class="mt-8 max-w-4xl mx-auto">
                <h2 class="text-2xl font-bold mb-4">事件日志</h2>
                <div class="bg-gray-800 rounded-lg p-4 h-48 overflow-y-auto">
                    <div
                        v-for="(log, index) in eventLogs"
                        :key="index"
                        class="text-sm mb-1 font-mono"
                        :class="{
                            'text-green-400': log.type === 'added',
                            'text-red-400': log.type === 'removed',
                            'text-yellow-400': log.type === 'collision',
                            'text-blue-400': log.type === 'info',
                        }">
                        <span class="text-gray-500">[{{ log.timestamp }}]</span>
                        {{ log.message }}
                    </div>
                    <div
                        v-if="eventLogs.length === 0"
                        class="text-gray-500 text-center">
                        暂无事件日志
                    </div>
                </div>
                <button
                    @click="clearLogs"
                    class="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                    清空日志
                </button>
            </div>

            <!-- 物理引擎说明 -->
            <div class="mt-12 max-w-4xl mx-auto">
                <h2 class="text-2xl font-bold mb-4">功能说明</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-3 text-blue-400">
                            核心功能
                        </h3>
                        <ul class="space-y-2 text-gray-300">
                            <li>• Matter.js 2D 物理引擎集成</li>
                            <li>• 物理体工厂函数</li>
                            <li>• 生命周期管理系统</li>
                            <li>• 碰撞检测和响应</li>
                            <li>• 边界约束系统</li>
                        </ul>
                    </div>

                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-3 text-green-400">
                            交互功能
                        </h3>
                        <ul class="space-y-2 text-gray-300">
                            <li>• 鼠标/触摸创建物理体</li>
                            <li>• 实时调试信息显示</li>
                            <li>• 重力开关控制</li>
                            <li>• 批量添加随机物体</li>
                            <li>• 一键清空物理世界</li>
                        </ul>
                    </div>

                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-3 text-purple-400">
                            物理体类型
                        </h3>
                        <ul class="space-y-2 text-gray-300">
                            <li>
                                • <span class="text-blue-400">圆形</span> -
                                弹性球体
                            </li>
                            <li>
                                • <span class="text-green-400">矩形</span> -
                                方块物体
                            </li>
                            <li>
                                • <span class="text-orange-400">三角形</span> -
                                多边形物体
                            </li>
                            <li>• 静态边界墙体</li>
                            <li>• 自定义材质属性</li>
                        </ul>
                    </div>

                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-3 text-red-400">
                            性能优化
                        </h3>
                        <ul class="space-y-2 text-gray-300">
                            <li>• 物理体数量限制</li>
                            <li>• 自动清理静止物体</li>
                            <li>• 边界外物体移除</li>
                            <li>• 休眠机制优化</li>
                            <li>• 实时性能监控</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PhysicsWorld from "@/components/physics/PhysicsWorld.vue";

// 事件日志
interface EventLog {
    type: "added" | "removed" | "collision" | "info";
    message: string;
    timestamp: string;
}

const eventLogs = ref<EventLog[]>([]);

/**
 * 添加日志
 */
function addLog(type: EventLog["type"], message: string) {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift({
        type,
        message,
        timestamp,
    });

    // 限制日志数量
    if (eventLogs.value.length > 100) {
        eventLogs.value = eventLogs.value.slice(0, 100);
    }
}

/**
 * 处理物理体添加事件
 */
function handleBodyAdded(bodyId: string) {
    addLog("added", `物理体已添加: ${bodyId}`);
}

/**
 * 处理物理体移除事件
 */
function handleBodyRemoved(bodyId: string) {
    addLog("removed", `物理体已移除: ${bodyId}`);
}

/**
 * 处理碰撞事件
 */
function handleCollision(event: any) {
    addLog("collision", `碰撞检测: ${event.bodyA?.id} 与 ${event.bodyB?.id}`);
}

/**
 * 清空日志
 */
function clearLogs() {
    eventLogs.value = [];
    addLog("info", "事件日志已清空");
}

// 初始化日志
addLog("info", "物理引擎测试页面已加载");
</script>

<style scoped>
.physics-test {
    font-family: "Inter", system-ui, sans-serif;
}

/* 滚动条样式 */
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
