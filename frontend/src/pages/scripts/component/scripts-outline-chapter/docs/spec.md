# ScriptOutline React Flow 迁移规范

## 1. 概述
将 `ScriptOutline` 组件从 Ant Design Tree 迁移至基于 React Flow 的实现，以改善用户体验和可视化效果。新实现将支持树状结构（节 -> 章 -> 集），并提供拖拽、上下文菜单和内联编辑等高级交互功能。

## 2. 架构设计

### 2.1 布局策略
-   **库**: `dagre`（通过 `@xyflow/react` 工具或直接使用）实现自动分层布局。
-   **方向**: 从左到右 (LR) 或从上到下 (TB)，用户可配置或响应式。
-   **节点**: 为 `节`、`章`、`集` 定制节点。
-   **边**: 具有动态样式的贝塞尔曲线。

### 2.2 数据流
-   **数据源**: `ScriptOutline` 组件状态（从后端获取）。
-   **流程状态**: 从源数据派生的 `nodes` 和 `edges`。
-   **更新**: 用户交互（拖拽、编辑、添加）乐观地更新本地状态并触发后端 API 调用。失败时触发回滚。

## 3. 数据结构

### 3.1 节点类型
```typescript
type NodeType = 'section' | 'chapter' | 'episode';

interface CustomNodeData {
  title: string;
  subtitle?: string;
  status?: 'completed' | 'pending' | 'conflict';
  wordCount?: number;
  isLeaf?: boolean;
  onEdit?: (id: string, type: NodeType) => void;
  onAddChild?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### 3.2 后端对齐
-   确保 `节`、`章`、`集` 的严格类型 DTO。
-   处理拖拽时的 `sortIndex` 更新。

## 4. 组件

### 4.1 ScriptOutlineFlow (主容器)
-   管理 `ReactFlow` 实例。
-   处理 `nodes`、`edges`、`onNodesChange`、`onEdgesChange`。
-   集成 `dagre` 布局逻辑。
-   处理全局工具栏和键盘快捷键。

### 4.2 自定义节点
-   **SectionNode**: 独特样式，包含章节摘要信息。
-   **ChapterNode**: 包含集数/字数统计。
-   **EpisodeNode**: 叶节点，显示状态。
-   **通用功能**: 悬停工具栏、拖拽手柄、双击编辑。

### 4.3 EpisodeEditorDrawer (重构)
-   替换集的 `NodeEditorDrawer`。
-   集成 `TextEditorPanel` 进行富文本编辑。
-   实现自动保存（防抖）。

### 4.4 InlineEditor
-   用于直接在节点上编辑节和章的标题。

## 5. 交互功能
-   **拖拽功能**: 在同一父节点内重新排序节点或将节点移动到不同父节点（如果逻辑允许）。更新 `sortIndex`。
-   **上下文菜单**: 右键点击节点。选项：插入后续、插入子级、删除、复制。
-   **快捷键**:
    -   `Enter`: 添加同级。
    -   `Tab`: 添加子级。
    -   `Delete`: 删除节点。
    -   `Esc`: 取消编辑。

## 6. 性能优化
-   **记忆化**: 对自定义节点使用 `React.memo`。
-   **虚拟化**: React Flow 默认处理此功能。
-   **Web Worker**: 如果节点数量 > 500，则卸载繁重的 `dagre` 布局计算（可选，从主线程开始）。

## 7. 样式设计
-   使用 CSS Modules 或 Styled Components。
-   使用 CSS 变量支持深色/浅色模式。
-   为边缘路径和节点过渡添加动画效果。

## 8. 测试
-   **单元测试**: Jest + RTL 用于工具函数（布局、数据转换）和自定义节点。
-   **端到端测试**: Cypress 用于拖拽、编辑流程。
