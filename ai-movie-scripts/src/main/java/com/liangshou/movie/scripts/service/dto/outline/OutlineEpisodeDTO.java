package com.liangshou.movie.scripts.service.dto.outline;

import lombok.Data;

/**
 * 大纲章节中的桥段数据传输对象
 */
@Data
public class OutlineEpisodeDTO {
    
    /**
     * 桥段ID，属于某一章节的某桥段的唯一标识
     */
    private String episodeId;
    
    /**
     * 桥段标题
     */
    private String episodeTitle;
    
    /**
     * 桥段号，标识episode在chapter的第几桥段
     */
    private Integer episodeNumber;
}