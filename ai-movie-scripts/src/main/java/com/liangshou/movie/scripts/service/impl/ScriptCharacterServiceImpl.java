package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.entity.ScriptCharacter;
import com.liangshou.movie.scripts.infrastructure.mapper.ScriptCharacterMapper;
import com.liangshou.movie.scripts.service.IScriptCharacterService;
import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色信息服务实现类
 */
@Service
public class ScriptCharacterServiceImpl extends ServiceImpl<ScriptCharacterMapper, ScriptCharacter> implements IScriptCharacterService {

    @Override
    public ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO) {
        ScriptCharacter entity = new ScriptCharacter();
        BeanUtils.copyProperties(characterDTO, entity);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        this.save(entity);

        ScriptCharacterDTO result = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public ScriptCharacterDTO findById(String id) {
        ScriptCharacter entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptCharacterDTO dto = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public List<ScriptCharacterDTO> findByProjectId(String projectId) {
        QueryWrapper<ScriptCharacter> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        List<ScriptCharacter> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptCharacterDTO dto = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ScriptCharacterDTO updateCharacter(String id, ScriptCharacterDTO characterDTO) {
        ScriptCharacter entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        BeanUtils.copyProperties(characterDTO, entity);
        entity.setId(id); // 确保ID不变
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptCharacterDTO result = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public void deleteCharacter(String id) {
        this.removeById(id);
    }

    @Override
    public List<ScriptCharacterDTO> findAll() {
        List<ScriptCharacter> entities = this.list();
        return entities.stream().map(entity -> {
            ScriptCharacterDTO dto = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}