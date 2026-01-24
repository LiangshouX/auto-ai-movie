package com.liangshou.movie.scripts.infrastructure.datasource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptChapterPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 剧本章节数据访问接口
 */
@Mapper
public interface ScriptChapterMapper extends BaseMapper<ScriptChapterPO> {
}