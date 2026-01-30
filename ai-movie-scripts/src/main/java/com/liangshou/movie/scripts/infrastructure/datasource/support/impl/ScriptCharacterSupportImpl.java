package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptCharacterMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptCharacterSupport;
import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色信息服务实现类
 */
@Service
public class ScriptCharacterSupportImpl extends ServiceImpl<ScriptCharacterMapper, ScriptCharacterPO> implements IScriptCharacterSupport {

    @Transactional
    @Override
    public ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO) {
        ScriptCharacterPO entity = new ScriptCharacterPO();
        BeanUtils.copyProperties(characterDTO, entity);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        this.save(entity);

        ScriptCharacterDTO result = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Transactional(readOnly = true)
    @Override
    public ScriptCharacterDTO findById(String id) {
        ScriptCharacterPO entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptCharacterDTO dto = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Transactional(readOnly = true)
    @Override
    public List<ScriptCharacterDTO> findByProjectId(String projectId) {
        QueryWrapper<ScriptCharacterPO> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        List<ScriptCharacterPO> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptCharacterDTO dto = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ScriptCharacterDTO updateCharacter(ScriptCharacterDTO characterDTO) {
        // 从DTO中获取ID
        String id = characterDTO.getId();
        if (id == null || id.trim().isEmpty()) {
            return null;
        }
        
        ScriptCharacterPO entity = this.getById(id);
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

    @Transactional
    @Override
    public void deleteCharacter(String id) {
        this.removeById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ScriptCharacterDTO> findAll() {
        List<ScriptCharacterPO> entities = this.list();
        return entities.stream().map(entity -> {
            ScriptCharacterDTO dto = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}