package com.liangshou.movie.scripts.service;

import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import java.util.List;

/**
 * 角色信息服务接口
 */
public interface IScriptCharacterService {
    ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO);
    ScriptCharacterDTO findById(String id);
    List<ScriptCharacterDTO> findByProjectId(String projectId);
    ScriptCharacterDTO updateCharacter(String id, ScriptCharacterDTO characterDTO);
    void deleteCharacter(String id);
    List<ScriptCharacterDTO> findAll();
}