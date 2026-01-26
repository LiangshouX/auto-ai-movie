# AI剧本创作模块

AI剧本创作模块是一个基于人工智能的剧本创作系统，旨在辅助用户完成从创意到精修的完整剧本创作流程。

## 技术栈

- Spring Boot 3.2+
- Spring AI
- MySQL 8.0+
- Redis
- JPA/Hibernate
- Lombok

## 功能特性

- 支持与多个AI供应商集成（OpenAI、Azure OpenAI、Anthropic）
- 完整的剧本创作流程：主题背景、剧情梗概、角色设计、故事大纲、章节内容
- 数据持久化存储
- 生成历史记录和版本控制
- RESTful API接口

## 快速开始

### 环境准备

1. 确保已安装JDK 17+
2. 启动MySQL数据库服务
3. 启动Redis服务
4. 准备AI服务API密钥（OpenAI、Azure OpenAI或Anthropic）

### 配置

在运行前，请配置以下环境变量：

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Azure OpenAI (可选)
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key

# Anthropic (可选)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 运行

```bash
# 使用Maven运行
mvn spring-boot:run

# 或打包后运行
mvn clean package
java -jar target/ai-movie-scripts-1.0-SNAPSHOT.jar
```

### API端点

- `POST /api/v1/projects` - 创建新剧本项目
- `GET /api/v1/projects` - 获取所有项目
- `GET /api/v1/projects/{id}` - 获取特定项目
- `PUT /api/v1/projects/{id}/theme` - 更新项目主题
- `PUT /api/v1/projects/{id}/summary` - 更新项目摘要
- `DELETE /api/v1/projects/{id}` - 删除项目
- `POST /api/v1/ai/generate` - 通用AI内容生成
- `POST /api/v1/ai/generate/theme` - 生成主题
- `POST /api/v1/ai/generate/summary` - 生成摘要
- `POST /api/v1/ai/generate/character` - 生成角色
- `POST /api/v1/ai/generate/outline` - 生成大纲
- `POST /api/v1/ai/generate/chapter` - 生成章节

## 数据库表结构

系统会自动创建以下表结构：
- script_projects - 剧本项目表
- script_characters - 角色信息表
- character_relationships - 角色关系表
- story_outlines - 故事大纲表
- script_chapters - 剧本章节表
- content_revisions - 内容修订历史表
- ai_generation_logs - AI生成日志表

## 架构设计

系统采用经典的三层架构，分层分包说明如下：

```txt
ai-movie-scripts/
├── adapter/                          # 适配器层：负责外部请求的接入与协议转换
│   └── controller/                   # 控制器层：接收 HTTP 请求，调用 Service 层，返回响应
├── common/                           # 公共模块：存放项目中通用的工具、配置和常量
│   ├── enums/                        # 枚举类目录：按业务分包存放各类枚举（如状态码、类型等）
│   ├── constants/                    # 常量类目录：按功能分包存放全局常量值（如系统标识、默认值等）
│   └── config/                       # 配置类目录：集中管理 Spring Boot 相关配置
│       ├── aimodelconfig/            # AI 模型相关配置
│       │   ├── properties/           # 利用 @ConfigurationProperties 读取 application.yaml 中的 AI 模型参数
│       │   └── modelclientconfig/    # 基于 properties 创建 Spring AI 的 Model 和 Client Bean
│       ├── mybatisconfig/            # MyBatis-Plus 配置：如分页插件、SQL 日志、类型处理器等
│       └── redisconfig/              # Redis 客户端配置：连接池、序列化方式、自定义 RedisTemplate 等
├── service/                          # 业务逻辑层：封装核心业务规则
│   ├── dto/                          # Data Transfer Object：用于服务间或层间数据传输的模型
│   ├── vo/                           # View Object：封装返回给前端的数据结构，避免暴露内部字段
│   └── impl/                         # Service 接口的具体实现类目录
├── utils/                            # 工具类模块：提供通用辅助功能
│   └── prompt/                       # Prompt 资源管理：加载并处理存放在 resources/prompt/ 下的提示词模板
└── infrastructure/                   # 基础设施层：提供技术支撑能力，解耦业务与底层实现
    ├── datasource/                   # 数据访问基础设施
    │   ├── po/                       # Persistent Object：与数据库表一一对应的实体类（通常由 MyBatis Plus 使用）
    │   ├── mapper/                   # MyBatis Mapper 接口：定义数据库操作方法
    │   └── support/                  # 数据库相关辅助类：如自定义 TypeHandler、MetaObjectHandler 等
    └── agentsupport/                 # AI Agent 基础设施支持
        ├── context/                  # 上下文管理：维护 Agent 执行过程中的会话、状态、记忆等
        ├── tools/                    # 自定义 Tool 实现：供 Agent 调用的函数工具（如查询数据库、调用 API）
        └── mcp/                      # Model Context Protocol 相关实现（待定）：可能用于多模型协作或上下文协议
```

同时集成了Spring AI框架，支持多种AI供应商，并实现了完善的上下文管理。