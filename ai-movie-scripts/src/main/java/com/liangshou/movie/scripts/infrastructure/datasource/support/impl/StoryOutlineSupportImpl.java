package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.StoryOutlineMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.StoryOutlinePO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IStoryOutlineSupport;
import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import com.liangshou.movie.scripts.service.dto.outline.OutlineSectionDTO;
import com.liangshou.movie.scripts.utils.scripts.OutlineJsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 故事大纲服务实现类
 */
@Service
@SuppressWarnings("unused")
public class StoryOutlineSupportImpl extends ServiceImpl<StoryOutlineMapper, StoryOutlinePO> implements IStoryOutlineSupport {

    private static final Logger LOGGER = LoggerFactory.getLogger(StoryOutlineSupportImpl.class);

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO) {
        try {
            // 参数校验
            if (outlineDTO == null) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            if (!StringUtils.hasText(outlineDTO.getProjectId())) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "项目ID不能为空");
            }

            // 检查是否已存在该项目的大纲
            QueryWrapper<StoryOutlinePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("project_id", outlineDTO.getProjectId());
            if (this.count(queryWrapper) > 0) {
                throw new BizException(ErrorCodeEnum.OUTLINE_CREATE_FAILED.getCode(), "该项目已存在大纲");
            }

            // 转换DTO到PO
            StoryOutlinePO entity = convertToPO(outlineDTO);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            // 保存到数据库
            boolean saved = this.save(entity);
            if (!saved) {
                throw new BizException(ErrorCodeEnum.OUTLINE_CREATE_FAILED.getCode(), "大纲创建失败");
            }

            // 转换PO到DTO并返回
            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("创建故事大纲时发生未知错误", e);
            throw new BizException(ErrorCodeEnum.OUTLINE_CREATE_FAILED);
        }
    }

    @Override
    public StoryOutlineDTO findById(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return null;
            }

            StoryOutlinePO entity = this.getById(id);
            if (entity == null) {
                return null;
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("根据ID查找故事大纲失败: id={}", id, e);
            // 兜底处理：返回null而不是抛出异常
            return null;
        }
    }

    @Override
    public StoryOutlineDTO findByProjectId(String projectId) {
        try {
            if (!StringUtils.hasText(projectId)) {
                return null;
            }

            QueryWrapper<StoryOutlinePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("project_id", projectId);
            StoryOutlinePO entity = this.getOne(queryWrapper);

            if (entity == null) {
                return null;
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("根据项目ID查找故事大纲失败: projectId={}", projectId, e);
            // 兜底处理：返回null而不是抛出异常
            return null;
        }
    }

    @Override
    public List<StoryOutlineDTO> findAll() {
        try {
            List<StoryOutlinePO> entities = this.list();
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("查询所有故事大纲失败", e);
            // 兜底处理：返回空列表而不是抛出异常
            return List.of();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StoryOutlineDTO updateOutline(String id, StoryOutlineDTO outlineDTO) {
        try {
            // 参数校验
            if (!StringUtils.hasText(id) || outlineDTO == null) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            // 检查大纲是否存在
            StoryOutlinePO existingEntity = this.getById(id);
            if (existingEntity == null) {
                throw new BizException(ErrorCodeEnum.OUTLINE_NOT_FOUND.getCode(), "大纲不存在");
            }

            // 转换DTO到PO
            StoryOutlinePO entity = convertToPO(outlineDTO);
            entity.setId(id); // 确保ID不变
            entity.setProjectId(existingEntity.getProjectId()); // 保持原有的项目ID
            entity.setCreatedAt(existingEntity.getCreatedAt()); // 保持原有的创建时间
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新数据库
            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "大纲更新失败");
            }

            // 返回更新后的数据
            return convertToDTO(entity);
        } catch (BizException e) {
            LOGGER.error("更新故事大纲失败: id={}", id);
            throw e;
        } catch (Exception e) {
            LOGGER.error("更新故事大纲时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "更新大纲时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOutline(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return;
            }

            // 检查大纲是否存在
            if (!this.existsById(id)) {
                LOGGER.warn("尝试删除不存在的故事大纲: id={}", id);
                return;
            }

            // 删除大纲
            boolean removed = this.removeById(id);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.OUTLINE_DELETE_FAILED.getCode(), "大纲删除失败");
            }

            LOGGER.info("成功删除故事大纲: id={}", id);
        } catch (Exception e) {
            LOGGER.error("删除故事大纲时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.OUTLINE_DELETE_FAILED.getCode(), "删除大纲时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StoryOutlineDTO updateStructureType(String id, String structureType) {
        try {
            if (!StringUtils.hasText(id) || !StringUtils.hasText(structureType)) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            StoryOutlinePO entity = this.getById(id);
            if (entity == null) {
                throw new BizException(ErrorCodeEnum.OUTLINE_NOT_FOUND.getCode(), "大纲不存在");
            }

            entity.setStructureType(structureType);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "更新结构类型失败");
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新大纲结构类型时发生未知错误: id={}, structureType={}", id, structureType, e);
            throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "更新结构类型时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StoryOutlineDTO updateSections(String id, List<OutlineSectionDTO> sections) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            StoryOutlinePO entity = this.getById(id);
            if (entity == null) {
                throw new BizException(ErrorCodeEnum.OUTLINE_NOT_FOUND.getCode(), "大纲不存在");
            }

            // 转换章节列表为JSON
            String sectionsJson = OutlineJsonUtil.sectionsToJson(sections);
            entity.setSections(sectionsJson);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "更新章节结构失败");
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新大纲章节结构时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.OUTLINE_UPDATE_FAILED.getCode(), "更新章节结构时发生系统错误");
        }
    }

    /**
     * 检查大纲是否存在
     */
    private boolean existsById(String id) {
        try {
            return this.getById(id) != null;
        } catch (Exception e) {
            LOGGER.error("检查大纲是否存在时发生错误: id={}", id, e);
            return false;
        }
    }

    /**
     * 将DTO转换为PO
     */
    private StoryOutlinePO convertToPO(StoryOutlineDTO dto) {
        if (dto == null) {
            return null;
        }

        StoryOutlinePO po = new StoryOutlinePO();
        BeanUtils.copyProperties(dto, po);

        // 特殊处理：将章节列表转换为JSON
        if (dto.getSections() != null) {
            po.setSections(OutlineJsonUtil.sectionsToJson(dto.getSections()));
        } else {
            po.setSections("[]");
        }

        return po;
    }

    /**
     * 将PO转换为DTO
     */
    private StoryOutlineDTO convertToDTO(StoryOutlinePO po) {
        if (po == null) {
            return null;
        }

        StoryOutlineDTO dto = new StoryOutlineDTO();
        BeanUtils.copyProperties(po, dto);

        // 特殊处理：将JSON转换为章节列表
        try {
            if (StringUtils.hasText(po.getSections())) {
                dto.setSections(OutlineJsonUtil.jsonToSections(po.getSections()));
            } else {
                dto.setSections(List.of());
            }
        } catch (Exception e) {
            LOGGER.warn("转换章节结构JSON时失败，使用空列表兜底: outlineId={}", po.getId(), e);
            dto.setSections(List.of());
        }

        return dto;
    }
}