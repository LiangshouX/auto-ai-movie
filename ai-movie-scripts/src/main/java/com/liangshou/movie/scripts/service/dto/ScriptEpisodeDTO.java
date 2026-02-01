package com.liangshou.movie.scripts.service.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 桥段内容数据传输对象
 */
@Data
public class ScriptEpisodeDTO {
    
    /**
     * 桥段内容的唯一标识
     */
    private String id;
    
    /**
     * 关联项目ID
     */
    private String projectId;
    
    /**
     * 所属章节ID
     */
    private String chapterId;
    
    /**
     * 桥段号，标识episode在chapter的第几桥段
     */
    private Integer episodeNumber;
    
    /**
     * 桥段标题
     */
    private String episodeTitle;
    
    /**
     * 桥段内容
     */
    private String episodeContent;
    
    /**
     * 字数统计
     */
    private Integer wordCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}