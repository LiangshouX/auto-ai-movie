package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptCharacterMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptCharacterSupport;
import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import com.liangshou.movie.scripts.utils.scripts.ArrayJsonUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色信息服务实现类
 */
@Service
@SuppressWarnings("unused")
public class ScriptCharacterSupportImpl extends ServiceImpl<ScriptCharacterMapper, ScriptCharacterPO> implements IScriptCharacterSupport {

    @Transactional
    @Override
    public ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO) {
        ScriptCharacterPO entity = new ScriptCharacterPO();
        // 手动复制属性，处理数组到JSON的转换
        entity.setId(characterDTO.getId());
        entity.setProjectId(characterDTO.getProjectId());
        entity.setName(characterDTO.getName());
        entity.setAge(characterDTO.getAge());
        entity.setGender(characterDTO.getGender());
        // 将数组转换为JSON字符串
        entity.setPersonalityTags(ArrayJsonUtil.arrayToJson(characterDTO.getPersonalityTags()));
        entity.setRoleInStory(characterDTO.getRoleInStory());
        // 将数组转换为JSON字符串
        entity.setSkills(ArrayJsonUtil.arrayToJson(characterDTO.getSkills()));
        entity.setCharacterSetting(characterDTO.getCharacterSetting());
        entity.setCharacterRelationships(characterDTO.getCharacterRelationships());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        this.save(entity);

        ScriptCharacterDTO result = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, result);
        // 将JSON字符串转换回数组
        result.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
        result.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
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
        // 将JSON字符串转换为数组
        dto.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
        dto.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
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
            // 将JSON字符串转换为数组
            dto.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
            dto.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
            return dto;
        }).toList();
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

        // 手动复制属性，处理数组到JSON的转换
        entity.setProjectId(characterDTO.getProjectId());
        entity.setName(characterDTO.getName());
        entity.setAge(characterDTO.getAge());
        entity.setGender(characterDTO.getGender());
        // 将数组转换为JSON字符串
        entity.setPersonalityTags(ArrayJsonUtil.arrayToJson(characterDTO.getPersonalityTags()));
        entity.setRoleInStory(characterDTO.getRoleInStory());
        // 将数组转换为JSON字符串
        entity.setSkills(ArrayJsonUtil.arrayToJson(characterDTO.getSkills()));
        entity.setCharacterSetting(characterDTO.getCharacterSetting());
        entity.setCharacterRelationships(characterDTO.getCharacterRelationships());
        entity.setUpdatedAt(LocalDateTime.now());
        
        this.updateById(entity);

        ScriptCharacterDTO result = new ScriptCharacterDTO();
        BeanUtils.copyProperties(entity, result);
        // 将JSON字符串转换回数组
        result.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
        result.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
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
            // 将JSON字符串转换为数组
            dto.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
            dto.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
            return dto;
        }).toList();
    }
}