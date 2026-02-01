package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptEpisodeSupport;
import com.liangshou.movie.scripts.service.dto.ScriptEpisodeDTO;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 桥段内容控制器
 */
@RestController
@RequestMapping("/api/v1/episodes")
@SuppressWarnings("unused")
public class ScriptEpisodeController {

    private static final Logger logger = LoggerFactory.getLogger(ScriptEpisodeController.class);

    @Resource
    private IScriptEpisodeSupport scriptEpisodeService;

    /**
     * 创建桥段内容
     */
    @PostMapping
    public ResponseEntity<ScriptEpisodeDTO> createEpisode(@RequestBody ScriptEpisodeDTO episodeDTO) {
        logger.info("开始创建桥段内容, projectId={}, chapterId={}", 
                   episodeDTO.getProjectId(), episodeDTO.getChapterId());
        
        // 参数校验
        if (episodeDTO == null) {
            logger.warn("创建桥段内容失败: 请求体为空");
            throw new BizException(ErrorCodeEnum.PARAMETER_ERROR);
        }
        
        if (!StringUtils.hasText(episodeDTO.getProjectId())) {
            logger.warn("创建桥段内容失败: 项目ID不能为空");
            throw new BizException("项目ID不能为空");
        }
        
        if (!StringUtils.hasText(episodeDTO.getChapterId())) {
            logger.warn("创建桥段内容失败: 章节ID不能为空");
            throw new BizException("章节ID不能为空");
        }
        
        if (episodeDTO.getEpisodeNumber() == null) {
            logger.warn("创建桥段内容失败: 桥段号不能为空");
            throw new BizException("桥段号不能为空");
        }

        try {
            ScriptEpisodeDTO createdEpisode = scriptEpisodeService.createEpisode(episodeDTO);
            logger.info("桥段内容创建成功, id={}", createdEpisode.getId());
            return ResponseEntity.ok(createdEpisode);
        } catch (BizException e) {
            logger.error("创建桥段内容业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("创建桥段内容系统异常", e);
            throw new BizException("创建桥段内容失败");
        }
    }

    /**
     * 根据ID获取桥段内容
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScriptEpisodeDTO> getEpisodeById(@PathVariable("id") String id) {
        logger.info("开始根据ID获取桥段内容, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("获取桥段内容失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            ScriptEpisodeDTO episode = scriptEpisodeService.findById(id);
            if (episode != null) {
                logger.info("桥段内容获取成功, id={}", id);
                return ResponseEntity.ok(episode);
            } else {
                logger.warn("桥段内容不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("获取桥段内容异常, id={}", id, e);
            throw new BizException("获取桥段内容失败");
        }
    }

    /**
     * 根据项目ID获取所有桥段内容
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ScriptEpisodeDTO>> getEpisodesByProjectId(@PathVariable("projectId") String projectId) {
        logger.info("开始根据项目ID获取桥段内容, projectId={}", projectId);
        
        if (!StringUtils.hasText(projectId)) {
            logger.warn("获取桥段内容失败: 项目ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<ScriptEpisodeDTO> episodes = scriptEpisodeService.findByProjectId(projectId);
            logger.info("根据项目ID获取桥段内容成功, projectId={}, 数量={}", projectId, episodes.size());
            return ResponseEntity.ok(episodes);
        } catch (Exception e) {
            logger.error("根据项目ID获取桥段内容异常, projectId={}", projectId, e);
            throw new BizException("获取桥段内容失败");
        }
    }

    /**
     * 根据章节ID获取所有桥段内容
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<ScriptEpisodeDTO>> getEpisodesByChapterId(@PathVariable("chapterId") String chapterId) {
        logger.info("开始根据章节ID获取桥段内容, chapterId={}", chapterId);
        
        if (!StringUtils.hasText(chapterId)) {
            logger.warn("获取桥段内容失败: 章节ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<ScriptEpisodeDTO> episodes = scriptEpisodeService.findByChapterId(chapterId);
            logger.info("根据章节ID获取桥段内容成功, chapterId={}, 数量={}", chapterId, episodes.size());
            return ResponseEntity.ok(episodes);
        } catch (Exception e) {
            logger.error("根据章节ID获取桥段内容异常, chapterId={}", chapterId, e);
            throw new BizException("获取桥段内容失败");
        }
    }

    /**
     * 根据项目ID和章节ID获取桥段内容
     */
    @GetMapping("/project/{projectId}/chapter/{chapterId}")
    public ResponseEntity<List<ScriptEpisodeDTO>> getEpisodesByProjectAndChapter(
            @PathVariable("projectId") String projectId,
            @PathVariable("chapterId") String chapterId) {
        logger.info("开始根据项目ID和章节ID获取桥段内容, projectId={}, chapterId={}", projectId, chapterId);
        
        if (!StringUtils.hasText(projectId) || !StringUtils.hasText(chapterId)) {
            logger.warn("获取桥段内容失败: 项目ID和章节ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<ScriptEpisodeDTO> episodes = scriptEpisodeService.findByProjectIdAndChapterId(projectId, chapterId);
            logger.info("根据项目ID和章节ID获取桥段内容成功, projectId={}, chapterId={}, 数量={}", 
                       projectId, chapterId, episodes.size());
            return ResponseEntity.ok(episodes);
        } catch (Exception e) {
            logger.error("根据项目ID和章节ID获取桥段内容异常, projectId={}, chapterId={}", projectId, chapterId, e);
            throw new BizException("获取桥段内容失败");
        }
    }

    /**
     * 获取所有桥段内容
     */
    @GetMapping
    public ResponseEntity<List<ScriptEpisodeDTO>> getAllEpisodes() {
        logger.info("开始获取所有桥段内容");
        
        try {
            List<ScriptEpisodeDTO> episodes = scriptEpisodeService.findAll();
            logger.info("获取所有桥段内容成功, 数量={}", episodes.size());
            return ResponseEntity.ok(episodes);
        } catch (Exception e) {
            logger.error("获取所有桥段内容异常", e);
            throw new BizException("获取桥段内容失败");
        }
    }

    /**
     * 更新桥段内容
     */
    @PutMapping("/{id}")
    public ResponseEntity<ScriptEpisodeDTO> updateEpisode(
            @PathVariable("id") String id,
            @RequestBody ScriptEpisodeDTO episodeDTO) {
        logger.info("开始更新桥段内容, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新桥段内容失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        if (episodeDTO == null) {
            logger.warn("更新桥段内容失败: 请求体为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            ScriptEpisodeDTO updatedEpisode = scriptEpisodeService.updateEpisode(id, episodeDTO);
            if (updatedEpisode != null) {
                logger.info("桥段内容更新成功, id={}", id);
                return ResponseEntity.ok(updatedEpisode);
            } else {
                logger.warn("桥段内容不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新桥段内容业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新桥段内容系统异常, id={}", id, e);
            throw new BizException("更新桥段内容失败");
        }
    }

    /**
     * 删除桥段内容
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable("id") String id) {
        logger.info("开始删除桥段内容, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("删除桥段内容失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            scriptEpisodeService.deleteEpisode(id);
            logger.info("桥段内容删除成功, id={}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("删除桥段内容异常, id={}", id, e);
            throw new BizException("删除桥段内容失败");
        }
    }

    /**
     * 批量删除桥段内容
     */
    @DeleteMapping("/batch")
    public ResponseEntity<Void> batchDeleteEpisodes(@RequestBody List<String> ids) {
        logger.info("开始批量删除桥段内容, 数量={}", ids != null ? ids.size() : 0);
        
        if (ids == null || ids.isEmpty()) {
            logger.warn("批量删除桥段内容失败: ID列表不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            scriptEpisodeService.batchDeleteEpisodes(ids);
            logger.info("批量删除桥段内容成功, 数量={}", ids.size());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("批量删除桥段内容异常, 数量={}", ids.size(), e);
            throw new BizException("批量删除桥段内容失败");
        }
    }

    /**
     * 更新桥段标题
     */
    @PatchMapping("/{id}/title")
    public ResponseEntity<ScriptEpisodeDTO> updateEpisodeTitle(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> requestBody) {
        logger.info("开始更新桥段标题, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新桥段标题失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        String episodeTitle = requestBody.get("episodeTitle");
        if (!StringUtils.hasText(episodeTitle)) {
            logger.warn("更新桥段标题失败: 桥段标题不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            ScriptEpisodeDTO updatedEpisode = scriptEpisodeService.updateEpisodeTitle(id, episodeTitle);
            if (updatedEpisode != null) {
                logger.info("桥段标题更新成功, id={}", id);
                return ResponseEntity.ok(updatedEpisode);
            } else {
                logger.warn("桥段内容不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新桥段标题业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新桥段标题系统异常, id={}", id, e);
            throw new BizException("更新桥段标题失败");
        }
    }

    /**
     * 更新桥段内容
     */
    @PatchMapping("/{id}/content")
    public ResponseEntity<ScriptEpisodeDTO> updateEpisodeContent(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> requestBody) {
        logger.info("开始更新桥段内容文本, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新桥段内容文本失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        String episodeContent = requestBody.get("episodeContent");
        if (episodeContent == null) {
            logger.warn("更新桥段内容文本失败: 桥段内容不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            ScriptEpisodeDTO updatedEpisode = scriptEpisodeService.updateEpisodeContent(id, episodeContent);
            if (updatedEpisode != null) {
                logger.info("桥段内容文本更新成功, id={}", id);
                return ResponseEntity.ok(updatedEpisode);
            } else {
                logger.warn("桥段内容不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新桥段内容文本业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新桥段内容文本系统异常, id={}", id, e);
            throw new BizException("更新桥段内容文本失败");
        }
    }

    /**
     * 更新字数统计
     */
    @PatchMapping("/{id}/word-count")
    public ResponseEntity<ScriptEpisodeDTO> updateWordCount(
            @PathVariable("id") String id,
            @RequestBody Map<String, Integer> requestBody) {
        logger.info("开始更新字数统计, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新字数统计失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        Integer wordCount = requestBody.get("wordCount");
        if (wordCount == null) {
            logger.warn("更新字数统计失败: 字数不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            ScriptEpisodeDTO updatedEpisode = scriptEpisodeService.updateWordCount(id, wordCount);
            if (updatedEpisode != null) {
                logger.info("字数统计更新成功, id={}", id);
                return ResponseEntity.ok(updatedEpisode);
            } else {
                logger.warn("桥段内容不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新字数统业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新字数统系统异常, id={}", id, e);
            throw new BizException("更新字数统计失败");
        }
    }
}