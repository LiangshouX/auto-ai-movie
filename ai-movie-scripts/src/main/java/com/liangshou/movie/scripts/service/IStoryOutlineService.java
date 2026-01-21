package com.liangshou.movie.scripts.service;

import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import java.util.Optional;

/**
 * 故事大纲服务接口
 */
public interface IStoryOutlineService {
    StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO);
    Optional<StoryOutlineDTO> findByProjectId(String projectId);
    StoryOutlineDTO updateOutline(String id, StoryOutlineDTO outlineDTO);
    void deleteOutline(String id);
}