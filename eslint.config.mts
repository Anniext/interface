import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
// @ts-ignore - 类型兼容性问题，但功能正常
import vuePlugin from "eslint-plugin-vue";
// @ts-ignore - 类型兼容性问题，但功能正常
import vueParser from "vue-eslint-parser";

export default [
    // JavaScript/TypeScript 基础配置
    js.configs.recommended,

    // TypeScript 配置
    ...tseslint.configs.recommended,

    // JavaScript/TypeScript 文件配置
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                EventListener: "readonly",
            },
        },
        rules: {
            // 通用代码质量规则
            "no-console":
                process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger":
                process.env.NODE_ENV === "production" ? "warn" : "off",
            "prefer-const": "error",
            "no-var": "error",
            "no-unused-vars": "off", // 使用 TypeScript 的版本
            "@typescript-eslint/no-unused-vars": "off", // 忽略未使用变量警告
            "@typescript-eslint/no-explicit-any": "off", // 忽略 any 类型警告
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/ban-ts-comment": "off", // 忽略 @ts-ignore 警告
            "prefer-spread": "off", // 忽略使用扩展运算符的建议
            "no-case-declarations": "off", // 忽略 case 块中的词法声明警告
            "no-undef": "off", // 在 TypeScript 项目中关闭，因为 TypeScript 会处理
        },
    },

    // Vue 文件配置
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: "@typescript-eslint/parser",
                ecmaVersion: "latest",
                sourceType: "module",
                extraFileExtensions: [".vue"],
            },
            globals: {
                ...globals.browser,
                EventListener: "readonly",
            },
        },
        plugins: {
            // @ts-ignore - 类型兼容性问题，但功能正常
            vue: vuePlugin,
        },
        rules: {
            // Vue 3 基础规则
            "vue/no-unused-vars": "off", // 忽略 Vue 未使用变量警告
            "vue/no-unused-components": "off", // 忽略未使用组件警告
            "vue/multi-word-component-names": "error",
            "vue/component-definition-name-casing": ["error", "PascalCase"],
            "vue/component-name-in-template-casing": ["error", "PascalCase"],

            // Vue 3 推荐规则
            "vue/require-default-prop": "off",
            "vue/require-explicit-emits": "error",
            "vue/prefer-import-from-vue": "error",
            "vue/no-deprecated-slot-attribute": "error",
            "vue/no-deprecated-slot-scope-attribute": "error",
            "vue/no-v-html": "off", // 忽略 v-html 安全警告

            // 代码风格规则
            "vue/html-self-closing": "off", // 忽略 HTML 自闭合标签检查
            "vue/max-attributes-per-line": "off", // 忽略每行最大属性数量检查
            "vue/html-indent": "off", // 忽略 HTML 缩进检查
            "vue/script-indent": "off", // 忽略 script 缩进检查
            "vue/html-closing-bracket-newline": "off", // 忽略 HTML 标签换行检查
            "vue/html-closing-bracket-spacing": "off", // 忽略 HTML 标签间距检查
            "vue/prop-name-casing": "off", // 忽略 prop 命名检查
            "vue/attribute-hyphenation": "off", // 忽略属性连字符检查

            // Composition API 规则
            "vue/no-ref-as-operand": "error",

            // 禁用一些在 Vue 文件中可能误报的 TypeScript 规则
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off", // 在 Vue 文件中也忽略 any 类型警告
        },
    },

    // 忽略文件配置
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "public/**",
            "*.config.js",
            "*.config.ts",
            ".vscode/**",
            ".idea/**",
            ".git/**",
        ],
    },
];
