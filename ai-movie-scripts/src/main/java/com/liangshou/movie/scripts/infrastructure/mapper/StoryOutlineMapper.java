package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.StoryOutline;
import org.apache.ibatis.annotations.Mapper;

/**
 * 故事大纲数据访问接口
 */
@Mapper
public interface StoryOutlineMapper extends BaseMapper<StoryOutline> {
}