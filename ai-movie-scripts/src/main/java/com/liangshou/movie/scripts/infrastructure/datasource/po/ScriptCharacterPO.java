package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色信息实体
 */
@Data
@TableName("script_characters")
public class ScriptCharacterPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    /**
     * 关联项目ID
     */
    @TableField("project_id")
    private String projectId;
    
    /**
     * 角色姓名
     */
    @TableField("name")
    private String name;
    
    /**
     * 年龄
     */
    @TableField("age")
    private Integer age;
    
    /**
     * 性别
     */
    @TableField("gender")
    private String gender;
    
    /**
     * 性格标签(JSON数组)
     */
    @TableField("personality_tags")
    private String personalityTags;
    
    /**
     * 在故事中的定位
     */
    @TableField("role_in_story")
    private String roleInStory;
    
    /**
     * 技能列表(JSON数组)
     */
    @TableField("skills")
    private String skills;
    
    /**
     * 角色设定描述
     */
    @TableField("character_setting")
    private String characterSetting;
    
    /**
     * 角色关系(JSON数组)
     */
    @TableField("character_relationships")
    private String characterRelationships;
    
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