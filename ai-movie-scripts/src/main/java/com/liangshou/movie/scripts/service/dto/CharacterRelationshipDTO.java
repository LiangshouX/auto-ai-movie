package com.liangshou.movie.scripts.service.dto;

import lombok.Data;

/**
 * 角色关系数据传输对象
 */
@Data
public class CharacterRelationshipDTO {
    /**
     * 相关角色ID
     */
    private String relatedCharacterId;
    
    /**
     * 相关角色姓名
     */
    private String relatedCharacterName;
    
    /**
     * 关系类型(朋友/敌人/恋人等)
     */
    private String relationshipType;
    
    /**
     * 关系描述
     */
    private String description;

}
