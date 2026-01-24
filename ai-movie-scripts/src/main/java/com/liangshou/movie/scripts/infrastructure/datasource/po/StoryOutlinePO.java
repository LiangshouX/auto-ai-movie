package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 故事大纲实体
 * 表名: story_outlines
 * 外键: project_id -> script_projects.id
 * 索引: idx_project_id(project_id)
 */
@Data
@TableName("story_outlines")
public class StoryOutlinePO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id; // 大纲唯一标识
    
    private String projectId; // 关联项目ID
    
    private String structureType; // 结构类型
    
    private String outlineNodes; // 大纲节点(JSON格式存储)
    
    private LocalDateTime createdAt; // 创建时间
    
    private LocalDateTime updatedAt; // 更新时间
}