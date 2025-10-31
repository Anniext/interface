import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// 路由配置
const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomePage.vue"),
        meta: {
            title: "首页",
            transition: "liquid",
            level: 0,
        },
    },
    // 业务页面路由
    {
        path: "/skills",
        name: "Skills",
        component: () => import("@/views/SkillsPage.vue"),
        meta: {
            title: "技能展示",
            transition: "slide",
            level: 1,
        },
    },
    {
        path: "/experience",
        name: "Experience",
        component: () => import("@/views/ExperiencePage.vue"),
        meta: {
            title: "工作经验",
            transition: "slide",
            level: 2,
        },
    },
    {
        path: "/projects",
        name: "Projects",
        component: () => import("@/views/ProjectsPage.vue"),
        meta: {
            title: "项目展示",
            transition: "slide",
            level: 3,
        },
    },
    {
        path: "/achievements",
        name: "Achievements",
        component: () => import("@/views/AchievementsPage.vue"),
        meta: {
            title: "获奖成就",
            transition: "slide",
            level: 4,
        },
    },
    // 测试页面路由
    {
        path: "/canvas-test",
        name: "CanvasTest",
        component: () => import("@/views/CanvasTest.vue"),
        meta: {
            title: "Canvas 测试",
            transition: "geometric",
            level: 10,
        },
    },
    {
        path: "/particle-test",
        name: "ParticleTest",
        component: () => import("@/views/ParticleTest.vue"),
        meta: {
            title: "粒子系统测试",
            transition: "geometric",
            level: 11,
        },
    },
    {
        path: "/shape-test",
        name: "ShapeTest",
        component: () => import("@/views/ShapeTest.vue"),
        meta: {
            title: "几何图形测试",
            transition: "geometric",
            level: 12,
        },
    },
    {
        path: "/particle-debug",
        name: "ParticleDebug",
        component: () => import("@/views/ParticleDebug.vue"),
        meta: {
            title: "粒子系统调试",
            transition: "geometric",
            level: 13,
        },
    },
    {
        path: "/simple-particle",
        name: "SimpleParticle",
        component: () => import("@/views/SimpleParticleTest.vue"),
        meta: {
            title: "简单粒子测试",
            transition: "geometric",
            level: 14,
        },
    },
    {
        path: "/physics-test",
        name: "PhysicsTest",
        component: () => import("@/views/PhysicsTest.vue"),
        meta: {
            title: "物理引擎测试",
            transition: "geometric",
            level: 15,
        },
    },
    {
        path: "/animation-demo",
        name: "AnimationDemo",
        component: () => import("@/views/AnimationDemo.vue"),
        meta: {
            title: "动画系统演示",
            transition: "geometric",
            level: 16,
        },
    },
    {
        path: "/physics-interaction-test",
        name: "PhysicsInteractionTest",
        component: () => import("@/views/PhysicsInteractionTest.vue"),
        meta: {
            title: "物理交互测试",
            transition: "geometric",
            level: 17,
        },
    },
    {
        path: "/physics-animation-demo",
        name: "PhysicsAnimationDemo",
        component: () => import("@/views/PhysicsAnimationDemo.vue"),
        meta: {
            title: "物理动画效果演示",
            transition: "geometric",
            level: 18,
        },
    },
    {
        path: "/element-animation-demo",
        name: "ElementAnimationDemo",
        component: () => import("@/views/ElementAnimationDemo.vue"),
        meta: {
            title: "元素动画效果演示",
            transition: "geometric",
            level: 19,
        },
    },
    {
        path: "/scroll-trigger-demo",
        name: "ScrollTriggerDemo",
        component: () => import("@/views/ScrollTriggerDemo.vue"),
        meta: {
            title: "ScrollTrigger 滚动动画演示",
            transition: "geometric",
            level: 20,
        },
    },
    {
        path: "/animation-performance-demo",
        name: "AnimationPerformanceDemo",
        component: () => import("@/views/AnimationPerformanceDemo.vue"),
        meta: {
            title: "动画性能监控演示",
            transition: "geometric",
            level: 21,
        },
    },
    // 测试路由
    {
        path: "/test",
        name: "Test",
        component: () => import("@/views/TestPage.vue"),
        meta: {
            title: "测试页面",
            transition: "fade",
            level: 99,
        },
    },
    {
        path: "/achievement-test",
        name: "AchievementTest",
        component: () => import("@/views/AchievementTestPage.vue"),
        meta: {
            title: "成就数据测试",
            transition: "fade",
            level: 100,
        },
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

// 简化的路由守卫 - 暂时移除过渡动画逻辑
router.beforeEach(async (to, from, next) => {
    console.log("路由导航:", from.path, "->", to.path);

    // 设置页面标题
    if (to.meta?.title) {
        document.title = `${to.meta.title} - 交互式简历网站`;
    }

    // 直接通过，不做任何阻拦
    next();
});

export default router;
