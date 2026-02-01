package com.liangshou.movie.scripts.service.dto.outline;

import lombok.Data;

import java.util.List;

/**
 * 更新大纲章节结构的请求数据传输对象
 */
@Data
public class UpdateSectionsRequest {
    
    /**
     * 项目ID
     */
    private String projectId;
    
    /**
     * 章节结构列表
     */
    private List<OutlineSectionDTO> sections;
}