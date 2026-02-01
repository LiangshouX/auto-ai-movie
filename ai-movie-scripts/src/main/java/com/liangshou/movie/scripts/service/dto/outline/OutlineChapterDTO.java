package com.liangshou.movie.scripts.service.dto.outline;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 大纲章节中的章节数据传输对象
 */
@Data
public class OutlineChapterDTO {
    
    /**
     * 章节ID, 章节的唯一标识
     */
    private String chapterId;
    
    /**
     * 章节标题
     */
    private String chapterTitle;
    
    /**
     * 章节简略总结
     */
    private String chapterSummary;
    
    /**
     * 章节号，标识chapter在section的第几章
     */
    private Integer chapterNumber;
    
    /**
     * 桥段数量
     */
    private Integer episodeCount;
    
    /**
     * 字数统计
     */
    private Integer wordCount;
    
    /**
     * 桥段列表
     */
    private List<OutlineEpisodeDTO> episodes;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}