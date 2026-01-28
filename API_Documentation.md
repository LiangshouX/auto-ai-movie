# Auto-AI-Movie API 文档

## 项目概述

Auto-AI-Movie 是一个基于人工智能的电影剧本自动生成系统，提供从创意构思到剧本完成的全流程支持。

## 基础信息

- **基础URL**: `http://localhost:8080/api/v1`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **认证方式**: JWT Token（如需要）

---

## 1. 项目管理接口

### 1.1 创建项目

**请求路径**: `POST /api/v1/projects`

**描述**: 创建一个新的剧本项目

**请求参数**:
- 请求体: [ScriptProjectDTO](#scriptprojectdto) 对象

**请求示例**:
```json
{
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "CREATED",
  "theme": "",
  "summary": ""
}
```

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "CREATED",
  "theme": "",
  "summary": "",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:30:00"
}
```

### 1.2 根据ID获取项目

**请求路径**: `GET /api/v1/projects/{id}`

**描述**: 根据项目ID获取项目详细信息

**路径参数**:
- `id`: 项目ID

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "CREATED",
  "theme": "科幻冒险",
  "summary": "一个关于太空探索的故事",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:35:00"
}
```

### 1.3 获取所有项目

**请求路径**: `GET /api/v1/projects`

**描述**: 获取所有项目列表

**响应示例**:
```json
[
  {
    "id": "proj_123456",
    "name": "我的电影项目",
    "description": "项目描述",
    "status": "CREATED",
    "theme": "科幻冒险",
    "summary": "一个关于太空探索的故事",
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:35:00"
  }
]
```

### 1.4 更新项目

**请求路径**: `PUT /api/v1/projects/{id}`

**描述**: 根据ID更新项目信息

**路径参数**:
- `id`: 项目ID

**请求参数**:
- 请求体: [ScriptProjectDTO](#scriptprojectdto) 对象

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "更新后的项目描述",
  "status": "IN_PROGRESS",
  "theme": "科幻冒险",
  "summary": "一个关于太空探索的故事",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:40:00"
}
```

### 1.5 删除项目

**请求路径**: `DELETE /api/v1/projects/{id}`

**描述**: 根据ID删除项目

**路径参数**:
- `id`: 项目ID

**响应**: 状态码 204 (No Content)

### 1.6 更新项目主题

**请求路径**: `PATCH /api/v1/projects/{id}/theme`

**描述**: 更新项目的主题

**路径参数**:
- `id`: 项目ID

**请求参数**:
- 请求体: JSON对象
  - `theme`: 新的主题字符串

**请求示例**:
```json
{
  "theme": "科幻冒险"
}
```

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "CREATED",
  "theme": "科幻冒险",
  "summary": "",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:35:00"
}
```

### 1.7 更新项目摘要

**请求路径**: `PATCH /api/v1/projects/{id}/summary`

**描述**: 更新项目的摘要

**路径参数**:
- `id`: 项目ID

**请求参数**:
- 请求体: JSON对象
  - `summary`: 新的摘要字符串

**请求示例**:
```json
{
  "summary": "一个关于太空探索的故事"
}
```

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "CREATED",
  "theme": "",
  "summary": "一个关于太空探索的故事",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:35:00"
}
```

### 1.8 更新项目状态

**请求路径**: `PATCH /api/v1/projects/{id}/status`

**描述**: 更新项目的状态

**路径参数**:
- `id`: 项目ID

**请求参数**:
- 请求体: JSON对象
  - `status`: 新的状态字符串

**请求示例**:
```json
{
  "status": "COMPLETED"
}
```

**响应示例**:
```json
{
  "id": "proj_123456",
  "name": "我的电影项目",
  "description": "项目描述",
  "status": "COMPLETED",
  "theme": "",
  "summary": "",
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:35:00"
}
```

---

## 2. 章节管理接口

### 2.1 创建章节

**请求路径**: `POST /api/v1/projects/{projectId}/chapters`

**描述**: 为指定项目创建新的章节

**路径参数**:
- `projectId`: 项目ID

**请求参数**:
- 请求体: [ScriptChapterDTO](#scriptchapterdto) 对象

**请求示例**:
```json
{
  "title": "第一章：开始",
  "content": "这里是章节内容...",
  "chapterNumber": 1,
  "wordCount": 1000
}
```

**响应示例**:
```json
{
  "id": "chap_123456",
  "projectId": "proj_123456",
  "title": "第一章：开始",
  "content": "这里是章节内容...",
  "chapterNumber": 1,
  "wordCount": 1000,
  "createdAt": "2026-01-27T10:45:00",
  "updatedAt": "2026-01-27T10:45:00"
}
```

### 2.2 根据ID获取章节

**请求路径**: `GET /api/v1/projects/{projectId}/chapters/{id}`

**描述**: 根据章节ID获取章节信息

**路径参数**:
- `projectId`: 项目ID
- `id`: 章节ID

**响应示例**:
```json
{
  "id": "chap_123456",
  "projectId": "proj_123456",
  "title": "第一章：开始",
  "content": "这里是章节内容...",
  "chapterNumber": 1,
  "wordCount": 1000,
  "createdAt": "2026-01-27T10:45:00",
  "updatedAt": "2026-01-27T10:45:00"
}
```

### 2.3 获取项目的所有章节

**请求路径**: `GET /api/v1/projects/{projectId}/chapters`

**描述**: 获取指定项目的所有章节

**路径参数**:
- `projectId`: 项目ID

**响应示例**:
```json
[
  {
    "id": "chap_123456",
    "projectId": "proj_123456",
    "title": "第一章：开始",
    "content": "这里是章节内容...",
    "chapterNumber": 1,
    "wordCount": 1000,
    "createdAt": "2026-01-27T10:45:00",
    "updatedAt": "2026-01-27T10:45:00"
  }
]
```

### 2.4 根据章节号获取特定章节

**请求路径**: `GET /api/v1/projects/{projectId}/chapters/number/{chapterNumber}`

**描述**: 根据项目ID和章节号获取特定章节

**路径参数**:
- `projectId`: 项目ID
- `chapterNumber`: 章节号

**响应示例**:
```json
[
  {
    "id": "chap_123456",
    "projectId": "proj_123456",
    "title": "第一章：开始",
    "content": "这里是章节内容...",
    "chapterNumber": 1,
    "wordCount": 1000,
    "createdAt": "2026-01-27T10:45:00",
    "updatedAt": "2026-01-27T10:45:00"
  }
]
```

### 2.5 更新章节

**请求路径**: `PUT /api/v1/projects/{projectId}/chapters/{id}`

**描述**: 更新指定章节的信息

**路径参数**:
- `projectId`: 项目ID
- `id`: 章节ID

**请求参数**:
- 请求体: [ScriptChapterDTO](#scriptchapterdto) 对象

**响应示例**:
```json
{
  "id": "chap_123456",
  "projectId": "proj_123456",
  "title": "第一章：开始（更新版）",
  "content": "这里是更新后的章节内容...",
  "chapterNumber": 1,
  "wordCount": 1200,
  "createdAt": "2026-01-27T10:45:00",
  "updatedAt": "2026-01-27T10:50:00"
}
```

### 2.6 删除章节

**请求路径**: `DELETE /api/v1/projects/{projectId}/chapters/{id}`

**描述**: 删除指定章节

**路径参数**:
- `projectId`: 项目ID
- `id`: 章节ID

**响应**: 状态码 204 (No Content)

---

## 3. 角色管理接口

### 3.1 创建角色

**请求路径**: `POST /api/v1/projects/{projectId}/characters`

**描述**: 为指定项目创建新的角色

**路径参数**:
- `projectId`: 项目ID

**请求参数**:
- 请求体: [ScriptCharacterDTO](#scriptcharacterdto) 对象

**请求示例**:
```json
{
  "name": "主角",
  "description": "勇敢的探险家",
  "roleType": "PROTAGONIST",
  "personality": "勇敢、聪明、善良"
}
```

**响应示例**:
```json
{
  "id": "char_123456",
  "projectId": "proj_123456",
  "name": "主角",
  "description": "勇敢的探险家",
  "roleType": "PROTAGONIST",
  "personality": "勇敢、聪明、善良",
  "appearance": "",
  "background": "",
  "createdAt": "2026-01-27T10:55:00",
  "updatedAt": "2026-01-27T10:55:00"
}
```

### 3.2 根据ID获取角色

**请求路径**: `GET /api/v1/projects/{projectId}/characters/{id}`

**描述**: 根据角色ID获取角色信息

**路径参数**:
- `projectId`: 项目ID
- `id`: 角色ID

**响应示例**:
```json
{
  "id": "char_123456",
  "projectId": "proj_123456",
  "name": "主角",
  "description": "勇敢的探险家",
  "roleType": "PROTAGONIST",
  "personality": "勇敢、聪明、善良",
  "appearance": "高挑身材，黑色头发",
  "background": "来自一个普通家庭",
  "createdAt": "2026-01-27T10:55:00",
  "updatedAt": "2026-01-27T10:55:00"
}
```

### 3.3 获取项目的所有角色

**请求路径**: `GET /api/v1/projects/{projectId}/characters`

**描述**: 获取指定项目的所有角色

**路径参数**:
- `projectId`: 项目ID

**响应示例**:
```json
[
  {
    "id": "char_123456",
    "projectId": "proj_123456",
    "name": "主角",
    "description": "勇敢的探险家",
    "roleType": "PROTAGONIST",
    "personality": "勇敢、聪明、善良",
    "appearance": "高挑身材，黑色头发",
    "background": "来自一个普通家庭",
    "createdAt": "2026-01-27T10:55:00",
    "updatedAt": "2026-01-27T10:55:00"
  }
]
```

### 3.4 更新角色

**请求路径**: `PUT /api/v1/projects/{projectId}/characters/{id}`

**描述**: 更新指定角色的信息

**路径参数**:
- `projectId`: 项目ID
- `id`: 角色ID

**请求参数**:
- 请求体: [ScriptCharacterDTO](#scriptcharacterdto) 对象

**响应示例**:
```json
{
  "id": "char_123456",
  "projectId": "proj_123456",
  "name": "主角（更新版）",
  "description": "更详细的描述",
  "roleType": "PROTAGONIST",
  "personality": "勇敢、聪明、善良、坚韧",
  "appearance": "高挑身材，黑色头发",
  "background": "来自一个普通家庭",
  "createdAt": "2026-01-27T10:55:00",
  "updatedAt": "2026-01-27T11:00:00"
}
```

### 3.5 删除角色

**请求路径**: `DELETE /api/v1/projects/{projectId}/characters/{id}`

**描述**: 删除指定角色

**路径参数**:
- `projectId`: 项目ID
- `id`: 角色ID

**响应**: 状态码 204 (No Content)

---

## 4. 故事大纲接口

### 4.1 获取项目大纲

**请求路径**: `GET /api/v1/projects/{projectId}/outline`

**描述**: 获取指定项目的故事大纲

**路径参数**:
- `projectId`: 项目ID

**响应示例**:
```json
{
  "id": "outline_123456",
  "projectId": "proj_123456",
  "title": "故事大纲",
  "content": "这是一个完整的故事大纲...",
  "structure": "三幕式结构",
  "createdAt": "2026-01-27T11:05:00",
  "updatedAt": "2026-01-27T11:05:00"
}
```

### 4.2 创建或更新项目大纲

**请求路径**: `POST /api/v1/projects/{projectId}/outline`

**描述**: 为指定项目创建或更新故事大纲（如果已存在则更新，否则创建）

**路径参数**:
- `projectId`: 项目ID

**请求参数**:
- 请求体: [StoryOutlineDTO](#storyoutlinedto) 对象

**请求示例**:
```json
{
  "title": "故事大纲",
  "content": "这是一个完整的故事大纲...",
  "structure": "三幕式结构"
}
```

**响应示例**:
```json
{
  "id": "outline_123456",
  "projectId": "proj_123456",
  "title": "故事大纲",
  "content": "这是一个完整的故事大纲...",
  "structure": "三幕式结构",
  "createdAt": "2026-01-27T11:05:00",
  "updatedAt": "2026-01-27T11:05:00"
}
```

### 4.3 更新项目大纲

**请求路径**: `PUT /api/v1/projects/{projectId}/outline/{id}`

**描述**: 更新指定的大纲信息

**路径参数**:
- `projectId`: 项目ID
- `id`: 大纲ID

**请求参数**:
- 请求体: [StoryOutlineDTO](#storyoutlinedto) 对象

**响应示例**:
```json
{
  "id": "outline_123456",
  "projectId": "proj_123456",
  "title": "更新后的故事大纲",
  "content": "这是更新后的故事大纲...",
  "structure": "四幕式结构",
  "createdAt": "2026-01-27T11:05:00",
  "updatedAt": "2026-01-27T11:10:00"
}
```

### 4.4 删除项目大纲

**请求路径**: `DELETE /api/v1/projects/{projectId}/outline/{id}`

**描述**: 删除指定的大纲

**路径参数**:
- `projectId`: 项目ID
- `id`: 大纲ID

**响应**: 状态码 204 (No Content)

---

## 5. AI生成接口

### 5.1 生成创意

**请求路径**: `POST /api/v1/ai/generate/creative`

**描述**: 使用AI生成创意想法

**请求参数**:
- 请求体: JSON对象
  - `request`: 创意请求描述

**请求示例**:
```json
{
  "request": "给我一个关于未来世界的创意"
}
```

**响应示例**:
```json
{
  "result": "在未来世界中，人类通过意识上传实现了数字永生..."
}
```

### 5.2 生成主题背景

**请求路径**: `POST /api/v1/ai/generate/theme`

**描述**: 使用AI生成主题背景

**请求参数**:
- 请求体: JSON对象
  - `request`: 主题背景请求描述

**请求示例**:
```json
{
  "request": "科幻冒险主题背景"
}
```

**响应示例**:
```json
{
  "result": "在2087年的地球，科技高度发达但资源枯竭..."
}
```

### 5.3 生成剧情梗概

**请求路径**: `POST /api/v1/ai/generate/summary`

**描述**: 使用AI生成剧情梗概

**请求参数**:
- 请求体: JSON对象
  - `request`: 剧情梗概请求描述

**请求示例**:
```json
{
  "request": "基于科幻冒险背景的剧情梗概"
}
```

**响应示例**:
```json
{
  "result": "主人公发现了一个隐藏的星际传送门，决定踏上寻找新家园的旅程..."
}
```

### 5.4 生成角色设计

**请求路径**: `POST /api/v1/ai/generate/characters`

**描述**: 使用AI生成角色设计

**请求参数**:
- 请求体: JSON对象
  - `request`: 角色设计请求描述

**请求示例**:
```json
{
  "request": "设计一个勇敢的女主人公"
}
```

**响应示例**:
```json
{
  "result": "艾丽娅·星辰，25岁，拥有卓越的战斗技能和领导能力..."
}
```

### 5.5 生成故事大纲

**请求路径**: `POST /api/v1/ai/generate/outline`

**描述**: 使用AI生成故事大纲

**请求参数**:
- 请求体: JSON对象
  - `request`: 故事大纲请求描述

**请求示例**:
```json
{
  "request": "基于上述角色和背景的故事大纲"
}
```

**响应示例**:
```json
{
  "result": "第一幕：主人公发现传送门并决定离开地球...\n第二幕：在新星球上遭遇挑战...\n第三幕：最终决战并建立新家园..."
}
```

### 5.6 生成章节内容

**请求路径**: `POST /api/v1/ai/generate/chapter`

**描述**: 使用AI生成章节内容

**请求参数**:
- 请求体: JSON对象
  - `request`: 章节内容请求描述

**请求示例**:
```json
{
  "request": "第一章：发现传送门"
}
```

**响应示例**:
```json
{
  "result": "在废墟般的实验室中，艾丽娅发现了那个古老的装置...\n她小心翼翼地启动了设备，一道蓝色光芒突然闪现..."
}
```

---

## 数据模型定义

### ScriptProjectDTO

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 项目唯一标识符 |
| name | String | 项目名称 |
| description | String | 项目描述 |
| status | String | 项目状态 |
| theme | String | 项目主题 |
| summary | String | 项目摘要 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### ScriptChapterDTO

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 章节唯一标识符 |
| projectId | String | 所属项目ID |
| title | String | 章节标题 |
| content | String | 章节内容 |
| chapterNumber | Integer | 章节号 |
| wordCount | Integer | 字数统计 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### ScriptCharacterDTO

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 角色唯一标识符 |
| projectId | String | 所属项目ID |
| name | String | 角色姓名 |
| description | String | 角色描述 |
| roleType | String | 角色类型 |
| personality | String | 性格特征 |
| appearance | String | 外貌描述 |
| background | String | 背景故事 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### StoryOutlineDTO

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 大纲唯一标识符 |
| projectId | String | 所属项目ID |
| title | String | 大纲标题 |
| content | String | 大纲内容 |
| structure | String | 结构类型 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

---

## 错误处理

| HTTP状态码 | 描述 | 解决方案 |
|------------|------|----------|
| 200 | 请求成功 | 正常响应 |
| 204 | 无内容 | 请求成功但无返回内容 |
| 400 | 请求参数错误 | 检查请求参数 |
| 404 | 资源未找到 | 确认资源是否存在 |
| 500 | 服务器内部错误 | 联系管理员 |