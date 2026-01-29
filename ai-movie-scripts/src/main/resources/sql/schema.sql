-- 剧本项目表(script_project)
CREATE TABLE IF NOT EXISTS script_projects (
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

-- 角色信息表 (script_characters)
CREATE TABLE IF NOT EXISTS script_characters (
    id VARCHAR(36) PRIMARY KEY COMMENT '角色唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    name VARCHAR(100) NOT NULL COMMENT '角色姓名',
    age INT COMMENT '年龄',
    gender VARCHAR(10) COMMENT '性别',
    personality_tags JSON COMMENT '性格标签(JSON数组)',
    role_in_story VARCHAR(255) COMMENT '在故事中的定位',
    skills JSON COMMENT '技能列表(JSON数组)',
    character_setting TEXT COMMENT '角色设定描述',
    character_relationships JSON COMMENT '角色关系(JSON数组)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色信息表';

-- 角色关系表 (character_relationships)
--CREATE TABLE IF NOT EXISTS character_relationships (
--    id VARCHAR(36) PRIMARY KEY COMMENT '关系唯一标识',
--    character_id VARCHAR(36) NOT NULL COMMENT '角色ID',
--    related_character_id VARCHAR(36) NOT NULL COMMENT '相关角色ID',
--    relationship_type VARCHAR(50) COMMENT '关系类型',
--    description TEXT COMMENT '关系描述',
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
--    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--    FOREIGN KEY (character_id) REFERENCES script_characters(id) ON DELETE CASCADE,
--    FOREIGN KEY (related_character_id) REFERENCES script_characters(id) ON DELETE CASCADE,
--    UNIQUE KEY uk_char_relation (character_id, related_character_id)
--) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色关系表';

-- 故事大纲表 (story_outlines)
CREATE TABLE IF NOT EXISTS story_outlines (
    id VARCHAR(36) PRIMARY KEY COMMENT '大纲唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    structure_type VARCHAR(50) COMMENT '结构类型',
    outline_nodes JSON COMMENT '大纲节点(JSON格式)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='故事大纲表';

-- 剧本章节表 (script_chapters)
CREATE TABLE IF NOT EXISTS script_chapters (
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

-- 内容修订历史表 (content_revisions)
CREATE TABLE IF NOT EXISTS content_revisions (
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

-- AI生成日志表 (ai_generation_logs)
CREATE TABLE IF NOT EXISTS ai_generation_logs (
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