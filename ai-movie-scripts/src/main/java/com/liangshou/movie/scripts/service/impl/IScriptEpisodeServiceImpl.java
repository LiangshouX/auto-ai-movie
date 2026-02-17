package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptEpisodePO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptEpisodeSupport;
import com.liangshou.movie.scripts.service.IScriptEpisodeService;
import com.liangshou.movie.scripts.service.dto.ScriptEpisodeDTO;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 桥段内容业务服务实现类
 */
@Service
@SuppressWarnings("unused")
public class IScriptEpisodeServiceImpl implements IScriptEpisodeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(IScriptEpisodeServiceImpl.class);
    private static final String PROJECT_ID_COLUMN = "project_id";
    private static final String CHAPTER_ID_COLUMN = "chapter_id";
    private static final String EPISODE_NUMBER_COLUMN = "episode_number";
    private static final String EPISODE_TITLE_COLUMN = "episode_title";

    @Resource
    private IScriptEpisodeSupport scriptEpisodeSupport;

    @Override
    public ScriptEpisodeDTO createEpisode(ScriptEpisodeDTO episodeDTO) {
        try {
            // 参数校验
            if (episodeDTO == null) {
                throw new IllegalArgumentException("参数错误");
            }

            if (!StringUtils.hasText(episodeDTO.getProjectId())) {
                throw new IllegalArgumentException("项目ID不能为空");
            }

            if (!StringUtils.hasText(episodeDTO.getChapterId())) {
                throw new IllegalArgumentException("章节ID不能为空");
            }

            if (episodeDTO.getEpisodeNumber() == null) {
                throw new IllegalArgumentException("桥段号不能为空");
            }

            if (StringUtils.hasText(episodeDTO.getEpisodeTitle())) {
                QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
                queryWrapper.eq(PROJECT_ID_COLUMN, episodeDTO.getProjectId());
                queryWrapper.eq(CHAPTER_ID_COLUMN, episodeDTO.getChapterId());
                queryWrapper.eq(EPISODE_TITLE_COLUMN, episodeDTO.getEpisodeTitle());
                queryWrapper.orderByAsc("created_at");
                queryWrapper.last("LIMIT 1");
                ScriptEpisodePO existing = scriptEpisodeSupport.getOne(queryWrapper, false);
                if (existing != null) {
                    return convertToDTO(existing);
                }
            }

            // 转换DTO到PO
            ScriptEpisodePO entity = convertToPO(episodeDTO);
            entity.setCreatedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            // 保存到数据库
            boolean saved = scriptEpisodeSupport.save(entity);
            if (!saved) {
                throw new BizException(ErrorCodeEnum.CHAPTER_CREATE_FAILED);
            }

            // 转换PO到DTO并返回
            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("创建桥段内容时发生错误: {}", episodeDTO);
            throw new BizException(ErrorCodeEnum.CHAPTER_CREATE_FAILED, e);
        }
    }

    @Override
    public ScriptEpisodeDTO findById(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return null;
            }

            ScriptEpisodePO entity = scriptEpisodeSupport.getById(id);
            if (entity == null) {
                return null;
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("根据ID查找桥段内容失败: id={}", id, e);
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

            List<ScriptEpisodePO> entities = scriptEpisodeSupport.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据项目ID查找桥段内容失败: projectId={}", projectId, e);
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

            List<ScriptEpisodePO> entities = scriptEpisodeSupport.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据章节ID查找桥段内容失败: chapterId={}", chapterId, e);
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

            List<ScriptEpisodePO> entities = scriptEpisodeSupport.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("根据项目ID和章节ID查找桥段内容失败: projectId={}, chapterId={}", projectId, chapterId, e);
            return List.of();
        }
    }

    @Override
    public List<ScriptEpisodeDTO> findAll() {
        try {
            QueryWrapper<ScriptEpisodePO> queryWrapper = new QueryWrapper<>();
            queryWrapper.orderByAsc(PROJECT_ID_COLUMN, CHAPTER_ID_COLUMN, EPISODE_NUMBER_COLUMN);

            List<ScriptEpisodePO> entities = scriptEpisodeSupport.list(queryWrapper);
            return entities.stream()
                    .map(this::convertToDTO)
                    .toList();
        } catch (Exception e) {
            LOGGER.error("查询所有桥段内容失败", e);
            return List.of();
        }
    }

    @Override
    public ScriptEpisodeDTO updateEpisode(String id, ScriptEpisodeDTO episodeDTO) {
        try {
            // 参数校验
            if (!StringUtils.hasText(id) || episodeDTO == null) {
                throw new IllegalArgumentException("参数错误");
            }

            // 检查桥段是否存在
            ScriptEpisodePO existingEntity = scriptEpisodeSupport.getById(id);
            if (existingEntity == null) {
                return null;
            }

            // 转换DTO到PO
            ScriptEpisodePO entity = convertToPO(episodeDTO);
            entity.setId(id); // 确保ID不变
            entity.setProjectId(existingEntity.getProjectId()); // 保持原有的项目ID
            entity.setChapterId(existingEntity.getChapterId()); // 保持原有的章节ID
            entity.setCreatedAt(existingEntity.getCreatedAt()); // 保持原有的创建时间
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新数据库
            boolean updated = scriptEpisodeSupport.updateById(entity);
            if (!updated) {
                throw new RuntimeException("桥段更新失败");
            }

            // 返回更新后的数据
            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段内容失败: id={}", id);
            throw new RuntimeException("更新桥段失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteEpisode(String id) {
        try {
            if (!StringUtils.hasText(id)) {
                return;
            }

            // 检查桥段是否存在
            ScriptEpisodePO entity = scriptEpisodeSupport.getById(id);
            if (entity == null) {
                LOGGER.warn("尝试删除不存在的桥段内容: id={}", id);
                return;
            }

            // 删除桥段
            boolean removed = scriptEpisodeSupport.removeById(id);
            if (!removed) {
                throw new RuntimeException("桥段删除失败");
            }

            LOGGER.info("成功删除桥段内容: id={}", id);
        } catch (Exception e) {
            LOGGER.error("删除桥段内容时发生错误: id={}", id, e);
            throw new RuntimeException("删除桥段失败: " + e.getMessage(), e);
        }
    }

    @Override
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
            boolean removed = scriptEpisodeSupport.removeBatchByIds(validIds);
            if (!removed) {
                throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED);
            }

            LOGGER.info("成功批量删除桥段内容: count={}", validIds.size());
        } catch (Exception e) {
            LOGGER.error("批量删除桥段内容时发生错误", e);
            throw new BizException(ErrorCodeEnum.CHAPTER_DELETE_FAILED, e);
        }
    }

    @Override
    public ScriptEpisodeDTO updateEpisodeTitle(String id, String episodeTitle) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("参数错误");
            }

            ScriptEpisodePO entity = scriptEpisodeSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setEpisodeTitle(episodeTitle);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = scriptEpisodeSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED);
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段标题时发生错误: id={}, episodeTitle={}", id, episodeTitle, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED, e);
        }
    }

    @Override
    public ScriptEpisodeDTO updateEpisodeContent(String id, String episodeContent) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("参数错误");
            }

            ScriptEpisodePO entity = scriptEpisodeSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setEpisodeContent(episodeContent);
            entity.setUpdatedAt(LocalDateTime.now());

            // 更新字数统计
            int wordCount = StringUtils.hasText(episodeContent) ? episodeContent.length() : 0;
            entity.setWordCount(wordCount);

            boolean updated = scriptEpisodeSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED);
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新桥段内容时发生错误: id={}", id, e);
            throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED, e);
        }
    }

    @Override
    public ScriptEpisodeDTO updateWordCount(String id, Integer wordCount) {
        try {
            if (!StringUtils.hasText(id)) {
                throw new IllegalArgumentException("参数错误");
            }

            ScriptEpisodePO entity = scriptEpisodeSupport.getById(id);
            if (entity == null) {
                return null;
            }

            entity.setWordCount(wordCount != null ? wordCount : 0);
            entity.setUpdatedAt(LocalDateTime.now());

            boolean updated = scriptEpisodeSupport.updateById(entity);
            if (!updated) {
                throw new BizException(ErrorCodeEnum.CHAPTER_UPDATE_FAILED);
            }

            return convertToDTO(entity);
        } catch (Exception e) {
            LOGGER.error("更新字数统计时发生错误: id={}, wordCount={}", id, wordCount, e);
            throw new RuntimeException("更新字数统计失败: " + e.getMessage(), e);
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
