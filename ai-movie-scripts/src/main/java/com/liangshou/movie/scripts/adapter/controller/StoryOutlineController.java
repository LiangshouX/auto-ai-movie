package com.liangshou.movie.scripts.adapter.controller;

import com.liangshou.movie.scripts.common.enums.ErrorCodeEnum;
import com.liangshou.movie.scripts.common.exceptions.BizException;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IStoryOutlineSupport;
import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import com.liangshou.movie.scripts.service.dto.outline.OutlineSectionDTO;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 故事大纲控制器
 */
@RestController
@RequestMapping("/api/v1/outlines")
@SuppressWarnings("unused")
public class StoryOutlineController {

    private static final Logger logger = LoggerFactory.getLogger(StoryOutlineController.class);

    @Resource
    private IStoryOutlineSupport storyOutlineService;

    /**
     * 创建故事大纲
     */
    @PostMapping
    public ResponseEntity<StoryOutlineDTO> createOutline(@RequestBody StoryOutlineDTO outlineDTO) {
        logger.info("开始创建故事大纲, projectId={}", outlineDTO.getProjectId());
        
        // 参数校验
        if (outlineDTO == null) {
            logger.warn("创建故事大纲失败: 请求体为空");
            throw new BizException(ErrorCodeEnum.PARAMETER_ERROR);
        }
        
        if (!StringUtils.hasText(outlineDTO.getProjectId())) {
            logger.warn("创建故事大纲失败: 项目ID不能为空");
            throw new BizException("项目ID不能为空");
        }

        try {
            StoryOutlineDTO createdOutline = storyOutlineService.createOutline(outlineDTO);
            logger.info("故事大纲创建成功, id={}", createdOutline.getId());
            return ResponseEntity.ok(createdOutline);
        } catch (BizException e) {
            logger.error("创建故事大纲业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("创建故事大纲系统异常", e);
            throw new BizException("创建故事大纲失败");
        }
    }

    /**
     * 根据ID获取故事大纲
     */
    @GetMapping("/{id}")
    public ResponseEntity<StoryOutlineDTO> getOutlineById(@PathVariable("id") String id) {
        logger.info("开始根据ID获取故事大纲, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("获取故事大纲失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            StoryOutlineDTO outline = storyOutlineService.findById(id);
            if (outline != null) {
                logger.info("故事大纲获取成功, id={}", id);
                return ResponseEntity.ok(outline);
            } else {
                logger.warn("故事大纲不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("获取故事大纲异常, id={}", id, e);
            throw new BizException("获取故事大纲失败");
        }
    }

    /**
     * 根据项目ID获取故事大纲
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<StoryOutlineDTO> getOutlineByProjectId(@PathVariable("projectId") String projectId) {
        logger.info("开始根据项目ID获取故事大纲, projectId={}", projectId);
        
        if (!StringUtils.hasText(projectId)) {
            logger.warn("获取故事大纲失败: 项目ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            StoryOutlineDTO outline = storyOutlineService.findByProjectId(projectId);
            if (outline != null) {
                logger.info("根据项目ID获取故事大纲成功, projectId={}", projectId);
                return ResponseEntity.ok(outline);
            } else {
                logger.warn("故事大纲不存在, projectId={}", projectId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("根据项目ID获取故事大纲异常, projectId={}", projectId, e);
            throw new BizException("获取故事大纲失败");
        }
    }

    /**
     * 获取所有故事大纲
     */
    @GetMapping
    public ResponseEntity<List<StoryOutlineDTO>> getAllOutlines() {
        logger.info("开始获取所有故事大纲");
        
        try {
            List<StoryOutlineDTO> outlines = storyOutlineService.findAll();
            logger.info("获取所有故事大纲成功, 数量={}", outlines.size());
            return ResponseEntity.ok(outlines);
        } catch (Exception e) {
            logger.error("获取所有故事大纲异常", e);
            throw new BizException("获取故事大纲失败");
        }
    }

    /**
     * 更新故事大纲
     */
    @PutMapping("/{id}")
    public ResponseEntity<StoryOutlineDTO> updateOutline(
            @PathVariable("id") String id,
            @RequestBody StoryOutlineDTO outlineDTO) {
        logger.info("开始更新故事大纲, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新故事大纲失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        if (outlineDTO == null) {
            logger.warn("更新故事大纲失败: 请求体为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            StoryOutlineDTO updatedOutline = storyOutlineService.updateOutline(id, outlineDTO);
            if (updatedOutline != null) {
                logger.info("故事大纲更新成功, id={}", id);
                return ResponseEntity.ok(updatedOutline);
            } else {
                logger.warn("故事大纲不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新故事大纲业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新故事大纲系统异常, id={}", id, e);
            throw new BizException("更新故事大纲失败");
        }
    }

    /**
     * 删除故事大纲
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutline(@PathVariable("id") String id) {
        logger.info("开始删除故事大纲, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("删除故事大纲失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            storyOutlineService.deleteOutline(id);
            logger.info("故事大纲删除成功, id={}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("删除故事大纲异常, id={}", id, e);
            throw new BizException("删除故事大纲失败");
        }
    }

    /**
     * 更新大纲结构类型
     */
    @PatchMapping("/{id}/structure-type")
    public ResponseEntity<StoryOutlineDTO> updateStructureType(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> requestBody) {
        logger.info("开始更新大纲结构类型, id={}", id);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新大纲结构类型失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        String structureType = requestBody.get("structureType");
        if (!StringUtils.hasText(structureType)) {
            logger.warn("更新大纲结构类型失败: 结构类型不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            StoryOutlineDTO updatedOutline = storyOutlineService.updateStructureType(id, structureType);
            if (updatedOutline != null) {
                logger.info("大纲结构类型更新成功, id={}", id);
                return ResponseEntity.ok(updatedOutline);
            } else {
                logger.warn("故事大纲不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新大纲结构类型业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新大纲结构类型系统异常, id={}", id, e);
            throw new BizException("更新大纲结构类型失败");
        }
    }

    /**
     * 更新大纲章节结构
     */
    @PatchMapping("/{id}/sections")
    public ResponseEntity<StoryOutlineDTO> updateSections(
            @PathVariable("id") String id,
            @RequestBody List<OutlineSectionDTO> sections) {
        logger.info("开始更新大纲章节结构, id={}, 章节数量={}", id, sections != null ? sections.size() : 0);
        
        if (!StringUtils.hasText(id)) {
            logger.warn("更新大纲章节结构失败: ID不能为空");
            return ResponseEntity.badRequest().build();
        }
        
        if (sections == null) {
            logger.warn("更新大纲章节结构失败: 章节结构不能为空");
            return ResponseEntity.badRequest().build();
        }

        try {
            StoryOutlineDTO updatedOutline = storyOutlineService.updateSections(id, sections);
            if (updatedOutline != null) {
                logger.info("大纲章节结构更新成功, id={}", id);
                return ResponseEntity.ok(updatedOutline);
            } else {
                logger.warn("故事大纲不存在, id={}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (BizException e) {
            logger.error("更新大纲章节结构业务异常: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("更新大纲章节结构系统异常, id={}", id, e);
            throw new BizException("更新大纲章节结构失败");
        }
    }
}