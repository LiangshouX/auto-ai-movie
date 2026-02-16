# 更新日志

## [1.0.0] - React Flow 迁移

### 新增功能
-   将 `ScriptOutline` 从 Ant Design Tree 迁移到 React Flow。
-   添加了集成 `dagre` 布局的 `ScriptOutlineFlow` 组件。
-   添加了自定义节点：具有特定样式和操作的 `SectionNode`、`ChapterNode`、`EpisodeNode`。
-   添加了用于节点操作的 `ContextMenu` 组件（插入同级、插入子级、删除、复制）。
-   添加了集成 `TextEditorPanel` 和自动保存功能的 `EpisodeEditorDrawer`（防抖 300ms/2s）。
-   添加了用于图形布局的 `utils/layout-utils.ts`。
-   添加了 `utils/outline-utils.ts` 转换函数。

### 变更内容
-   用 React Flow 逻辑替换了 Ant Design Tree 逻辑。
-   优化了 `ScriptOutline` 的状态管理以适应基于流程的交互。
-   更新了样式以匹配项目设计令牌（节用蓝色，章用绿色，集用橙色）。

### 修复问题
-   解决了大型树渲染性能问题。
-   改进了所有大纲组件的类型定义。

### 已知问题
-   拖拽结构调整目前仅为视觉效果；请使用上下文菜单进行结构调整。
-   复制功能为占位符。
