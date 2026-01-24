package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.liangshou.movie.scripts.service.dto.ScriptProjectDTO;
import java.util.List;

/**
 * 剧本项目数据操作接口
 */
public interface IScriptProjectSupport {

    ScriptProjectDTO createProject(ScriptProjectDTO projectDTO);

    ScriptProjectDTO findById(String id);

    List<ScriptProjectDTO> findAll();

    ScriptProjectDTO updateProject(String id, ScriptProjectDTO projectDTO);

    void deleteProject(String id);

    ScriptProjectDTO updateProjectTheme(String id, String theme);

    ScriptProjectDTO updateProjectSummary(String id, String summary);

    ScriptProjectDTO updateProjectStatus(String id, String status);
}