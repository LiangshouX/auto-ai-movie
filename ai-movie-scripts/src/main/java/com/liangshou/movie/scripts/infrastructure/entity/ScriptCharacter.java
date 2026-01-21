package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色信息实体
 */
@Data
@TableName("script_characters")
public class ScriptCharacter {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String projectId;
    
    private String name;
    
    private Integer age;
    
    private String gender;
    
    private String personalityTags; // JSON格式存储
    
    private String roleInStory;
    
    private String skills; // JSON格式存储
    
    private String characterSetting;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}