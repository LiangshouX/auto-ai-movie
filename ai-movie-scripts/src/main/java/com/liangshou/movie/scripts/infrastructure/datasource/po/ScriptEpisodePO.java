package com.liangshou.movie.scripts.infrastructure.datasource.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 桥段内容实体
 * 表名: scripts_episodes
 * 索引: idx_project_id(project_id), idx_chapter_id(chapter_id), idx_episode_number(episode_number)
 */
@Data
@TableName("scripts_episodes")
public class ScriptEpisodePO {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 关联项目ID
     */
    @TableField("project_id")
    private String projectId;

    /**
     * 所属章节ID
     */
    @TableField("chapter_id")
    private String chapterId;

    /**
     * 桥段号，标识episode在chapter的第几桥段
     */
    @TableField("episode_number")
    private Integer episodeNumber;

    /**
     * 桥段标题
     */
    @TableField("episode_title")
    private String episodeTitle;

    /**
     * 桥段内容
     */
    @TableField("episode_content")
    private String episodeContent;

    /**
     * 字数统计
     */
    @TableField("word_count")
    private Integer wordCount;

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