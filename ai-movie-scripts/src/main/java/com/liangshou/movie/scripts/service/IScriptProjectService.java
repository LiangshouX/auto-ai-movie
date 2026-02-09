package com.liangshou.movie.scripts.service;

import com.liangshou.movie.scripts.service.dto.ScriptProjectDTO;
import java.util.List;

/**
 * 剧本项目业务服务接口
 */
public interface IScriptProjectService {

    /**
     * 创建剧本项目
     *
     * @param projectDTO 项目DTO
     * @return 创建后的项目DTO
     */
    ScriptProjectDTO createProject(ScriptProjectDTO projectDTO);

    /**
     * 根据ID查找剧本项目
     *
     * @param id 项目ID
     * @return 项目DTO，不存在时返回null
     */
    ScriptProjectDTO findById(String id);

    /**
     * 查找所有剧本项目
     *
     * @return 项目DTO列表
     */
    List<ScriptProjectDTO> findAll();

    /**
     * 更新剧本项目
     *
     * @param id         项目ID
     * @param projectDTO 更新的项目DTO
     * @return 更新后的项目DTO
     */
    ScriptProjectDTO updateProject(String id, ScriptProjectDTO projectDTO);

    /**
     * 删除剧本项目
     *
     * @param id 项目ID
     */
    void deleteProject(String id);

    /**
     * 更新项目主题
     *
     * @param id    项目ID
     * @param theme 主题
     * @return 更新后的项目DTO
     */
    ScriptProjectDTO updateProjectTheme(String id, String theme);

    /**
     * 更新项目摘要
     *
     * @param id      项目ID
     * @param summary 摘要
     * @return 更新后的项目DTO
     */
    ScriptProjectDTO updateProjectSummary(String id, String summary);

    /**
     * 更新项目状态
     *
     * @param id     项目ID
     * @param status 状态
     * @return 更新后的项目DTO
     */
    ScriptProjectDTO updateProjectStatus(String id, String status);
    
    // 对于简单的查询操作，可以在接口中提供默认实现
    // 复杂的业务逻辑仍然放在实现类中
}