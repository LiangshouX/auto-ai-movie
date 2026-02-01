# 剧本大纲与桥段内容 - 后端API文档

## 项目概述

本文档详细描述了剧本创作系统中故事大纲管理和桥段内容管理的后端API接口规范。

## 基础信息

- **基础URL**: `http://localhost:8080/api/v1`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 1. 桥段内容管理接口

### 1.1 创建桥段内容

**请求路径**: `POST /api/v1/episodes`

**描述**: 创建一个新的桥段内容

**请求参数**:
- 请求体: [ScriptEpisodeDTO](#scriptepisodedto) 对象

**请求示例**:
```json
{
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖",
  "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
  "wordCount": 800
}
```

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖",
  "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
  "wordCount": 800,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:30:00"
}
```

### 1.2 根据ID获取桥段内容

**请求路径**: `GET /api/v1/episodes/{id}`

**描述**: 根据桥段ID获取桥段详细信息

**路径参数**:
- `id`: 桥段ID

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖",
  "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
  "wordCount": 800,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:35:00"
}
```

### 1.3 根据项目ID获取桥段内容

**请求路径**: `GET /api/v1/episodes/project/{projectId}`

**描述**: 获取指定项目下的所有桥段内容

**路径参数**:
- `projectId`: 项目ID

**响应示例**:
```json
[
  {
    "id": "ep_001",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 1,
    "episodeTitle": "初入江湖",
    "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
    "wordCount": 800,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00"
  },
  {
    "id": "ep_002",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 2,
    "episodeTitle": "意外相遇",
    "episodeContent": "就在他沉思之际，一个身影突然出现在转角处...",
    "wordCount": 700,
    "createdAt": "2026-01-27T10:35:00",
    "updatedAt": "2026-01-27T10:35:00"
  }
]
```

### 1.4 根据章节ID获取桥段内容

**请求路径**: `GET /api/v1/episodes/chapter/{chapterId}`

**描述**: 获取指定章节下的所有桥段内容

**路径参数**:
- `chapterId`: 章节ID

**响应示例**:
```json
[
  {
    "id": "ep_001",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 1,
    "episodeTitle": "初入江湖",
    "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
    "wordCount": 800,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00"
  },
  {
    "id": "ep_002",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 2,
    "episodeTitle": "意外相遇",
    "episodeContent": "就在他沉思之际，一个身影突然出现在转角处...",
    "wordCount": 700,
    "createdAt": "2026-01-27T10:35:00",
    "updatedAt": "2026-01-27T10:35:00"
  }
]
```

### 1.5 根据项目ID和章节ID获取桥段内容

**请求路径**: `GET /api/v1/episodes/project/{projectId}/chapter/{chapterId}`

**描述**: 获取指定项目和章节下的桥段内容

**路径参数**:
- `projectId`: 项目ID
- `chapterId`: 章节ID

**响应示例**:
```json
[
  {
    "id": "ep_001",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 1,
    "episodeTitle": "初入江湖",
    "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
    "wordCount": 800,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00"
  }
]
```

### 1.6 获取所有桥段内容

**请求路径**: `GET /api/v1/episodes`

**描述**: 获取系统中所有的桥段内容

**响应示例**:
```json
[
  {
    "id": "ep_001",
    "projectId": "proj_123456",
    "chapterId": "chap_789012",
    "episodeNumber": 1,
    "episodeTitle": "初入江湖",
    "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
    "wordCount": 800,
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00"
  }
]
```

### 1.7 更新桥段内容

**请求路径**: `PUT /api/v1/episodes/{id}`

**描述**: 完整更新桥段内容信息

**路径参数**:
- `id`: 桥段ID

**请求参数**:
- 请求体: [ScriptEpisodeDTO](#scriptepisodedto) 对象

**请求示例**:
```json
{
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖 - 修订版",
  "episodeContent": "清晨的第一缕阳光穿透晨雾...",
  "wordCount": 850
}
```

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖 - 修订版",
  "episodeContent": "清晨的第一缕阳光穿透晨雾...",
  "wordCount": 850,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:00:00"
}
```

### 1.8 删除桥段内容

**请求路径**: `DELETE /api/v1/episodes/{id}`

**描述**: 根据ID删除桥段内容

**路径参数**:
- `id`: 桥段ID

**响应**: `204 No Content`

### 1.9 批量删除桥段内容

**请求路径**: `DELETE /api/v1/episodes/batch`

**描述**: 批量删除多个桥段内容

**请求参数**:
- 请求体: 桥段ID数组

**请求示例**:
```json
["ep_001", "ep_002", "ep_003"]
```

**响应**: `204 No Content`

### 1.10 更新桥段标题

**请求路径**: `PATCH /api/v1/episodes/{id}/title`

**描述**: 部分更新桥段标题

**路径参数**:
- `id`: 桥段ID

**请求参数**:
- 请求体: 包含episodeTitle的对象

**请求示例**:
```json
{
  "episodeTitle": "新的桥段标题"
}
```

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "新的桥段标题",
  "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
  "wordCount": 800,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:15:00"
}
```

### 1.11 更新桥段内容文本

**请求路径**: `PATCH /api/v1/episodes/{id}/content`

**描述**: 部分更新桥段内容文本

**路径参数**:
- `id`: 桥段ID

**请求参数**:
- 请求体: 包含episodeContent的对象

**请求示例**:
```json
{
  "episodeContent": "修订后的桥段内容..."
}
```

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖",
  "episodeContent": "修订后的桥段内容...",
  "wordCount": 800,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:20:00"
}
```

### 1.12 更新字数统计

**请求路径**: `PATCH /api/v1/episodes/{id}/word-count`

**描述**: 部分更新桥段字数统计

**路径参数**:
- `id`: 桥段ID

**请求参数**:
- 请求体: 包含wordCount的对象

**请求示例**:
```json
{
  "wordCount": 950
}
```

**响应示例**:
```json
{
  "id": "ep_001",
  "projectId": "proj_123456",
  "chapterId": "chap_789012",
  "episodeNumber": 1,
  "episodeTitle": "初入江湖",
  "episodeContent": "清晨的阳光透过薄雾洒在青石板路上...",
  "wordCount": 950,
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:25:00"
}
```

---

## 2. 故事大纲管理接口

### 2.1 创建故事大纲

**请求路径**: `POST /api/v1/outlines`

**描述**: 创建一个新的故事大纲

**请求参数**:
- 请求体: [StoryOutlineDTO](#storyoutlinedto) 对象

**请求示例**:
```json
{
  "projectId": "proj_123456",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END",
  "sections": [
    {
      "sectionId": "sec_001",
      "sectionTitle": "开始",
      "description": "故事的开端，介绍主要角色和背景设定",
      "sequence": 1,
      "chapterCount": 2,
      "chapters": [
        {
          "chapterId": "chap_001",
          "chapterTitle": "第一章：命运的相遇",
          "chapterSummary": "主角初次登场，遇到关键人物",
          "chapterNumber": 1,
          "episodeCount": 3,
          "wordCount": 1500,
          "episodes": [
            {
              "episodeId": "ep_001",
              "episodeTitle": "初入江湖",
              "episodeNumber": 1
            }
          ]
        }
      ]
    }
  ]
}
```

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END",
  "sections": [
    {
      "sectionId": "sec_001",
      "sectionTitle": "开始",
      "description": "故事的开端，介绍主要角色和背景设定",
      "sequence": 1,
      "chapterCount": 2,
      "chapters": [
        {
          "chapterId": "chap_001",
          "chapterTitle": "第一章：命运的相遇",
          "chapterSummary": "主角初次登场，遇到关键人物",
          "chapterNumber": 1,
          "episodeCount": 3,
          "wordCount": 1500,
          "episodes": [
            {
              "episodeId": "ep_001",
              "episodeTitle": "初入江湖",
              "episodeNumber": 1
            }
          ],
          "createdAt": "2026-01-27T10:30:00",
          "updatedAt": "2026-01-27T10:30:00"
        }
      ],
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00"
    }
  ],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:30:00"
}
```

### 2.2 根据ID获取故事大纲

**请求路径**: `GET /api/v1/outlines/{id}`

**描述**: 根据大纲ID获取故事大纲详细信息

**路径参数**:
- `id`: 大纲ID

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END",
  "sections": [
    {
      "sectionId": "sec_001",
      "sectionTitle": "开始",
      "description": "故事的开端，介绍主要角色和背景设定",
      "sequence": 1,
      "chapterCount": 2,
      "chapters": [
        {
          "chapterId": "chap_001",
          "chapterTitle": "第一章：命运的相遇",
          "chapterSummary": "主角初次登场，遇到关键人物",
          "chapterNumber": 1,
          "episodeCount": 3,
          "wordCount": 1500,
          "episodes": [
            {
              "episodeId": "ep_001",
              "episodeTitle": "初入江湖",
              "episodeNumber": 1
            }
          ],
          "createdAt": "2026-01-27T10:30:00",
          "updatedAt": "2026-01-27T10:30:00"
        }
      ],
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00"
    }
  ],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:30:00"
}
```

### 2.3 根据项目ID获取故事大纲

**请求路径**: `GET /api/v1/outlines/project/{projectId}`

**描述**: 获取指定项目的故事大纲

**路径参数**:
- `projectId`: 项目ID

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END",
  "sections": [
    {
      "sectionId": "sec_001",
      "sectionTitle": "开始",
      "description": "故事的开端，介绍主要角色和背景设定",
      "sequence": 1,
      "chapterCount": 2,
      "chapters": [
        {
          "chapterId": "chap_001",
          "chapterTitle": "第一章：命运的相遇",
          "chapterSummary": "主角初次登场，遇到关键人物",
          "chapterNumber": 1,
          "episodeCount": 3,
          "wordCount": 1500,
          "episodes": [
            {
              "episodeId": "ep_001",
              "episodeTitle": "初入江湖",
              "episodeNumber": 1
            }
          ],
          "createdAt": "2026-01-27T10:30:00",
          "updatedAt": "2026-01-27T10:30:00"
        }
      ],
      "createdAt": "2026-01-27T10:30:00",
      "updatedAt": "2026-01-27T10:30:00"
    }
  ],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T10:30:00"
}
```

### 2.4 获取所有故事大纲

**请求路径**: `GET /api/v1/outlines`

**描述**: 获取系统中所有的故事大纲

**响应示例**:
```json
[
  {
    "id": "outline_001",
    "projectId": "proj_123456",
    "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END",
    "sections": [],
    "createdAt": "2026-01-27T10:30:00",
    "updatedAt": "2026-01-27T10:30:00"
  }
]
```

### 2.5 更新故事大纲

**请求路径**: `PUT /api/v1/outlines/{id}`

**描述**: 完整更新故事大纲信息

**路径参数**:
- `id`: 大纲ID

**请求参数**:
- 请求体: [StoryOutlineDTO](#storyoutlinedto) 对象

**请求示例**:
```json
{
  "projectId": "proj_123456",
  "structureType": "HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "sections": []
}
```

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "sections": [],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:45:00"
}
```

### 2.6 删除故事大纲

**请求路径**: `DELETE /api/v1/outlines/{id}`

**描述**: 根据ID删除故事大纲

**路径参数**:
- `id`: 大纲ID

**响应**: `204 No Content`

### 2.7 更新大纲结构类型

**请求路径**: `PATCH /api/v1/outlines/{id}/structure-type`

**描述**: 部分更新大纲结构类型

**路径参数**:
- `id`: 大纲ID

**请求参数**:
- 请求体: 包含structureType的对象

**请求示例**:
```json
{
  "structureType": "HOOK_RISE_CONTINUATION_TURN_CONCLUSION"
}
```

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "sections": [],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:50:00"
}
```

### 2.8 更新大纲章节结构

**请求路径**: `PATCH /api/v1/outlines/{id}/sections`

**描述**: 部分更新大纲章节结构

**路径参数**:
- `id`: 大纲ID

**请求参数**:
- 请求体: [OutlineSectionDTO](#outlinesectiondto) 数组

**请求示例**:
```json
[
  {
    "sectionId": "sec_001",
    "sectionTitle": "引子",
    "description": "引入故事背景",
    "sequence": 1,
    "chapterCount": 1,
    "chapters": []
  }
]
```

**响应示例**:
```json
{
  "id": "outline_001",
  "projectId": "proj_123456",
  "structureType": "HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "sections": [
    {
      "sectionId": "sec_001",
      "sectionTitle": "引子",
      "description": "引入故事背景",
      "sequence": 1,
      "chapterCount": 1,
      "chapters": [],
      "createdAt": "2026-01-27T11:55:00",
      "updatedAt": "2026-01-27T11:55:00"
    }
  ],
  "createdAt": "2026-01-27T10:30:00",
  "updatedAt": "2026-01-27T11:55:00"
}
```

---

## 3. 数据传输对象定义

### 3.1 ScriptEpisodeDTO

桥段内容数据传输对象

```json
{
  "id": "字符串，桥段唯一标识",
  "projectId": "字符串，关联项目ID",
  "chapterId": "字符串，所属章节ID",
  "episodeNumber": "整数，桥段号",
  "episodeTitle": "字符串，桥段标题",
  "episodeContent": "字符串，桥段内容",
  "wordCount": "整数，字数统计",
  "createdAt": "时间戳，创建时间",
  "updatedAt": "时间戳，更新时间"
}
```

### 3.2 StoryOutlineDTO

故事大纲数据传输对象

```json
{
  "id": "字符串，大纲唯一标识",
  "projectId": "字符串，关联项目ID",
  "structureType": "字符串，结构类型(BEGINNING_RISING_ACTION_CLIMAX_END|HOOK_RISE_CONTINUATION_TURN_CONCLUSION)",
  "sections": "数组，章节结构列表[OutlineSectionDTO]",
  "createdAt": "时间戳，创建时间",
  "updatedAt": "时间戳，更新时间"
}
```

### 3.3 OutlineSectionDTO

大纲章节数据传输对象

```json
{
  "sectionId": "字符串，节点ID",
  "sectionTitle": "字符串，节点标题",
  "description": "字符串，简略介绍此节的内容",
  "sequence": "整数，顺序(1,2,3,4[,5])",
  "chapterCount": "整数，章节数量",
  "chapters": "数组，章节列表[OutlineChapterDTO]",
  "createdAt": "时间戳，创建时间",
  "updatedAt": "时间戳，更新时间"
}
```

### 3.4 OutlineChapterDTO

大纲章节中的章节数据传输对象

```json
{
  "chapterId": "字符串，章节ID",
  "chapterTitle": "字符串，章节标题",
  "chapterSummary": "字符串，章节简略总结",
  "chapterNumber": "整数，章节号",
  "episodeCount": "整数，桥段数量",
  "wordCount": "整数，字数统计",
  "episodes": "数组，桥段列表[OutlineEpisodeDTO]",
  "createdAt": "时间戳，创建时间",
  "updatedAt": "时间戳，更新时间"
}
```

### 3.5 OutlineEpisodeDTO

大纲章节中的桥段数据传输对象

```json
{
  "episodeId": "字符串，桥段ID",
  "episodeTitle": "字符串，桥段标题",
  "episodeNumber": "整数，桥段号"
}
```

---

## 4. 错误响应格式

所有错误响应遵循统一格式：

```json
{
  "code": "错误码",
  "message": "错误描述信息",
  "timestamp": "时间戳"
}
```

### 常见错误码

| 错误码 | 描述 |
|--------|------|
| SRP-COM-1002 | 参数错误 |
| SRP-COM-1003 | 数据不存在 |
| SRP-EPISODE-4101 | 桥段不存在 |
| SRP-EPISODE-4102 | 桥段创建失败 |
| SRP-EPISODE-4103 | 桥段更新失败 |
| SRP-EPISODE-4104 | 桥段删除失败 |
| SRP-OUTLINE-3101 | 故事大纲不存在 |
| SRP-OUTLINE-3102 | 故事大纲创建失败 |
| SRP-OUTLINE-3103 | 故事大纲更新失败 |
| SRP-OUTLINE-3104 | 故事大纲删除失败 |

---

## 5. 注意事项

1. **ID生成**: 所有资源ID采用UUID格式
2. **时间格式**: 采用ISO 8601标准时间格式
3. **字符编码**: 统一使用UTF-8编码
4. **请求验证**: 所有接口都会进行参数验证
5. **日志记录**: 关键操作会记录INFO级别日志
6. **异常处理**: 统一异常处理机制，返回友好的错误信息
7. **数据一致性**: 更新操作会保持关联数据的一致性

---