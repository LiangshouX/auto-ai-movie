package com.liangshou.movie.scripts.infrastructure.datasource.support.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.liangshou.movie.scripts.infrastructure.datasource.mapper.ScriptCharacterMapper;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;
import com.liangshou.movie.scripts.infrastructure.datasource.support.IScriptCharacterSupport;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("unused")
public class IScriptCharacterSupportImpl extends ServiceImpl<ScriptCharacterMapper, ScriptCharacterPO> implements IScriptCharacterSupport {
}
