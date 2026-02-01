// 剧本大纲工具函数

import type {
  StoryOutlineDTO,
  OutlineSectionDTO,
  CreateStoryOutlineData,
  StructureType, OutlineChapterDTO, OutlineEpisodeDTO
} from '@/api/types/scripts-outline-types';

// 结构类型模板定义
export const STRUCTURE_TEMPLATES = {
  // 起承转合结构
  BEGINNING_RISING_ACTION_CLIMAX_END: [
    {
      sectionTitle: '开始',
      description: '故事的开端，介绍主要角色和背景设定',
      sequence: 1
    },
    {
      sectionTitle: '发展',
      description: '故事继续发展，冲突逐渐显现',
      sequence: 2
    },
    {
      sectionTitle: '高潮',
      description: '故事达到最高潮，主要冲突爆发',
      sequence: 3
    },
    {
      sectionTitle: '结局',
      description: '故事收尾，矛盾得到解决',
      sequence: 4
    }
  ],
  
  // 引起承转合结构
  HOOK_RISE_CONTINUATION_TURN_CONCLUSION: [
    {
      sectionTitle: '引子',
      description: '吸引读者注意，设置故事基调',
      sequence: 1
    },
    {
      sectionTitle: '递进',
      description: '情节逐步推进，紧张感增强',
      sequence: 2
    },
    {
      sectionTitle: '延续',
      description: '故事线持续发展，深化主题',
      sequence: 3
    },
    {
      sectionTitle: '转折',
      description: '关键转折点，改变故事走向',
      sequence: 4
    },
    {
      sectionTitle: '结局',
      description: '故事最终结局，呼应开头',
      sequence: 5
    }
  ]
} as const;

// 生成章节ID
export const generateChapterId = (sectionId: string): string => {
  // 使用sectionId的后8位+时间戳生成
  const sectionSuffix = sectionId.slice(-8);
  return `${sectionSuffix}_${Date.now()}`;
};

// 创建默认章节对象
export const createDefaultChapter = (sectionId: string): OutlineChapterDTO => {
  return {
    chapterId: generateChapterId(sectionId),
    chapterTitle: '新章节',
    chapterSummary: '章节简介',
    chapterNumber: 1,
    episodeCount: 0,
    wordCount: 0,
    episodes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 创建默认桥段对象
export const createDefaultEpisode = (projectId: string, chapterId: string): OutlineEpisodeDTO => {
  return {
    episodeId: '', // 后端生成
    projectId,
    chapterId,
    episodeTitle: '新桥段',
    episodeNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 创建默认大纲结构
export const createDefaultOutlineStructure = (
  projectId: string,
  structureType: StructureType
): CreateStoryOutlineData => {
  const template = STRUCTURE_TEMPLATES[structureType];
  
  const sections: OutlineSectionDTO[] = template.map((sectionTemplate, index) => ({
    sectionId: `section_${Date.now()}_${index}`,
    sectionTitle: sectionTemplate.sectionTitle,
    description: sectionTemplate.description,
    sequence: sectionTemplate.sequence,
    chapterCount: 0,
    chapters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  return {
    projectId,
    structureType,
    sections
  };
};

// 重新计算章节和桥段编号
export const recalculateNumbers = (outline: StoryOutlineDTO): StoryOutlineDTO => {
  const updatedSections = [...outline.sections].sort((a, b) => a.sequence - b.sequence);
  
  updatedSections.forEach((section, sectionIndex) => {
    section.sequence = sectionIndex + 1;
    section.chapterCount = section.chapters.length;
    
    const sortedChapters = [...section.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
    sortedChapters.forEach((chapter, chapterIndex) => {
      chapter.chapterNumber = chapterIndex + 1;
      chapter.episodeCount = chapter.episodes.length;
      
      const sortedEpisodes = [...chapter.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);
      sortedEpisodes.forEach((episode, episodeIndex) => {
        episode.episodeNumber = episodeIndex + 1;
      });
      
      chapter.episodes = sortedEpisodes;
    });
    
    section.chapters = sortedChapters;
  });

  return {
    ...outline,
    sections: updatedSections,
    updatedAt: new Date().toISOString()
  };
};

// 根据拖拽结果更新大纲结构
export const updateOutlineFromDrag = (
  outline: StoryOutlineDTO,
  dragInfo: {
    dragNode: any;
    dropNode: any;
    dropPosition: number;
    dropToGap: boolean;
  }
): StoryOutlineDTO => {
  // 这里实现具体的拖拽逻辑
  // 需要解析拖拽信息，重新排列节点顺序，并更新相应的编号
  console.log('拖拽信息:', dragInfo);
  
  // TODO: 实现完整的拖拽逻辑
  return outline;
};

// 计算总字数
export const calculateTotalWordCount = (outline: StoryOutlineDTO): number => {
  return outline.sections.reduce((total, section) => {
    return total + section.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.wordCount;
    }, 0);
  }, 0);
};

// 计算总桥段数
export const calculateTotalEpisodeCount = (outline: StoryOutlineDTO): number => {
  return outline.sections.reduce((total, section) => {
    return total + section.chapters.reduce((chapterTotal, chapter) => {
      return chapterTotal + chapter.episodeCount;
    }, 0);
  }, 0);
};

// 获取结构类型描述
export const getStructureTypeDescription = (structureType: StructureType): string => {
  const descriptions: Record<StructureType, string> = {
    BEGINNING_RISING_ACTION_CLIMAX_END: '起承转合结构',
    HOOK_RISE_CONTINUATION_TURN_CONCLUSION: '引起承转合结构'
  };
  return descriptions[structureType];
};

// 验证大纲数据完整性
export const validateOutline = (outline: StoryOutlineDTO): boolean => {
  if (!outline.projectId || !outline.structureType) {
    return false;
  }
  
  // 验证章节结构
  for (const section of outline.sections) {
    if (!section.sectionId || !section.sectionTitle) {
      return false;
    }
    
    // 验证章节
    for (const chapter of section.chapters) {
      if (!chapter.chapterId || !chapter.chapterTitle) {
        return false;
      }
      
      // 验证桥段（episodeId可以为空）
      for (const episode of chapter.episodes) {
        if (!episode.episodeTitle) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// 生成大纲文本内容（用于阅读模式）
export const generateOutlineText = (outline: StoryOutlineDTO): string => {
  let content = `剧本大纲：${outline.projectId}\n`;
  content += `结构类型：${getStructureTypeDescription(outline.structureType as StructureType)}\n`;
  content += `创建时间：${new Date(outline.createdAt).toLocaleString()}\n`;
  content += `更新时间：${new Date(outline.updatedAt).toLocaleString()}\n\n`;
  
  content += '='.repeat(50) + '\n\n';
  
  outline.sections.forEach((section, sectionIndex) => {
    content += `${sectionIndex + 1}. ${section.sectionTitle}\n`;
    content += `   ${section.description}\n`;
    content += `   章节数：${section.chapterCount}\n\n`;
    
    section.chapters.forEach((chapter, chapterIndex) => {
      content += `   ${chapterIndex + 1}.${chapter.chapterNumber} ${chapter.chapterTitle}\n`;
      content += `      ${chapter.chapterSummary}\n`;
      content += `      桥段数：${chapter.episodeCount} | 字数：${chapter.wordCount}\n\n`;
      
      chapter.episodes.forEach((episode, episodeIndex) => {
        content += `      ${episodeIndex + 1}.${episode.episodeNumber} ${episode.episodeTitle}\n`;
      });
      
      content += '\n';
    });
    
    content += '\n';
  });
  
  return content;
};