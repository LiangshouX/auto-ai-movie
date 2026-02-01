package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;

import java.util.List;

/**
 * 故事大纲数据操作接口
 */
public interface IStoryOutlineSupport {

    /**
     * 创建故事大纲
     *
     * @param outlineDTO 大纲DTO
     * @return 创建后的大纲DTO
     */
    StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO);

    /**
     * 根据ID查找故事大纲
     *
     * @param id 大纲ID
     * @return 大纲DTO，不存在时返回null
     */
    StoryOutlineDTO findById(String id);

    /**
     * 根据项目ID查找故事大纲
     *
     * @param projectId 项目ID
     * @return 大纲DTO，不存在时返回null
     */
    StoryOutlineDTO findByProjectId(String projectId);

    /**
     * 查找所有故事大纲
     *
     * @return 大纲DTO列表
     */
    List<StoryOutlineDTO> findAll();

    /**
     * 更新故事大纲
     *
     * @param id         大纲ID
     * @param outlineDTO 更新的大纲DTO
     * @return 更新后的大纲DTO
     */
    StoryOutlineDTO updateOutline(String id, StoryOutlineDTO outlineDTO);

    /**
     * 删除故事大纲
     *
     * @param id 大纲ID
     */
    void deleteOutline(String id);

    /**
     * 更新大纲结构类型
     *
     * @param id            大纲ID
     * @param structureType 结构类型
     * @return 更新后的大纲DTO
     */
    StoryOutlineDTO updateStructureType(String id, String structureType);

    /**
     * 更新大纲章节结构
     *
     * @param id       大纲ID
     * @param sections 章节结构
     * @return 更新后的大纲DTO
     */
    StoryOutlineDTO updateSections(String id, List<com.liangshou.movie.scripts.service.dto.outline.OutlineSectionDTO> sections);
}