package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * AI生成日志实体
 */
@Data
@TableName("ai_generation_logs")
public class AiGenerationLog {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String projectId;
    
    private String generationType; // CREATIVE, THEME, SUMMARY, CHARACTER, OUTLINE, CHAPTER
    
    private String prompt;
    
    private String response;
    
    private Integer tokensUsed;
    
    private Integer executionTimeMs;
    
    private String status; // SUCCESS, FAILED, PROCESSING
    
    private String errorMessage;
    
    private LocalDateTime createdAt;
}