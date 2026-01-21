package com.liangshou.movie.scripts.service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 故事大纲数据传输对象
 */
@Data
public class StoryOutlineDTO {
    private String id;
    private String projectId;
    private String structureType;
    private String outlineNodes; // JSON格式存储
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}