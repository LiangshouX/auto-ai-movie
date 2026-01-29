package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 内容修订历史实体
 * 表名: content_revisions
 * 索引: idx_content(content_type, content_id), idx_revision_number(revision_number)
 */
@Data
@TableName("content_revisions")
public class ContentRevisionPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    /**
     * 内容类型：枚举值PROJECT_THEME, PROJECT_SUMMARY, CHAPTER_CONTENT
     */
    @TableField("content_type")
    private String contentType;
    
    /**
     * 内容ID
     */
    @TableField("content_id")
    private String contentId;
    
    /**
     * 修订号
     */
    @TableField("revision_number")
    private Integer revisionNumber;
    
    /**
     * 原始内容
     */
    @TableField("original_content")
    private String originalContent;
    
    /**
     * 修订后内容
     */
    @TableField("revised_content")
    private String revisedContent;
    
    /**
     * 修订原因
     */
    @TableField("revision_reason")
    private String revisionReason;
    
    /**
     * 修订者
     */
    @TableField("editor")
    private String editor;
    
    /**
     * 修订时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
}