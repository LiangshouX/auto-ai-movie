package com.liangshou.movie.scripts.service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本章节数据传输对象
 */
@Data
public class ScriptChapterDTO {
    private String id;
    private String projectId;
    private String episodeId;
    private Integer chapterNumber;
    private String title;
    private String content;
    private Integer wordCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}