package com.liangshou.movie.scripts.service.dto;

import com.liangshou.movie.scripts.service.dto.outline.OutlineSectionDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 故事大纲数据传输对象
 */
@Data
public class StoryOutlineDTO {
    
    /**
     * 大纲唯一标识，与projectId一致
     */
    private String id;
    
    /**
     * 关联项目ID
     */
    private String projectId;
    
    /**
     * 结构类型
     * BEGINNING_RISING_ACTION_CLIMAX_END | HOOK_RISE_CONTINUATION_TURN_CONCLUSION
     */
    private String structureType;
    
    /**
     * 章节结构列表
     */
    private List<OutlineSectionDTO> sections;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}