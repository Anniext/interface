# Vue 开发规范

## 组件开发标准

### 组件命名

- 组件文件名使用 PascalCase（如：UserProfile.vue）
- 组件内部名称使用 PascalCase
- 组件在模板中使用 kebab-case（如：<user-profile>）

### 组件结构

- 使用 Composition API 优先于 Options API
- 按照以下顺序组织代码：
  1. imports
  2. props 定义
  3. emits 定义
  4. 响应式数据
  5. 计算属性
  6. 方法
  7. 生命周期钩子

### TypeScript 集成

- 所有 Vue 组件必须使用 TypeScript
- 为 props 定义明确的类型
- 为 emits 定义明确的类型
- 使用 `defineComponent` 或 `<script setup lang="ts">`

## 样式规范

### CSS 组织

- 使用 scoped 样式避免样式污染
- 优先使用 CSS 变量进行主题管理
- 遵循 BEM 命名规范

### 响应式设计

- 移动端优先的响应式设计
- 使用语义化的断点名称
