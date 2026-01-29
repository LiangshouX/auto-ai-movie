package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 剧本项目实体
 * 表名: script_projects
 * 索引: idx_author_id(author_id), idx_status(status), idx_created_at(created_at)
 */
@Data
@TableName("script_projects")
public class ScriptProjectPO {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    /**
     * 剧本标题
     */
    @TableField("title")
    private String title;
    
    /**
     * 剧本描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 主题背景
     */
    @TableField("theme")
    private String theme;
    
    /**
     * 剧情梗概
     */
    @TableField("summary")
    private String summary;
    
    /**
     * 项目状态，默认'CREATED'
     */
    @TableField("status")
    private String status;
    
    /**
     * 作者ID
     */
    @TableField("author_id")
    private String authorId;
    
    /**
     * 创建时间
     */
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField("updated_at")
    private LocalDateTime updatedAt;
}