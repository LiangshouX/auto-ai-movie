package com.liangshou.movie.scripts.infrastructure.datasource.support;

import com.baomidou.mybatisplus.extension.service.IService;
import com.liangshou.movie.scripts.infrastructure.datasource.po.ScriptCharacterPO;

/**
 * 角色信息数据操作接口 - 只保留MyBatis Plus原生方法
 */
public interface IScriptCharacterSupport extends IService<ScriptCharacterPO> {
    // 仅继承MyBatis Plus的IService接口方法
    // 不包含任何业务逻辑方法
}