package com.liangshou.movie.scripts.infrastructure.datasource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptEpisodePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 桥段内容数据访问接口
 */
@Mapper
public interface ScriptEpisodeMapper extends BaseMapper<ScriptEpisodePO> {
}