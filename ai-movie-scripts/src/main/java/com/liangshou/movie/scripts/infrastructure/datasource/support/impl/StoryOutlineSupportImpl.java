package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.po.StoryOutlinePO;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.StoryOutlineMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IStoryOutlineSupport;
import com.liangshou.movie.scripts.service.dto.StoryOutlineDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 故事大纲服务实现类
 */
@Service
public class StoryOutlineSupportImpl extends ServiceImpl<StoryOutlineMapper, StoryOutlinePO> implements IStoryOutlineSupport {

    @Override
    public StoryOutlineDTO createOutline(StoryOutlineDTO outlineDTO) {
        StoryOutlinePO entity = new StoryOutlinePO();
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
        QueryWrapper<StoryOutlinePO> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId);
        StoryOutlinePO entity = this.getOne(queryWrapper);
        
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
        StoryOutlinePO entity = this.getById(id);
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