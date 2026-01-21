package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 故事大纲实体
 */
@Data
@TableName("story_outlines")
public class StoryOutline {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String projectId;
    
    private String structureType;
    
    private String outlineNodes; // JSON格式存储
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}