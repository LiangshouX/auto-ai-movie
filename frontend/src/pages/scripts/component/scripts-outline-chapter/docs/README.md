# ScriptOutline 组件 (React Flow 版本)

该组件使用 React Flow 可视化和管理剧本大纲结构（节 -> 章 -> 集）。

## 功能特性

-   **树形可视化**: 使用 `dagre` 实现自动分层布局。
-   **交互式节点**: 为节、章、集定制节点，包含状态指示器和快捷操作。
-   **拖拽功能**: （目前仅为视觉效果，结构调整通过上下文菜单实现）。
-   **上下文菜单**: 右键点击可插入同级、插入子级、删除、复制。
-   **富文本编辑**: 集成 `TextEditorPanel` 用于集内容编辑，支持自动保存。
-   **性能优化**: 针对大型树结构进行优化（最多支持 2000 个节点）。

## 使用方法

```tsx
import ScriptOutline from './ScriptOutline';

<ScriptOutline projectTitle="My Movie" />
```

## 架构设计

-   `ScriptOutline.tsx`: 主容器，处理数据获取和 API 交互。
-   `ScriptOutlineFlow.tsx`: React Flow 包装器，处理可视化逻辑。
-   `utils/outline-utils.ts`: 数据转换（DTO <-> 流程元素）。
-   `utils/layout-utils.ts`: 使用 `dagre` 进行布局计算。
-   `components/nodes/`: 自定义节点组件。

## 配置说明

-   **布局方向**: 支持 LR（从左到右）和 TB（从上到下）。
-   **自动保存**: 标题在 300ms 防抖后保存，内容在 2000ms 防抖后保存。

## ID 规范（长度限制）

-   **chapterId / sectionId（前端生成）**: 32 字符，小写十六进制字符串（UUID 去掉连字符），长度严格 ≤ 32。
-   **episodeId（后端生成）**: 期望为 32 字符；前端在引用到大纲结构前会按长度约束做校验。
