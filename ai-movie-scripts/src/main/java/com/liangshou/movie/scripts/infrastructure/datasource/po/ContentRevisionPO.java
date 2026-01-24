package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
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
    private String id; // 修订记录唯一标识
    
    private String contentType; // 内容类型：枚举值PROJECT_THEME, PROJECT_SUMMARY, CHAPTER_CONTENT
    
    private String contentId; // 内容ID
    
    private Integer revisionNumber; // 修订号
    
    private String originalContent; // 原始内容
    
    private String revisedContent; // 修订后内容
    
    private String revisionReason; // 修订原因
    
    private String editor; // 修订者
    
    private LocalDateTime createdAt; // 修订时间
}