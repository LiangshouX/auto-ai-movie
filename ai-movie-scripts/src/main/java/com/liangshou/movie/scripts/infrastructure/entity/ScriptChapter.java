package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本章节实体
 */
@Data
@TableName("script_chapters")
public class ScriptChapter {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String projectId;
    
    private String episodeId;
    
    private Integer chapterNumber;
    
    private String title;
    
    private String content;
    
    private Integer wordCount;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}