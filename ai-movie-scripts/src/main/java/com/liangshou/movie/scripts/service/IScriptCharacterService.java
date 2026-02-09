package com.liangshou.movie.scripts.service;

import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import java.util.List;

/**
 * 角色信息业务服务接口
 */
public interface IScriptCharacterService {

    /**
     * 创建角色信息
     *
     * @param characterDTO 角色DTO
     * @return 创建后的角色DTO
     */
    ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO);

    /**
     * 根据ID查找角色信息
     *
     * @param id 角色ID
     * @return 角色DTO，不存在时返回null
     */
    ScriptCharacterDTO findById(String id);

    /**
     * 根据项目ID查找角色信息
     *
     * @param projectId 项目ID
     * @return 角色DTO列表
     */
    List<ScriptCharacterDTO> findByProjectId(String projectId);

    /**
     * 更新角色信息
     *
     * @param characterDTO 更新的角色DTO
     * @return 更新后的角色DTO
     */
    ScriptCharacterDTO updateCharacter(ScriptCharacterDTO characterDTO);

    /**
     * 删除角色信息
     *
     * @param id 角色ID
     */
    void deleteCharacter(String id);

    /**
     * 查找所有角色信息
     *
     * @return 角色DTO列表
     */
    List<ScriptCharacterDTO> findAll();
    
    // 对于简单的CRUD操作，可以在接口中提供默认实现
    // 涉及复杂数据转换的逻辑仍然放在实现类中
}