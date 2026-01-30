package com.liangshou.movie.scripts.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 角色信息数据传输对象
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScriptCharacterDTO {
    private String id;
    private String projectId;
    private String name;
    private Integer age;
    private String gender;
    private String[] personalityTags;
    private String roleInStory;
    private String[] skills;
    private String characterSetting;

    /**
     * 格式遵从 {@link CharacterRelationshipDTO}
     */
    private String characterRelationships;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}