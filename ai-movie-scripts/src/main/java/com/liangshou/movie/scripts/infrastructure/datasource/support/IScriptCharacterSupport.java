package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import java.util.List;

/**
 * 角色信息数据操作接口
 */
public interface IScriptCharacterSupport {

    ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO);

    ScriptCharacterDTO findById(String id);

    List<ScriptCharacterDTO> findByProjectId(String projectId);

    ScriptCharacterDTO updateCharacter(ScriptCharacterDTO characterDTO);

    void deleteCharacter(String id);

    List<ScriptCharacterDTO> findAll();
}