package com.liangshou.movie.scripts.service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本项目数据传输对象
 */
@Data
public class ScriptProjectDTO {
    private String id;
    private String title;
    private String description;
    private String theme;
    private String summary;
    private String status;
    private String authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}