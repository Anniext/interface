# TypeScript 开发规范

## 类型定义标准

### 接口和类型

- 接口名称使用 PascalCase，以 I 开头（如：IUserData）
- 类型别名使用 PascalCase（如：UserStatus）
- 枚举使用 PascalCase（如：UserRole）

### 函数类型

- 优先使用函数声明而非函数表达式
- 为所有函数参数和返回值定义明确类型
- 使用泛型提高代码复用性

### 严格模式

- 启用 strict 模式
- 禁用 any 类型，使用 unknown 替代
- 使用类型断言时必须添加注释说明原因

## 代码组织

### 文件结构

- types/ 目录存放类型定义
- utils/ 目录存放工具函数
- composables/ 目录存放组合式函数

### 导入导出

- 使用命名导出优于默认导出
- 按字母顺序组织导入语句
- 分组导入：第三方库 -> 本地模块
