package com.liangshou.movie.scripts.infrastructure.datasource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.StoryOutlinePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 故事大纲数据访问接口
 */
@Mapper
public interface StoryOutlineMapper extends BaseMapper<StoryOutlinePO> {
}