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

系统采用经典的三层架构：

1. **Controller层** - 提供RESTful API接口
2. **Service层** - 实现业务逻辑
3. **Infrastructure层** - 数据访问和实体定义

同时集成了Spring AI框架，支持多种AI供应商，并实现了完善的上下文管理。