package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
    private String id;
    
    /**
     * 关联项目ID
     */
    @TableField("project_id")
    private String projectId;
    
    /**
     * 结构类型
     */
    @TableField("structure_type")
    private String structureType;
    
    /**
     * 大纲节点(JSON格式存储)
     */
    @TableField("outline_nodes")
    private String outlineNodes;
    
    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField("updated_at")
    private LocalDateTime updatedAt;
}