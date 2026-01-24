package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import java.util.Optional;

/**
 * 故事大纲数据操作接口
 */
public interface IStoryOutlineSupport {

    StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO);

    Optional<StoryOutlineDTO> findByProjectId(String projectId);

    StoryOutlineDTO updateOutline(String id, StoryOutlineDTO outlineDTO);

    void deleteOutline(String id);
}