package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptEpisodeMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptEpisodePO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptEpisodeSupport;
import com.liangshou.movie.scripts.service.dto.ScriptEpisodeDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 桥段内容服务实现类
 */
@Service
@SuppressWarnings("unused")
public class ScriptEpisodeSupportImpl extends ServiceImpl<ScriptEpisodeMapper, ScriptEpisodePO> implements IScriptEpisodeSupport {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScriptEpisodeSupportImpl.class);
    public static final String PROJECT_ID_COLUMN = "project_id";
    public static final String CHAPTER_ID_COLUMN = "chapter_id";
    public static final String EPISODE_NUMBER_COLUMN = "episode_number";

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScriptEpisodeDTO createEpisode(ScriptEpisodeDTO episodeDTO) {
        try {
            // 参数校验
            if (episodeDTO == null) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            if (!StringUtils.hasText(episodeDTO.getProjectId())) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "项目ID不能为空");
            }

            if (!StringUtils.hasText(episodeDTO.getChapterId())) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "章节ID不能为空");
            }

            if (episodeDTO.getEpisodeNumber() == null) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "桥段号不能为空");
            }

            // 转换DTO到PO
            ScriptEpisodePO entity = convertToPO(episodeDTO);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            // 保存到数据库
            boolean saved = this.save(entity);
            if (!saved) {
                throw new BizException(ErrorCodeEnum.CHAPTER_CREATE_FAILED.getCode(), "桥段创建失败");
            }

            // 转换PO到DTO并返回
            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("创建桥段内容时发生未知错误", e);
            throw new BizException(ErrorCodeEnum.CHAPTER_CREATE_FAILED.getCode(), "创建桥段时发生系统错误");
        }
    }

    @Override
    public ScriptEpisodeDTO findById(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return null;
            }

            ScriptEpisodePO entity = this.getById(id);
            if (entity == null) {
                return null;
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("根据ID查找桥段内容失败: id={}", id, e);
            // 兜底处理：返回null而不是抛出异常
            return null;
        }
    }

    @Override
    public List<ScriptEpisodeDTO> findByProjectId(String projectId) {
        try {
            if (!StringUtils.hasText(projectId)) {
                return List.of();
            }

            QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq(PROJECT_ID_COLUMN, projectId);
            queryWrapper.orderByAsc(CHAPTER_ID_COLUMN, EPISODE_NUMBER_COLUMN);

            List<ScriptEpisodePO> entities = this.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据项目ID查找桥段内容失败: projectId={}", projectId, e);
            // 兜底处理：返回空列表而不是抛出异常
            return List.of();
        }
    }

    @Override
    public List<ScriptEpisodeDTO> findByChapterId(String chapterId) {
        try {
            if (!StringUtils.hasText(chapterId)) {
                return List.of();
            }

            QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq(CHAPTER_ID_COLUMN, chapterId);
            queryWrapper.orderByAsc(EPISODE_NUMBER_COLUMN);

            List<ScriptEpisodePO> entities = this.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据章节ID查找桥段内容失败: chapterId={}", chapterId, e);
            // 兜底处理：返回空列表而不是抛出异常
            return List.of();
        }
    }

    @Override
    public List<ScriptEpisodeDTO> findByProjectIdAndChapterId(String projectId, String chapterId) {
        try {
            if (!StringUtils.hasText(projectId) || !StringUtils.hasText(chapterId)) {
                return List.of();
            }

            QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq(PROJECT_ID_COLUMN, projectId);
            queryWrapper.eq(CHAPTER_ID_COLUMN, chapterId);
            queryWrapper.orderByAsc(EPISODE_NUMBER_COLUMN);

            List<ScriptEpisodePO> entities = this.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据项目ID和章节ID查找桥段内容失败: projectId={}, chapterId={}", projectId, chapterId, e);
            // 兜底处理：返回空列表而不是抛出异常
            return List.of();
        }
    }

    @Override
    public List<ScriptEpisodeDTO> findAll() {
        try {
            QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.orderByAsc(PROJECT_ID_COLUMN, CHAPTER_ID_COLUMN, EPISODE_NUMBER_COLUMN);

            List<ScriptEpisodePO> entities = this.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("查询所有桥段内容失败", e);
            // 兜底处理：返回空列表而不是抛出异常
            return List.of();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScriptEpisodeDTO updateEpisode(String id, ScriptEpisodeDTO episodeDTO) {
        try {
            // 参数校验
            if (!StringUtils.hasText(id) || episodeDTO == null) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            // 检查桥段是否存在
            ScriptEpisodePO existingEntity = this.getById(id);
            if (existingEntity == null) {
                throw new BizException(ErrorCodeEnum.CHAPTER_NOT_FOUND.getCode(), "桥段不存在");
            }

            // 转换DTO到PO
            ScriptEpisodePO entity = convertToPO(episodeDTO);
            entity.setId(id); // 确保ID不变
            entity.setProjectId(existingEntity.getProjectId()); // 保持原有的项目ID
            entity.setChapterId(existingEntity.getChapterId()); // 保持原有的章节ID
            entity.setCreatedAt(existingEntity.getCreatedAt()); // 保持原有的创建时间
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新数据库
            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "桥段更新失败");
            }

            // 返回更新后的数据
            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段内容时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新桥段时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteEpisode(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return;
            }

            // 检查桥段是否存在
            if (!this.existsById(id)) {
                LOGGER.warn("尝试删除不存在的桥段内容: id={}", id);
                return;
            }

            // 删除桥段
            boolean removed = this.removeById(id);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED.getCode(), "桥段删除失败");
            }

            LOGGER.info("成功删除桥段内容: id={}", id);
        } catch (Exception e) {
            LOGGER.error("删除桥段内容时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED.getCode(), "删除桥段时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteEpisodes(List<String> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return;
            }

            // 过滤掉无效的ID
            List<String> validIds = ids.stream()
                    .filter(StringUtils::hasText)
                    .toList();

            if (validIds.isEmpty()) {
                return;
            }

            // 批量删除
            boolean removed = this.removeBatchByIds(validIds);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED.getCode(), "批量删除桥段失败");
            }

            LOGGER.info("成功批量删除桥段内容: count={}", validIds.size());
        } catch (Exception e) {
            LOGGER.error("批量删除桥段内容时发生未知错误", e);
            throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED.getCode(), "批量删除桥段时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScriptEpisodeDTO updateEpisodeTitle(String id, String episodeTitle) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            ScriptEpisodePO entity = this.getById(id);
            if (entity == null) {
                throw new BizException(ErrorCodeEnum.CHAPTER_NOT_FOUND.getCode(), "桥段不存在");
            }

            entity.setEpisodeTitle(episodeTitle);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新桥段标题失败");
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段标题时发生未知错误: id={}, episodeTitle={}", id, episodeTitle, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新桥段标题时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScriptEpisodeDTO updateEpisodeContent(String id, String episodeContent) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            ScriptEpisodePO entity = this.getById(id);
            if (entity == null) {
                throw new BizException(ErrorCodeEnum.CHAPTER_NOT_FOUND.getCode(), "桥段不存在");
            }

            entity.setEpisodeContent(episodeContent);
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新字数统计
            int wordCount = StringUtils.hasText(episodeContent) ? episodeContent.length() : 0;
            entity.setWordCount(wordCount);

            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新桥段内容失败");
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段内容时发生未知错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新桥段内容时发生系统错误");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScriptEpisodeDTO updateWordCount(String id, Integer wordCount) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new BizException(ErrorCodeEnum.PARAMETER_ERROR.getCode(), "参数错误");
            }

            ScriptEpisodePO entity = this.getById(id);
            if (entity == null) {
                throw new BizException(ErrorCodeEnum.CHAPTER_NOT_FOUND.getCode(), "桥段不存在");
            }

            entity.setWordCount(wordCount != null ? wordCount : 0);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = this.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新字数统计失败");
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新字数统计时发生未知错误: id={}, wordCount={}", id, wordCount, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED.getCode(), "更新字数统计时发生系统错误");
        }
    }

    /**
     * 检查桥段是否存在
     */
    private boolean existsById(String id) {
        try {
            return this.getById(id) != null;
        } catch (Exception e) {
            LOGGER.error("检查桥段是否存在时发生错误: id={}", id, e);
            return false;
        }
    }

    /**
     * 将DTO转换为PO
     */
    private ScriptEpisodePO convertToPO(ScriptEpisodeDTO dto) {
        if (dto == null) {
            return null;
        }

        ScriptEpisodePO po = new ScriptEpisodePO();
        BeanUtils.copyProperties(dto, po);
        return po;
    }

    /**
     * 将PO转换为DTO
     */
    private ScriptEpisodeDTO convertToDTO(ScriptEpisodePO po) {
        if (po == null) {
            return null;
        }

        ScriptEpisodeDTO dto = new ScriptEpisodeDTO();
        BeanUtils.copyProperties(po, dto);
        return dto;
    }
}