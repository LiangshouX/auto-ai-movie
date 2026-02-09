package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.StoryOutlineMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.StoryOutlinePO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IStoryOutlineSupport;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("unused")
public class IStoryOutlineSupportImpl extends ServiceImpl<StoryOutlineMapper, StoryOutlinePO> implements IStoryOutlineSupport {
}
