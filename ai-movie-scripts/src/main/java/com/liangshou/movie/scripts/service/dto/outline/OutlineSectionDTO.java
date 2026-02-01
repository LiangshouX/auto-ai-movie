package com.liangshou.movie.scripts.service.dto.outline;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 大纲章节数据传输对象
 */
@Data
public class OutlineSectionDTO {
    
    /**
     * 节点ID
     */
    private String sectionId;
    
    /**
     * 节点标题
     */
    private String sectionTitle;
    
    /**
     * 简略介绍此节的内容
     */
    private String description;
    
    /**
     * 顺序(1,2,3,4[,5])
     */
    private Integer sequence;
    
    /**
     * 章节数量
     */
    private Integer chapterCount;
    
    /**
     * 章节列表
     */
    private List<OutlineChapterDTO> chapters;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}