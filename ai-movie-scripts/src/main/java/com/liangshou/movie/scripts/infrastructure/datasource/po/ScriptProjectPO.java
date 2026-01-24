package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本项目实体
 * 表名: script_projects
 * 索引: idx_author_id(author_id), idx_status(status), idx_created_at(created_at)
 */
@Data
@TableName("script_projects")
public class ScriptProjectPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id; // 项目唯一标识
    
    private String title; // 剧本标题
    
    private String description; // 剧本描述
    
    private String theme; // 主题背景
    
    private String summary; // 剧情梗概
    
    private String status; // 项目状态，默认'CREATED'
    
    private String authorId; // 作者ID
    
    private LocalDateTime createdAt; // 创建时间
    
    private LocalDateTime updatedAt; // 更新时间
}