package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 故事大纲实体
 * 表名: script_outlines
 * 索引: idx_project_id(project_id), idx_structure_type(structure_type)
 */
@Data
@TableName("script_outlines")
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
     * BEGINNING_RISING_ACTION_CLIMAX_END | HOOK_RISE_CONTINUATION_TURN_CONCLUSION
     */
    @TableField("structure_type")
    private String structureType;

    /**
     * 章节结构(JSON数组，包含章节和桥段信息)
     */
    @TableField("sections")
    private String sections;

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