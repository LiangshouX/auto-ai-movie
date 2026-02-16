# ScriptOutline React Flow 迁移任务

## 1. 环境设置与依赖
- [ ] 安装/验证 `dagre`、`@xyflow/react`（如果尚未正确配置）。
- [ ] 创建文件夹结构：`components/`、`utils/`、`hooks/`。

## 2. 数据层与工具
- [ ] 创建 `outline-utils.ts` 用于严格类型的转换：`DTO -> ReactFlow Node/Edge`。
- [ ] 使用 `dagre` 实现 `layout-utils.ts` 进行树形布局（处理 节 -> 章 -> 集 层级结构）。
- [ ] 创建自定义钩子 `useOutlineState` 用于获取/同步数据。

## 3. 核心组件实现
- [ ] 创建 `ScriptOutlineFlow.tsx` 骨架。
- [ ] 实现 `CustomNode.tsx` 基础组件（带手柄）。
- [ ] 实现特定节点：`SectionNode`、`ChapterNode`、`EpisodeNode`。
- [ ] 将 `ScriptOutlineFlow` 集成到 `ScriptOutline.tsx` 中。

## 4. 交互功能
- [ ] 实现 `onNodesChange` 和 `onEdgesChange` 处理程序。
- [ ] 实现 `onNodeDragStop` 用于重新排序（更新后端 sortIndex）。
- [ ] 添加 `ContextMenu` 组件并附加到节点。
- [ ] 实现键盘快捷键（`useKeyboardShortcuts` 钩子）。

## 5. 编辑功能
- [ ] 创建 `InlineEditor.tsx` 用于快速标题编辑。
- [ ] 使用 `TextEditorPanel` 将 `NodeEditorDrawer` 重构为 `EpisodeEditorDrawer`。
- [ ] 为集内容实现自动保存逻辑（防抖）。
- [ ] 添加全局工具栏 "添加节"。

## 6. 样式美化
- [ ] 应用项目设计令牌（颜色、排版）。
- [ ] 实现深色/浅色模式支持。
- [ ] 为边缘路径和节点悬停状态添加动画。
- [ ] 添加加载/错误状态和吐司通知。

## 7. 性能优化
- [ ] 对自定义节点组件进行记忆化。
- [ ] 验证 500+ 节点时 60fps 的滚动/拖拽性能。
- [ ] （可选）如果性能下降，将布局计算移至 Web Worker。

## 8. 测试
- [ ] 为 `outline-utils.ts` 和 `layout-utils.ts` 编写单元测试。
- [ ] 为 `CustomNode` 编写组件测试。
- [ ] 为 "添加节 -> 添加章 -> 添加集" 编写端到端测试。
- [ ] 为 "拖拽集重新排序" 编写端到端测试。

## 9. 文档
- [ ] 更新 README，包含架构和使用指南。
- [ ] 创建 CHANGELOG.md。
