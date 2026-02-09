package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptCharacterSupport;
import com.liangshou.movie.scripts.service.IScriptCharacterService;
import com.liangshou.movie.scripts.service.dto.ScriptCharacterDTO;
import com.liangshou.movie.scripts.utils.scripts.ArrayJsonUtil;
import com.liangshou.movie.scripts.utils.scripts.CharacterRelationshipUtil;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色信息业务服务实现类
 */
@Service
@SuppressWarnings("unused")
public class IScriptCharacterServiceImpl implements IScriptCharacterService {

    private static final Logger LOGGER = LoggerFactory.getLogger(IScriptCharacterServiceImpl.class);

    @Resource
    private IScriptCharacterSupport scriptCharacterSupport;

    @Override
    public ScriptCharacterDTO createCharacter(ScriptCharacterDTO characterDTO) {
        try {
            // 参数校验
            if (characterDTO == null) {
                throw new IllegalArgumentException("角色DTO不能为空");
            }

            if (!StringUtils.hasText(characterDTO.getProjectId())) {
                throw new IllegalArgumentException("项目ID不能为空");
            }

            // 转换DTO到PO，处理数组到JSON的转换
            ScriptCharacterPO entity = new ScriptCharacterPO();
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
            entity.setCharacterRelationships(CharacterRelationshipUtil.toJson(characterDTO.getCharacterRelationships()));
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            // 保存到数据库
            boolean saved = scriptCharacterSupport.save(entity);
            if (!saved) {
                throw new BizException(ErrorCodeEnum.CHARACTER_CREATE_FAILED);
            }

            // 转换PO到DTO并返回，处理JSON到数组的转换
            ScriptCharacterDTO result = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, result);
            result.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
            result.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
            return result;
        } catch (Exception e) {
            LOGGER.error("创建角色信息时发生错误，新建角色为：{}", characterDTO);
            throw new BizException(ErrorCodeEnum.CHARACTER_CREATE_FAILED, e);
        }
    }


    @Override
    @Transactional(readOnly = true)
    public ScriptCharacterDTO findById(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return null;
            }

            ScriptCharacterPO entity = scriptCharacterSupport.getById(id);
            if (entity == null) {
                return null;
            }

            ScriptCharacterDTO dto = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, dto);
            // 将JSON字符串转换为数组
            dto.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
            dto.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
            // 将JSON字符串转换为角色关系对象列表
            dto.setCharacterRelationships(CharacterRelationshipUtil.fromJson(entity.getCharacterRelationships()));
            return dto;
        } catch (Exception e) {
            LOGGER.error("根据ID查找角色信息失败: id={}", id, e);
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScriptCharacterDTO> findByProjectId(String projectId) {
        try {
            if (!StringUtils.hasText(projectId)) {
                return List.of();
            }

            QueryWrapper<ScriptCharacterPO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("project_id", projectId);
            List<ScriptCharacterPO> entities = scriptCharacterSupport.list(queryWrapper);

            return entities.stream().map(entity -> {
                ScriptCharacterDTO dto = new ScriptCharacterDTO();
                BeanUtils.copyProperties(entity, dto);
                // 将JSON字符串转换为数组
                dto.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
                dto.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
                // 将JSON字符串转换为角色关系对象列表
                dto.setCharacterRelationships(CharacterRelationshipUtil.fromJson(entity.getCharacterRelationships()));
                return dto;
            }).toList();
        } catch (Exception e) {
            LOGGER.error("根据项目ID查找角色信息失败: projectId={}", projectId, e);
            return List.of();
        }
    }

    @Override
    public ScriptCharacterDTO updateCharacter(ScriptCharacterDTO characterDTO) {
        try {
            // 参数校验
            if (characterDTO == null || !StringUtils.hasText(characterDTO.getId())) {
                return null;
            }

            // 检查角色是否存在
            ScriptCharacterPO existingEntity = scriptCharacterSupport.getById(characterDTO.getId());
            if (existingEntity == null) {
                return null;
            }

            // 转换DTO到PO，处理数组到JSON的转换
            ScriptCharacterPO entity = new ScriptCharacterPO();
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
            entity.setCharacterRelationships(CharacterRelationshipUtil.toJson(characterDTO.getCharacterRelationships()));
            entity.setCreatedAt(existingEntity.getCreatedAt()); // 保持原有的创建时间
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新数据库
            boolean updated = scriptCharacterSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHARACTER_UPDATE_FAILED);
            }

            // 转换PO到DTO并返回，处理JSON到数组的转换
            ScriptCharacterDTO result = new ScriptCharacterDTO();
            BeanUtils.copyProperties(entity, result);
            result.setPersonalityTags(ArrayJsonUtil.jsonToArray(entity.getPersonalityTags()));
            result.setSkills(ArrayJsonUtil.jsonToArray(entity.getSkills()));
            return result;
        } catch (Exception e) {
            LOGGER.error("更新角色信息失败: id={}", characterDTO.getId());
            throw new BizException(ErrorCodeEnum.CHARACTER_UPDATE_FAILED, e);
        }
    }

    @Override
    public void deleteCharacter(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return;
            }

            // 检查角色是否存在
            ScriptCharacterPO entity = scriptCharacterSupport.getById(id);
            if (entity == null) {
                LOGGER.warn("尝试删除不存在的角色信息: id={}", id);
                return;
            }

            // 删除角色
            boolean removed = scriptCharacterSupport.removeById(id);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.CHARACTER_DELETE_FAILED);
            }

            LOGGER.info("成功删除角色信息: id={}", id);
        } catch (Exception e) {
            LOGGER.error("删除角色信息时发生错误: id={}", id);
            throw new BizException(ErrorCodeEnum.CHARACTER_DELETE_FAILED, e);

        }


    }

    @Override
    public List<ScriptCharacterDTO> findAll() {
        try {
            List<ScriptCharacterPO> scriptCharacterPOS = scriptCharacterSupport.list();
        } catch (Exception e) {
            LOGGER.error("查询所有角色信息时发生错误", e);
        }
        return List.of();
    }
}