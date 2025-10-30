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
        },
    },
    {
        path: "/canvas-test",
        name: "CanvasTest",
        component: () => import("@/views/CanvasTest.vue"),
        meta: {
            title: "Canvas 测试",
        },
    },
    {
        path: "/particle-test",
        name: "ParticleTest",
        component: () => import("@/views/ParticleTest.vue"),
        meta: {
            title: "粒子系统测试",
        },
    },
    {
        path: "/shape-test",
        name: "ShapeTest",
        component: () => import("@/views/ShapeTest.vue"),
        meta: {
            title: "几何图形测试",
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

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta?.title) {
        document.title = `${to.meta.title} - 交互式简历网站`;
    }

    next();
});

export default router;
