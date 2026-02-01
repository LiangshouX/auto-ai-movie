-- 删除表（按依赖关系逆序）
--DROP TABLE IF EXISTS scripts_episodes;
--DROP TABLE IF EXISTS ai_generation_logs;
--DROP TABLE IF EXISTS content_revisions;
--DROP TABLE IF EXISTS script_chapters;
-- DROP TABLE IF EXISTS character_relationships; -- 此表在create_table_origin.sql中未定义


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


-- 故事大纲表 (script_outlines)
-- 根据数据模型：id与projectId一致，sections包含完整的章节和桥段结构
CREATE TABLE IF NOT EXISTS script_outlines (
    id VARCHAR(36) PRIMARY KEY COMMENT '大纲唯一标识，与projectId一致',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    structure_type ENUM('BEGINNING_RISING_ACTION_CLIMAX_END', 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION') COMMENT '结构类型',
    sections JSON COMMENT '章节结构(JSON数组，包含章节和桥段信息)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_structure_type (structure_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='故事大纲表';

-- 桥段内容表 (scripts_episodes)
-- 根据数据模型：每个桥段有独立的内容存储
CREATE TABLE IF NOT EXISTS scripts_episodes (
    id VARCHAR(36) PRIMARY KEY COMMENT '桥段内容唯一标识',
    project_id VARCHAR(36) NOT NULL COMMENT '关联项目ID',
    chapter_id VARCHAR(36) NOT NULL COMMENT '所属章节ID',
    episode_number INT NOT NULL COMMENT '桥段号，标识episode在chapter的第几桥段',
    episode_title VARCHAR(255) COMMENT '桥段标题',
    episode_content LONGTEXT COMMENT '桥段内容',
    word_count INT DEFAULT 0 COMMENT '字数统计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (project_id) REFERENCES script_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_chapter_id (chapter_id),
    INDEX idx_episode_number (episode_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='桥段内容表';
