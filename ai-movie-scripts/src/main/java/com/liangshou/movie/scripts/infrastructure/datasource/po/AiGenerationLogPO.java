package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * AI生成日志实体
 * 表名: ai_generation_logs
 * 外键: project_id -> script_projects.id
 * 索引: idx_project_id(project_id), idx_generation_type(generation_type), idx_created_at(created_at)
 */
@Data
@TableName("ai_generation_logs")
public class AiGenerationLogPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    /**
     * 关联项目ID
     */
    @TableField("project_id")
    private String projectId;
    
    /**
     * 生成类型：CREATIVE, THEME, SUMMARY, CHARACTER, OUTLINE, CHAPTER
     */
    @TableField("generation_type")
    private String generationType;
    
    /**
     * 输入提示
     */
    @TableField("prompt")
    private String prompt;
    
    /**
     * AI响应
     */
    @TableField("response")
    private String response;
    
    /**
     * 使用token数量
     */
    @TableField("tokens_used")
    private Integer tokensUsed;
    
    /**
     * 执行时间(毫秒)
     */
    @TableField("execution_time_ms")
    private Integer executionTimeMs;
    
    /**
     * 状态：SUCCESS, FAILED, PROCESSING，默认PROCESSING
     */
    @TableField("status")
    private String status;
    
    /**
     * 错误信息
     */
    @TableField("error_message")
    private String errorMessage;
    
    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
}