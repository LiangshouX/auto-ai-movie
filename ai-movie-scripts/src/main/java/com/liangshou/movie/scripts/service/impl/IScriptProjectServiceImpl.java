package com.liangshou.movie.scripts.service.impl;

import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptProjectPO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptProjectSupport;
import com.liangshou.movie.scripts.service.IScriptProjectService;
import com.liangshou.movie.scripts.service.dto.ScriptProjectDTO;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 剧本项目业务服务实现类
 */
@Service
@SuppressWarnings("unused")
public class IScriptProjectServiceImpl implements IScriptProjectService {

    private static final Logger LOGGER = LoggerFactory.getLogger(IScriptProjectServiceImpl.class);

    @Resource
    private IScriptProjectSupport scriptProjectSupport;

    @Override
    public ScriptProjectDTO createProject(ScriptProjectDTO projectDTO) {
        try {
            // 参数校验
            if (projectDTO == null) {
                throw new IllegalArgumentException("项目DTO不能为空");
            }

            // 转换DTO到PO
            ScriptProjectPO entity = new ScriptProjectPO();
            BeanUtils.copyProperties(projectDTO, entity);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            // 保存到数据库
            boolean saved = scriptProjectSupport.save(entity);
            if (!saved) {
                throw new BizException(ErrorCodeEnum.PROJECT_CREATE_FAILED);
            }

            // 转换PO到DTO并返回
            ScriptProjectDTO result = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, result);
            return result;
        } catch (Exception e) {
            LOGGER.error("创建剧本项目时发生错误");
            throw new BizException(ErrorCodeEnum.PROJECT_CREATE_FAILED, e);
        }
    }

    @Override
    public ScriptProjectDTO findById(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return null;
            }

            ScriptProjectPO entity = scriptProjectSupport.getById(id);
            if (entity == null) {
                return null;
            }

            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        } catch (Exception e) {
            LOGGER.error("根据ID查找剧本项目失败: id={}", id, e);
            return null;
        }
    }

    @Override
    public List<ScriptProjectDTO> findAll() {
        try {
            List<ScriptProjectPO> entities = scriptProjectSupport.list();
            return entities.stream().map(entity -> {
                ScriptProjectDTO dto = new ScriptProjectDTO();
                BeanUtils.copyProperties(entity, dto);
                return dto;
            }).toList();
        } catch (Exception e) {
            LOGGER.error("查询所有剧本项目失败", e);
            return List.of();
        }
    }

    @Override
    public ScriptProjectDTO updateProject(String id, ScriptProjectDTO projectDTO) {
        try {
            // 参数校验
            if (!StringUtils.hasText(id) || projectDTO == null) {
                throw new IllegalArgumentException("参数错误");
            }

            // 检查项目是否存在
            ScriptProjectPO existingEntity = scriptProjectSupport.getById(id);
            if (existingEntity == null) {
                return null;
            }

            // 转换DTO到PO
            ScriptProjectPO entity = new ScriptProjectPO();
            BeanUtils.copyProperties(projectDTO, entity);
            entity.setId(id); // 确保ID不变
            entity.setCreatedAt(existingEntity.getCreatedAt()); // 保持原有的创建时间
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新数据库
            boolean updated = scriptProjectSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED);
            }

            // 返回更新后的数据
            ScriptProjectDTO result = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, result);
            return result;
        } catch (Exception e) {
            LOGGER.error("更新剧本项目失败: id={}", id);
            throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED, e);
        }
    }

    @Override
    public void deleteProject(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return;
            }

            // 检查项目是否存在
            ScriptProjectPO entity = scriptProjectSupport.getById(id);
            if (entity == null) {
                LOGGER.warn("尝试删除不存在的剧本项目: id={}", id);
                return;
            }

            // 删除项目
            boolean removed = scriptProjectSupport.removeById(id);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.PROJECT_DELETE_FAILED);
            }

            LOGGER.info("成功删除剧本项目: id={}", id);
        } catch (Exception e) {
            LOGGER.error("删除剧本项目时发生错误: id={}", id);
            throw new BizException(ErrorCodeEnum.PROJECT_DELETE_FAILED, e);
        }
    }

    @Override
    public ScriptProjectDTO updateProjectTheme(String id, String theme) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("项目ID不能为空");
            }

            ScriptProjectPO entity = scriptProjectSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setTheme(theme);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = scriptProjectSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED);
            }

            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        } catch (Exception e) {
            LOGGER.error("更新项目主题时发生错误: id={}, theme={}", id, theme);
            throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED, e);
        }
    }

    @Override
    public ScriptProjectDTO updateProjectSummary(String id, String summary) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("项目ID不能为空");
            }

            ScriptProjectPO entity = scriptProjectSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setSummary(summary);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = scriptProjectSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED);
            }

            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        } catch (Exception e) {
            LOGGER.error("更新项目摘要时发生错误: id={}, summary={}", id, summary);
            throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED, e);
        }
    }

    @Override
    public ScriptProjectDTO updateProjectStatus(String id, String status) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("项目ID不能为空");
            }

            ScriptProjectPO entity = scriptProjectSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setStatus(status);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = scriptProjectSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED);
            }

            ScriptProjectDTO dto = new ScriptProjectDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        } catch (Exception e) {
            LOGGER.error("更新项目状态时发生错误: id={}, status={}", id, status);
            throw new BizException(ErrorCodeEnum.PROJECT_UPDATE_FAILED, e);
        }
    }
}