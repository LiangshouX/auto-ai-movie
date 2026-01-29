# AI剧本创作-技术设计

AI剧本创作模块是一个基于人工智能的剧本创作系统，旨在辅助用户完成从创意到精修的完整剧本创作流程。
系统遵循7个核心工作流程：设置主题背景、编写剧情梗概、设计角色、编写故事大纲、编写开头章节、逐章完稿、审核修订。

## 技术选型
前端：React、Ant Design
后端：Spring Boot、Spring AI
数据库：MySQL、Mybatis plus

## 功能需求分析

### 核心功能流程

* 创意阶段：提供互动式创意生成
* 主题背景：生成和编辑故事主题背景
* 剧情梗概：生成和编辑剧情概述
* 角色设计：创建和管理角色信息
* 故事大纲：构建故事结构和桥段
* 开头章节：编写故事开头内容
* 逐章完稿：按章节完成整个剧本

### 技术要求

* 支持与大语言模型集成
* 支持版本控制和迭代修改
* 支持用户交互式编辑
* 提供友好的前端界面
* 数据持久化存储

## 文本数据存储格式设计

### 存储格式选择

采用JSON作为主要数据交换格式，结合数据库进行持久化存储，主要原因如下：
JSON格式具有良好的可读性和扩展性
易于与前端交互
支持复杂嵌套结构
便于AI模型解析和生成

### 数据模型定义

#### 剧本项目基础模型

```json
{
  "id": "uuid",
  "title": "剧本标题",
  "description": "剧本描述",
  "theme": "主题背景",
  "summary": "剧情梗概",
  "status": "CREATED|THEME_SET|SUMMARY_WRITTEN|CHARACTER_DESIGNED|OUTLINE_CREATED|FIRST_CHAPTER_WRITTEN|COMPLETED|REVIEWED",
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳",
  "authorId": "作者ID"
}
```

#### 角色信息模型

```json
{
  "id": "uuid",
  "projectId": "关联项目ID",
  "name": "角色姓名",
  "age": "年龄",
  "gender": "性别",
  "personalityTags": [
    "性格标签数组"
  ],
  "roleInStory": "在故事中的定位",
  "skills": [
    "技能列表"
  ],
  "characterSetting": "角色设定描述",
  "relationships": [
    {
      "relatedCharacterId": "相关角色ID",
      "relatesCharacterName": "相关角色姓名",
      "relationshipType": "关系类型(朋友/敌人/恋人等)",
      "description": "关系描述"
    }
  ],
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳"
}

```

#### 故事大纲模型

```json
{
  "id": "uuid",
  "projectId": "关联项目ID",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END|HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "outlineNodes": [
    {
      "id": "节点ID",
      "title": "节点标题",
      "description": "节点描述",
      "sequence": "序列号",
      "episodes": [
        {
          "id": "桥段ID",
          "title": "桥段标题",
          "summary": "桥段摘要",
          "logicRelation": "与前后桥段的逻辑关系",
          "content": "详细内容",
          "chapterNumber": "章节号"
        }
      ]
    }
  ],
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳"
}
```

#### 剧本章节内容模型

```json
{
  "id": "uuid",
  "projectId": "关联项目ID",
  "episodeId": "桥段ID",
  "chapterNumber": "章节号",
  "title": "章节标题",
  "content": "章节内容",
  "wordCount": "字数统计",
  "revisionHistory": [
    {
      "revisionId": "修订ID",
      "content": "修订内容",
      "reason": "修订原因",
      "timestamp": "修订时间",
      "editor": "修订者"
    }
  ],
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳"
}

```

## 数据存储介质选型

### MySql

选用MySQL作为主数据存储：

* 数据一致性保证
* ACID事务支持
* 成熟的备份恢复机制
* 适合结构化数据存储
* 便于复杂查询操作

### 文件存储系统

对于大型文本内容：

* 使用本地文件系统存储原始文本内容
* 采用分层目录结构按项目ID组织
* 配合数据库索引进行管理

### 缓存系统 (Redis)

* 用于缓存频繁访问的数据
* 存储会话信息
* 临时存储AI生成过程中的中间结果

## AI Agent架构设计

### 总体架构

采用分层架构模式，主要包括：

* 用户接口层
* 业务逻辑层
* AI服务层
* 数据访问层
* 数据存储层

### 核心组件设计

#### AI剧本创作Agent

```java

@Component
public class AIScriptWritingAgent {

    @Autowired
    private AIClient aiClient;

    @Autowired
    private ProjectService projectService;

    // 创意生成
    public CreativeResponse generateCreative(CreativeRequest request) {
    }

    // 主题背景生成
    public ThemeResponse generateTheme(ThemeRequest request) {
    }

    // 剧情梗概生成
    public SummaryResponse generateSummary(SummaryRequest request) {
    }

    // 角色设计
    public CharacterResponse generateCharacters(CharacterRequest request) {
    }

    // 故事大纲生成
    public OutlineResponse generateOutline(OutlineRequest request) {
    }

    // 章节内容生成
    public ChapterResponse generateChapter(ChapterRequest request) {
    }
}
```

#### 内容管理器

* 负责管理剧本各阶段内容的生命周期：
* 版本控制
* 内容对比
* 修改历史追踪
* 内容验证

#### Prompt工程引擎

* 标准化Prompt模板管理
* 动态Prompt生成
* 上下文注入
* 输出格式化

### AI集成接口

* 支持主流大语言模型API (OpenAI, Claude等)
* 统一的AI服务调用接口
* 请求/响应转换器
* 错误处理和重试机制

## 数据库表结构设计

### 剧本项目表(script_project)

```shell
CREATE TABLE script_projects (
    id VARCHAR(36) PRIMARY KEY COMMENT '项目唯一标识',
    title VARCHAR(255) NOT NULL COMMENT '剧本标题',
    description TEXT COMMENT '剧本描述',
    theme TEXT COMMENT '主题背景',
    summary TEXT COMMENT '剧情梗概',
    status VARCHAR(50) DEFAULT 'CREATED' COMMENT '项目状态',
    author_id VARCHAR(36) COMMENT '作者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_author_id (author_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='剧本项目表';
```

### 角色信息表 (script_characters)

```shell
CREATE TABLE script_characters (
    id VARCHAR(36) PRIMARY KEY COMMENT '角色唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    name VARCHAR(100) NOT NULL COMMENT '角色姓名',
    age INT COMMENT '年龄',
    gender VARCHAR(10) COMMENT '性别',
    personality_tags JSON COMMENT '性格标签(JSON数组)',
    role_in_story VARCHAR(255) COMMENT '在故事中的定位',
    skills JSON COMMENT '技能列表(JSON数组)',
    character_setting TEXT COMMENT '角色设定描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色信息表';

```

### 角色关系表 (character_relationships)

```shell
CREATE TABLE character_relationships (
    id VARCHAR(36) PRIMARY KEY COMMENT '关系唯一标识',
    character_id VARCHAR(36) NOT NULL COMMENT '角色ID',
    related_character_id VARCHAR(36) NOT NULL COMMENT '相关角色ID',
    relationship_type VARCHAR(50) COMMENT '关系类型',
    description TEXT COMMENT '关系描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (character_id) REFERENCES script_characters(id) ON DELETE CASCADE,
    FOREIGN KEY (related_character_id) REFERENCES script_characters(id) ON DELETE CASCADE,
    UNIQUE KEY uk_char_relation (character_id, related_character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色关系表';

```

### 故事大纲表 (story_outlines)

```shell
CREATE TABLE story_outlines (
    id VARCHAR(36) PRIMARY KEY COMMENT '大纲唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    structure_type VARCHAR(50) COMMENT '结构类型',
    outline_nodes JSON COMMENT '大纲节点(JSON格式)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='故事大纲表';

```

### 剧本章节表 (script_chapters)

```shell
CREATE TABLE script_chapters (
    id VARCHAR(36) PRIMARY KEY COMMENT '章节唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    episode_id VARCHAR(36) COMMENT '桥段ID',
    chapter_number INT NOT NULL COMMENT '章节号',
    title VARCHAR(255) COMMENT '章节标题',
    content LONGTEXT COMMENT '章节内容',
    word_count INT DEFAULT 0 COMMENT '字数统计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_chapter_number (chapter_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='剧本章节表';


```

### 内容修订历史表 (content_revisions)

```shell
CREATE TABLE content_revisions (
    id VARCHAR(36) PRIMARY KEY COMMENT '修订记录唯一标识',
    content_type ENUM('PROJECT_THEME', 'PROJECT_SUMMARY', 'CHAPTER_CONTENT') NOT NULL COMMENT '内容类型',
    content_id VARCHAR(36) NOT NULL COMMENT '内容ID',
    revision_number INT NOT NULL COMMENT '修订号',
    original_content LONGTEXT COMMENT '原始内容',
    revised_content LONGTEXT COMMENT '修订后内容',
    revision_reason TEXT COMMENT '修订原因',
    editor VARCHAR(100) COMMENT '修订者',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '修订时间',
    INDEX idx_content (content_type, content_id),
    INDEX idx_revision_number (revision_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容修订历史表';

```

### AI生成日志表 (ai_generation_logs)

```shell
CREATE TABLE ai_generation_logs (
    id VARCHAR(36) PRIMARY KEY COMMENT '日志唯一标识',
    project_id VARCHAR(36) COMMENT '关联项目ID',
    generation_type VARCHAR(50) NOT NULL COMMENT '生成类型',
    prompt TEXT COMMENT '输入提示',
    response TEXT COMMENT 'AI响应',
    tokens_used INT COMMENT '使用token数量',
    execution_time_ms INT COMMENT '执行时间(毫秒)',
    status ENUM('SUCCESS', 'FAILED', 'PROCESSING') DEFAULT 'PROCESSING' COMMENT '状态',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE SET NULL,
    INDEX idx_project_id (project_id),
    INDEX idx_generation_type (generation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI生成日志表';

```

## 系统集成设计

### API接口设计

RESTful API设计，支持以下核心端点：

* `/api/v1/projects` - 项目管理
* `/api/v1/projects/{id}/characters` - 角色管理
* `/api/v1/projects/{id}/outline` - 大纲管理
* `/api/v1/projects/{id}/chapters` - 章节管理
* `/api/v1/ai/generate` - AI内容生成

### 前端集成

* React/Vue前端界面
* 实时协作编辑
* 内容预览功能
* 版本对比工具

### AI模型集成

* 统一的AI服务适配器
* 支持多种大语言模型
* 智能上下文管理
* 生成质量评估