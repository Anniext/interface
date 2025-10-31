import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// 路由配置
const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
        meta: {
            title: "首页",
            transition: "liquid",
        },
    },
    {
        path: "/skills",
        name: "Skills",
        component: () => import("@/views/SkillsView.vue"),
        meta: {
            title: "技能展示",
            transition: "slide",
        },
    },
    {
        path: "/experience",
        name: "Experience",
        component: () => import("@/views/ExperienceView.vue"),
        meta: {
            title: "工作经验",
            transition: "slide",
        },
    },
    {
        path: "/projects",
        name: "Projects",
        component: () => import("@/views/ProjectsView.vue"),
        meta: {
            title: "项目作品",
            transition: "slide",
        },
    },
    {
        path: "/achievements",
        name: "Achievements",
        component: () => import("@/views/AchievementsView.vue"),
        meta: {
            title: "成就展示",
            transition: "slide",
        },
    },
    // 测试页面路由
    {
        path: "/canvas-test",
        name: "CanvasTest",
        component: () => import("@/views/CanvasTestView.vue"),
        meta: {
            title: "Canvas 测试",
            transition: "geometric",
        },
    },
    {
        path: "/particle-test",
        name: "ParticleTest",
        component: () => import("@/views/ParticleTestView.vue"),
        meta: {
            title: "粒子系统测试",
            transition: "geometric",
        },
    },
    {
        path: "/shape-test",
        name: "ShapeTest",
        component: () => import("@/views/ShapeTestView.vue"),
        meta: {
            title: "几何图形测试",
            transition: "geometric",
        },
    },
    {
        path: "/physics-test",
        name: "PhysicsTest",
        component: () => import("@/views/PhysicsTestView.vue"),
        meta: {
            title: "物理引擎测试",
            transition: "geometric",
        },
    },
    {
        path: "/animation-demo",
        name: "AnimationDemo",
        component: () => import("@/views/AnimationDemoView.vue"),
        meta: {
            title: "动画演示",
            transition: "geometric",
        },
    },
    {
        path: "/lottie-test",
        name: "LottieTest",
        component: () => import("@/views/LottieTestView.vue"),
        meta: {
            title: "Lottie 动画测试",
            transition: "geometric",
        },
    },
    // 404 页面
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFoundView.vue"),
        meta: {
            title: "页面未找到",
            transition: "fade",
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
