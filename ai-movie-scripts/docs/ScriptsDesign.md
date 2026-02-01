# 剧本内容-功能设计文档

## 数据模型

📊 数据模型架构图

```
剧本项目(script_projects)  -> 已实现
    ↓ 1:1
故事大纲(story_outlines)
    ↓ 1:N  
剧本章节(script_chapters)  -> 不单独建表，放在 outlines 的section中
    ↓ 1:N
剧本内容桥段(scripts_episodes)
```

### 故事大纲模型
> 对应表名：script_outlines
> 说明：一个剧本对应一个故事大纲，故事大纲作为剧本结构的完整结构表达

```json
{
  "id": "大纲唯一标识，与projectId一致",
  "projectId": "关联项目ID，索引",
  "structureType": "BEGINNING_RISING_ACTION_CLIMAX_END|HOOK_RISE_CONTINUATION_TURN_CONCLUSION",
  "sections": [
    {
      "sectionId": "节点ID",
      "sectionTitle": "节点标题，BEGINNING_RISING_ACTION_CLIMAX_END结构对应为 开始 -> 发展 -> 高潮 -> 结局，否则为 引 -> 起 -> 承 -> 转 -> 合",
      "description": "简略介绍此节的内容",
      "sequence": "1，2,3,4（，5）的顺序",
      "chapterCount": "章节数量",
      "chapters": [
        {
          "chapterId": "章节ID, 章节的唯一标识",
          "chapterTitle": "章节标题",
          "chapterSummary": "章节简略总结",
          "chapterNumber": "章节号，标识chapter在section的第几章",
          "episodeCount": "桥段数量",
          "wordCount": "字数统计",
          "episodes": [
            {
              "episodeId": "桥段ID，属于某一章节的某桥段的唯一标识",
              "episodeTitle": "桥段标题",
              "episodeNumber": "桥段号，标识episode在chapter的第几桥段"
            }
          ],
          "createdAt": "ISO时间戳",
          "updatedAt": "ISO时间戳"
        }
      ]
    }
  ],
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳"
}
```

> 考虑Chapter的数据量较小，主要作为索引标识，故不单独建表，放在 section 中


### 桥段内容模型
> 对应表名：scripts_episodes
 
```json
{
  "id": "即sectionId，标段内容的唯一标识",
  "projectId": "关联项目ID",
  "chapterId": "所属的章节ID",
  "episodeNumber": "桥段号，标识episode在chapter的第几桥段",
  "episodeTitle": "章节标题",
  "episodeContent": "章节内容",
  "wordCount": "字数统计",
  "createdAt": "ISO时间戳",
  "updatedAt": "ISO时间戳"
}
```

## SQL脚本

```sql
-- 删除表（按依赖关系逆序）
DROP TABLE IF EXISTS scripts_episodes;
DROP TABLE IF EXISTS script_outlines;

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

-- 示例数据插入
-- 插入示例故事大纲
INSERT INTO script_outlines (id, project_id, structure_type, sections) VALUES 
('outline_001', 'project_001', 'BEGINNING_RISING_ACTION_CLIMAX_END', 
'{
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
            {"episodeId": "ep_001", "episodeTitle": "初入江湖", "episodeNumber": 1},
            {"episodeId": "ep_002", "episodeTitle": "意外相遇", "episodeNumber": 2},
            {"episodeId": "ep_003", "episodeTitle": "身份揭露", "episodeNumber": 3}
          ]
        },
        {
          "chapterId": "chap_002",
          "chapterTitle": "第二章：秘密任务",
          "chapterSummary": "接受神秘任务，踏上冒险之旅",
          "chapterNumber": 2,
          "episodeCount": 2,
          "wordCount": 1200,
          "episodes": [
            {"episodeId": "ep_004", "episodeTitle": "任务委托", "episodeNumber": 1},
            {"episodeId": "ep_005", "episodeTitle": "准备出发", "episodeNumber": 2}
          ]
        }
      ]
    }
  ]
}'
);

-- 插入示例桥段内容
INSERT INTO scripts_episodes (id, project_id, chapter_id, episode_number, episode_title, episode_content, word_count) VALUES 
('ep_001', 'project_001', 'chap_001', 1, '初入江湖', '清晨的阳光透过薄雾洒在青石板路上...', 800),
('ep_002', 'project_001', 'chap_001', 2, '意外相遇', '就在他沉思之际，一个身影突然出现在转角处...', 700),
('ep_003', 'project_001', 'chap_001', 3, '身份揭露', '"你就是传说中的剑客吗？"少女好奇地问道...', 600),
('ep_004', 'project_001', 'chap_002', 1, '任务委托', '老者缓缓展开一幅古老的地图...', 900),
('ep_005', 'project_001', 'chap_002', 2, '准备出发', '夜幕降临，主角开始整理行装...', 500);
```
