package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色关系实体
 * 表名: character_relationships
 * 外键: character_id -> script_characters.id, related_character_id -> script_characters.id
 * 唯一索引: uk_char_relation(character_id, related_character_id)
 */
@Data
@TableName("character_relationships")
public class CharacterRelationshipPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id; // 关系唯一标识
    
    private String characterId; // 角色ID
    
    private String relatedCharacterId; // 相关角色ID
    
    private String relationshipType; // 关系类型
    
    private String description; // 关系描述
    
    private LocalDateTime createdAt; // 创建时间
    
    private LocalDateTime updatedAt; // 更新时间
}