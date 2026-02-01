package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.liangshou.movie.scripts.service.dto.ScriptEpisodeDTO;

import java.util.List;

/**
 * 桥段内容数据操作接口
 */
public interface IScriptEpisodeSupport {

    /**
     * 创建桥段内容
     *
     * @param episodeDTO 桥段DTO
     * @return 创建后的桥段DTO
     */
    ScriptEpisodeDTO createEpisode(ScriptEpisodeDTO episodeDTO);

    /**
     * 根据ID查找桥段内容
     *
     * @param id 桥段ID
     * @return 桥段DTO，不存在时返回null
     */
    ScriptEpisodeDTO findById(String id);

    /**
     * 根据项目ID查找所有桥段内容
     *
     * @param projectId 项目ID
     * @return 桥段DTO列表
     */
    List<ScriptEpisodeDTO> findByProjectId(String projectId);

    /**
     * 根据章节ID查找所有桥段内容
     *
     * @param chapterId 章节ID
     * @return 桥段DTO列表
     */
    List<ScriptEpisodeDTO> findByChapterId(String chapterId);

    /**
     * 根据项目ID和章节ID查找桥段内容
     *
     * @param projectId 项目ID
     * @param chapterId 章节ID
     * @return 桥段DTO列表
     */
    List<ScriptEpisodeDTO> findByProjectIdAndChapterId(String projectId, String chapterId);

    /**
     * 查找所有桥段内容
     *
     * @return 桥段DTO列表
     */
    List<ScriptEpisodeDTO> findAll();

    /**
     * 更新桥段内容
     *
     * @param id         桥段ID
     * @param episodeDTO 更新的桥段DTO
     * @return 更新后的桥段DTO
     */
    ScriptEpisodeDTO updateEpisode(String id, ScriptEpisodeDTO episodeDTO);

    /**
     * 删除桥段内容
     *
     * @param id 桥段ID
     */
    void deleteEpisode(String id);

    /**
     * 批量删除桥段内容
     *
     * @param ids 桥段ID列表
     */
    void batchDeleteEpisodes(List<String> ids);

    /**
     * 更新桥段标题
     *
     * @param id           桥段ID
     * @param episodeTitle 桥段标题
     * @return 更新后的桥段DTO
     */
    ScriptEpisodeDTO updateEpisodeTitle(String id, String episodeTitle);

    /**
     * 更新桥段内容
     *
     * @param id             桥段ID
     * @param episodeContent 桥段内容
     * @return 更新后的桥段DTO
     */
    ScriptEpisodeDTO updateEpisodeContent(String id, String episodeContent);

    /**
     * 更新字数统计
     *
     * @param id        桥段ID
     * @param wordCount 字数统计
     * @return 更新后的桥段DTO
     */
    ScriptEpisodeDTO updateWordCount(String id, Integer wordCount);
}