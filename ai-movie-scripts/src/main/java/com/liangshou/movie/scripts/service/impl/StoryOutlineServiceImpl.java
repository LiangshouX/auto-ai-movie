package com.liangshou.movie.scripts.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.entity.StoryOutline;
import com.liangshou.movie.scripts.infrastructure.mapper.StoryOutlineMapper;
import com.liangshou.movie.scripts.service.IStoryOutlineService;
import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 故事大纲服务实现类
 */
@Service
public class StoryOutlineServiceImpl extends ServiceImpl<StoryOutlineMapper, StoryOutline> implements IStoryOutlineService {

    @Override
    public StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO) {
        StoryOutline entity = new StoryOutline();
        BeanUtils.copyProperties(outlineDTO, entity);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        this.save(entity);

        StoryOutlineDTO result = new StoryOutlineDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public Optional<StoryOutlineDTO> findByProjectId(String projectId) {
        QueryWrapper<StoryOutline> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        StoryOutline entity = this.getOne(queryWrapper);
        
        if (entity != null) {
            StoryOutlineDTO dto = new StoryOutlineDTO();
            BeanUtils.copyProperties(entity, dto);
            return Optional.of(dto);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public StoryOutlineDTO updateOutline(String id, StoryOutlineDTO outlineDTO) {
        StoryOutline entity = this.getById(id);
        if (entity == null) {
            return null;
        }

        BeanUtils.copyProperties(outlineDTO, entity);
        entity.setId(id); // 确保ID不变
        entity.setUpdatedAt(LocalDateTime.now());
        this.updateById(entity);

        StoryOutlineDTO result = new StoryOutlineDTO();
        BeanUtils.copyProperties(entity, result);
        return result;
    }

    @Override
    public void deleteOutline(String id) {
        this.removeById(id);
    }
}