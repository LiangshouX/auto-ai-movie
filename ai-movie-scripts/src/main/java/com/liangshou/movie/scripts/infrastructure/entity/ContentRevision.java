package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 内容修订历史实体
 */
@Data
@TableName("content_revisions")
public class ContentRevision {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String contentType; // PROJECT_THEME, PROJECT_SUMMARY, CHAPTER_CONTENT
    
    private String contentId;
    
    private Integer revisionNumber;
    
    private String originalContent;
    
    private String revisedContent;
    
    private String revisionReason;
    
    private String editor;
    
    private LocalDateTime createdAt;
}