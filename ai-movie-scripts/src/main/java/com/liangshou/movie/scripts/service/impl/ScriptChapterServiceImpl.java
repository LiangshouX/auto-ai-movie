package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.entity.ScriptChapter;
import com.liangshou.movie.scripts.infrastructure.mapper.ScriptChapterMapper;
import com.liangshou.movie.scripts.service.IScriptChapterService;
import com.liangshou.movie.scripts.service.dto.ScriptChapterDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 剧本章节服务实现类
 */
@Service
public class ScriptChapterServiceImpl extends ServiceImpl<ScriptChapterMapper, ScriptChapter> implements IScriptChapterService {

    @Override
    public ScriptChapterDTO createChapter(ScriptChapterDTO chapterDTO) {
        ScriptChapter entity = new ScriptChapter();
        BeanUtils.copyProperties(chapterDTO, entity);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        this.save(entity);

        ScriptChapterDTO result = new ScriptChapterDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public ScriptChapterDTO findById(String id) {
        ScriptChapter entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptChapterDTO dto = new ScriptChapterDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public List<ScriptChapterDTO> findByProjectId(String projectId) {
        QueryWrapper<ScriptChapter> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        List<ScriptChapter> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptChapterDTO dto = new ScriptChapterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ScriptChapterDTO> findByProjectIdAndChapterNumber(String projectId, Integer chapterNumber) {
        QueryWrapper<ScriptChapter> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        if (chapterNumber != null) {
            queryWrapper.eq("chapter_number", chapterNumber);
        }
        List<ScriptChapter> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptChapterDTO dto = new ScriptChapterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ScriptChapterDTO updateChapter(String id, ScriptChapterDTO chapterDTO) {
        ScriptChapter entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        BeanUtils.copyProperties(chapterDTO, entity);
        entity.setId(id); // 确保ID不变
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        ScriptChapterDTO result = new ScriptChapterDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public void deleteChapter(String id) {
        this.removeById(id);
    }
}