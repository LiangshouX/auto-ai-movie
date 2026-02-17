# Chapter/Episode 保存策略

## 目标

- 避免新建桥段时因自动保存/防抖触发导致重复创建记录
- 关闭抽屉后不产生异步保存任务与控制台异常
- 在网络异常/离线状态下支持保存请求排队与重发

## 草稿机制

- 抽屉打开后，组件在本地维护 `draftEpisode`
- 所有表单输入（标题、内容）仅更新草稿状态，不触发网络请求
- 草稿包含 `draftKey`（32 位十六进制字符串），用于幂等与离线队列标识

## 保存触发规则

- 仅当用户点击【保存】按钮时，才会执行“创建或更新”
- 输入标题、编辑内容均不会触发任何创建/更新请求

## 创建与更新

- 创建：`POST /api/v1/episodes`，请求头携带 `Idempotency-Key: <draftKey>` 与 `X-Client-Request-Id: <draftKey>`
- 更新：`PUT /api/v1/episodes/{id}`，同样携带上述请求头
- 保存成功后：用返回的正式 `id` 覆盖草稿 `id`，并通过 `onSave` 回传上层状态与画布节点

## 幂等键规则

- `draftKey`：前端生成的 32 字符字符串
- 后端幂等策略：按业务 key `(projectId, chapterId, episodeTitle)` 视为同一条桥段，若已存在则返回首条记录

## 离线重发队列

- 保存失败且判定为网络类错误（无 HTTP 状态码或 5xx）时，会将请求写入 `localStorage` 队列 `episode_save_queue_v1`
- 应用恢复在线（`window.online` 事件）或抽屉打开时，自动尝试重发队列
- 重试上限：每条最多 10 次，队列最多保留 50 条

## 脏数据清理脚本

位置：
- `ai-movie-scripts/src/main/resources/sql/cleanup_duplicate_episodes_up.sql`
- `ai-movie-scripts/src/main/resources/sql/cleanup_duplicate_episodes_down.sql`

规则：
- 以 `(chapter_id, episode_title)` 为分组键
- 按 `created_at ASC, id ASC` 保留首条，其余移入 `scripts_episodes_trash` 并从主表删除
- 执行前自动全量备份到 `scripts_episodes_backup_full`

回滚：
- 执行 `cleanup_duplicate_episodes_down.sql` 可从 `scripts_episodes_backup_full` 恢复主表

