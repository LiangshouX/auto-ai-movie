package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本项目实体
 */
@Data
@TableName("script_projects")
public class ScriptProject {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String title;
    
    private String description;
    
    private String theme;
    
    private String summary;
    
    private String status;
    
    private String authorId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}