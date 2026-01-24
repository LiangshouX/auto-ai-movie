package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本章节实体
 * 表名: script_chapters
 * 外键: project_id -> script_projects.id
 * 索引: idx_project_id(project_id), idx_chapter_number(chapter_number)
 */
@Data
@TableName("script_chapters")
public class ScriptChapterPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id; // 章节唯一标识
    
    private String projectId; // 关联项目ID
    
    private String episodeId; // 桥段ID
    
    private Integer chapterNumber; // 章节号
    
    private String title; // 章节标题
    
    private String content; // 章节内容
    
    private Integer wordCount; // 字数统计，默认0
    
    private LocalDateTime createdAt; // 创建时间
    
    private LocalDateTime updatedAt; // 更新时间
}