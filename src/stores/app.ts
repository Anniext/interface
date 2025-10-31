// 应用全局状态管理

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ThemeType, DeviceType } from "@/types/common";

export const useAppStore = defineStore("app", () => {
    // 状态
    const isLoading = ref(false);
    const currentSection = ref("home");
    const theme = ref<ThemeType>("dark");
    const animationsEnabled = ref(true);
    const deviceType = ref<DeviceType>("desktop");
    const isMenuOpen = ref(false);

    // 计算属性
    const isDarkMode = computed(() => theme.value === "dark");
    const isMobile = computed(() => deviceType.value === "mobile");
    const isTablet = computed(() => deviceType.value === "tablet");
    const isDesktop = computed(() => deviceType.value === "desktop");

    // 方法
    const setLoading = (loading: boolean) => {
        isLoading.value = loading;
    };

    const setCurrentSection = (section: string) => {
        currentSection.value = section;
    };

    const toggleTheme = () => {
        theme.value = theme.value === "light" ? "dark" : "light";
        // 更新 HTML 类名
        document.documentElement.classList.toggle(
            "dark",
            theme.value === "dark",
        );
    };

    const setTheme = (newTheme: ThemeType) => {
        theme.value = newTheme;
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const toggleAnimations = () => {
        animationsEnabled.value = !animationsEnabled.value;
        // 更新 HTML 类名
        document.documentElement.classList.toggle(
            "reduce-motion",
            !animationsEnabled.value,
        );
    };

    const setAnimationsEnabled = (enabled: boolean) => {
        animationsEnabled.value = enabled;
        document.documentElement.classList.toggle("reduce-motion", !enabled);
    };

    const setDeviceType = (type: DeviceType) => {
        deviceType.value = type;
    };

    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
        isMenuOpen.value = false;
    };

    // 初始化应用设置
    const initializeApp = () => {
        // 检测用户偏好的主题
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const savedTheme = localStorage.getItem("theme") as ThemeType;

        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? "dark" : "light");
        }

        // 检测用户偏好的动画设置
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const savedAnimations = localStorage.getItem("animationsEnabled");

        if (savedAnimations !== null) {
            setAnimationsEnabled(JSON.parse(savedAnimations));
        } else {
            setAnimationsEnabled(!prefersReducedMotion);
        }

        // 检测设备类型
        const updateDeviceType = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setDeviceType("desktop");
            } else if (width >= 768) {
                setDeviceType("tablet");
            } else {
                setDeviceType("mobile");
            }
        };

        updateDeviceType();
        window.addEventListener("resize", updateDeviceType);
    };

    // 保存设置到本地存储
    const saveSettings = () => {
        localStorage.setItem("theme", theme.value);
        localStorage.setItem(
            "animationsEnabled",
            JSON.stringify(animationsEnabled.value),
        );
    };

    return {
        // 状态
        isLoading,
        currentSection,
        theme,
        animationsEnabled,
        deviceType,
        isMenuOpen,

        // 计算属性
        isDarkMode,
        isMobile,
        isTablet,
        isDesktop,

        // 方法
        setLoading,
        setCurrentSection,
        toggleTheme,
        setTheme,
        toggleAnimations,
        setAnimationsEnabled,
        setDeviceType,
        toggleMenu,
        closeMenu,
        initializeApp,
        saveSettings,
    };
});
