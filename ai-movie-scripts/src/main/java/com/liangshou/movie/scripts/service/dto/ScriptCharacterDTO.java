package com.liangshou.movie.scripts.service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色信息数据传输对象
 */
@Data
public class ScriptCharacterDTO {
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