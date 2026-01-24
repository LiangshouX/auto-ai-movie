package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
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
    private String id; // 日志唯一标识
    
    private String projectId; // 关联项目ID
    
    private String generationType; // 生成类型：CREATIVE, THEME, SUMMARY, CHARACTER, OUTLINE, CHAPTER
    
    private String prompt; // 输入提示
    
    private String response; // AI响应
    
    private Integer tokensUsed; // 使用token数量
    
    private Integer executionTimeMs; // 执行时间(毫秒)
    
    private String status; // 状态：SUCCESS, FAILED, PROCESSING，默认PROCESSING
    
    private String errorMessage; // 错误信息
    
    private LocalDateTime createdAt; // 创建时间
}