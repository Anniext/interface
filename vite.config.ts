import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@/components": resolve(__dirname, "src/components"),
            "@/views": resolve(__dirname, "src/views"),
            "@/utils": resolve(__dirname, "src/utils"),
            "@/types": resolve(__dirname, "src/types"),
            "@/stores": resolve(__dirname, "src/stores"),
            "@/assets": resolve(__dirname, "src/assets"),
            "@/composables": resolve(__dirname, "src/composables"),
        },
    },
    build: {
        target: "esnext",
        minify: "esbuild",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // 将大型库分离到单独的 chunk
                    if (id.includes("matter-js")) return "matter";
                    if (id.includes("gsap")) return "gsap";
                    if (id.includes("lottie-web")) return "lottie";
                    if (id.includes("vue") || id.includes("pinia"))
                        return "vue-vendor";
                },
            },
        },
        // 启用 gzip 压缩
        reportCompressedSize: true,
        // 设置 chunk 大小警告限制
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ["matter-js", "gsap", "lottie-web", "vue", "pinia"],
    },
    server: {
        port: 3000,
        open: true,
        cors: true,
    },
    preview: {
        port: 4173,
        open: true,
    },
});
