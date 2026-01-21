package com.liangshou.movie.scripts.infrastructure.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.entity.ContentRevision;
import org.apache.ibatis.annotations.Mapper;

/**
 * 内容修订历史数据访问接口
 */
@Mapper
public interface ContentRevisionMapper extends BaseMapper<ContentRevision> {
}