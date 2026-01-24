package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptChapterPO;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptChapterMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptChapterSupport;
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
public class ScriptChapterSupportImpl extends ServiceImpl<ScriptChapterMapper, ScriptChapterPO> implements IScriptChapterSupport {

    @Override
    public ScriptChapterDTO createChapter(ScriptChapterDTO chapterDTO) {
        ScriptChapterPO entity = new ScriptChapterPO();
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
        ScriptChapterPO entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        ScriptChapterDTO dto = new ScriptChapterDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    @Override
    public List<ScriptChapterDTO> findByProjectId(String projectId) {
        QueryWrapper<ScriptChapterPO> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        List<ScriptChapterPO> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptChapterDTO dto = new ScriptChapterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ScriptChapterDTO> findByProjectIdAndChapterNumber(String projectId, Integer chapterNumber) {
        QueryWrapper<ScriptChapterPO> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        if (chapterNumber != null) {
            queryWrapper.eq("chapter_number", chapterNumber);
        }
        List<ScriptChapterPO> entities = this.list(queryWrapper);
        
        return entities.stream().map(entity -> {
            ScriptChapterDTO dto = new ScriptChapterDTO();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ScriptChapterDTO updateChapter(String id, ScriptChapterDTO chapterDTO) {
        ScriptChapterPO entity = this.getById(id);
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