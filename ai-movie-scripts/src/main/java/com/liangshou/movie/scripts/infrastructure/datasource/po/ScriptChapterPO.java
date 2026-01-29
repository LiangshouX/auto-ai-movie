package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
    private String id;
    
    /**
     * 关联项目ID
     */
    @TableField("project_id")
    private String projectId;
    
    /**
     * 桥段ID
     */
    @TableField("episode_id")
    private String episodeId;
    
    /**
     * 章节号
     */
    @TableField("chapter_number")
    private Integer chapterNumber;
    
    /**
     * 章节标题
     */
    @TableField("title")
    private String title;
    
    /**
     * 章节内容
     */
    @TableField("content")
    private String content;
    
    /**
     * 字数统计，默认0
     */
    @TableField("word_count")
    private Integer wordCount;
    
    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField("updated_at")
    private LocalDateTime updatedAt;
}