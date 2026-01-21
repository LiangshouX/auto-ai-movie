package com.liangshou.movie.scripts.infrastructure.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色关系实体
 */
@Data
@TableName("character_relationships")
public class CharacterRelationship {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String characterId;
    
    private String relatedCharacterId;
    
    private String relationshipType;
    
    private String description;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}