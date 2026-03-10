import { useCallback, useState } from 'react';
import { message } from 'antd';
import { scriptsOutlineApi } from '@/api/service/scripts-outline';
import { scriptsEpisodeApi } from '@/api/service/scripts-episode';
import type {
  OutlineEpisodeDTO,
  StoryOutlineDTO,
  StructureType,
} from '@/api/types/scripts-outline-types';
import type { ScriptEpisodeDTO } from '@/api/types/scripts-episode-types';
import {
  createClientNodeId,
  createDefaultOutlineStructure,
  recalculateNumbers,
} from '../utils/outline-utils';

export const useScriptOutline = (projectId: string | undefined) => {
  const [outline, setOutline] = useState<StoryOutlineDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // 获取大纲数据
  const fetchOutline = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const response = await scriptsOutlineApi.getOutlineByProject({ projectId });
      if (response.success && response.data) {
        setOutline(response.data as StoryOutlineDTO);
      } else {
        setOutline(null);
      }
    } catch (error) {
      console.error('获取大纲失败:', error);
      message.error('获取大纲数据失败');
      setOutline(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 创建大纲
  const createOutline = async (structureType: StructureType) => {
    if (!projectId) return;

    setCreating(true);
    try {
      const outlineData = createDefaultOutlineStructure(projectId, structureType);
      const response = await scriptsOutlineApi.createOutline(outlineData);

      if (response.success && response.data) {
        message.success('大纲创建成功');
        setOutline(response.data as StoryOutlineDTO);
        return true;
      }
      return false;
    } catch (error) {
      console.error('创建大纲失败:', error);
      message.error('创建大纲失败');
      return false;
    } finally {
      setCreating(false);
    }
  };

  // 删除大纲
  const deleteOutline = async () => {
    if (!outline) return;

    try {
      const response = await scriptsOutlineApi.deleteOutline({ id: outline.id });
      if (response.success) {
        message.success('大纲删除成功');
        setOutline(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除大纲失败:', error);
      message.error('删除大纲失败');
      return false;
    }
  };

  // 保存节点 (Section/Chapter)
  const saveNode = async (
    editingNodeType: 'section' | 'chapter',
    editingParentId: string,
    editingNodeData: any, // existing data if editing, null if new
    updatedData: any, // form data
  ) => {
    if (!outline) return;

    try {
      let updatedOutline = { ...outline };

      // 处理新建节点的情况
      if (!editingNodeData) {
        // 新建节点
        switch (editingNodeType) {
          case 'section':
            // 新建卷
            updatedOutline.sections = [
              ...updatedOutline.sections,
              {
                sectionId: createClientNodeId('section'),
                sectionTitle: updatedData.sectionTitle,
                description: updatedData.description,
                sequence: (updatedOutline.sections?.length || 0) + 1,
                chapterCount: 0,
                chapters: [],
                projectId: outline.projectId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ];
            break;
          case 'chapter':
            // 新建章节
            updatedOutline.sections = updatedOutline.sections.map((section) => {
              if (section.sectionId === editingParentId) {
                const nextChapterNumber = (section.chapters?.length || 0) + 1;
                return {
                  ...section,
                  chapters: [
                    ...(section.chapters || []),
                    {
                      chapterId: createClientNodeId('chapter'),
                      chapterTitle: updatedData.chapterTitle,
                      chapterSummary: updatedData.chapterSummary,
                      chapterNumber: nextChapterNumber,
                      episodeCount: 0,
                      wordCount: 0,
                      episodes: [],
                      projectId: outline.projectId,
                      sectionId: editingParentId,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                  chapterCount: (section.chapters?.length || 0) + 1,
                };
              }
              return section;
            });
            break;
        }
      } else {
        // 编辑现有节点
        switch (editingNodeType) {
          case 'section':
            // 更新章节
            updatedOutline.sections = updatedOutline.sections.map((section) =>
              section.sectionId === updatedData.sectionId ? updatedData : section,
            );
            break;
          case 'chapter':
            // 更新章节
            updatedOutline.sections = updatedOutline.sections.map((section) => ({
              ...section,
              chapters: section.chapters.map((chapter) =>
                chapter.chapterId === updatedData.chapterId ? updatedData : chapter,
              ),
            }));
            break;
        }
      }

      // 重新计算编号
      updatedOutline = recalculateNumbers(updatedOutline);

      // 更新到后端
      const response = await scriptsOutlineApi.updateSections({
        projectId: outline.projectId,
        sections: updatedOutline.sections,
      });

      if (!response.success) {
        throw new Error('更新大纲失败');
      }

      setOutline(updatedOutline);
      message.success('保存成功');
      return true;
    } catch (error) {
      console.error('保存节点失败:', error);
      message.error('保存节点失败');
      return false;
    }
  };

  // 保存桥段
  const saveEpisode = async (
    updatedEpisode: ScriptEpisodeDTO,
    // @ts-ignore
    currentEpisode: OutlineEpisodeDTO | null,
  ) => {
    if (!outline) return;
    if (!updatedEpisode?.id || updatedEpisode.id.length > 32) {
      message.error('桥段ID非法（长度需≤32），请检查后端ID生成策略');
      return;
    }

    const updatedOutline = { ...outline };
    let isNewEpisode = false;

    updatedOutline.sections = updatedOutline.sections.map((section) => ({
      ...section,
      chapters: section.chapters.map((chapter) => {
        if (chapter.chapterId === updatedEpisode.chapterId) {
          const exists = chapter.episodes.some((ep) => ep.episodeId === updatedEpisode.id);
          let newEpisodes;

          if (exists) {
            newEpisodes = chapter.episodes.map((ep) => {
              if (ep.episodeId === updatedEpisode.id) {
                return {
                  ...ep,
                  episodeTitle: updatedEpisode.episodeTitle,
                  updatedAt: new Date().toISOString(),
                };
              }
              return ep;
            });
          } else {
            // 新增桥段
            isNewEpisode = true;
            const newEp: OutlineEpisodeDTO = {
              episodeId: updatedEpisode.id,
              projectId: updatedEpisode.projectId,
              chapterId: updatedEpisode.chapterId,
              episodeTitle: updatedEpisode.episodeTitle,
              episodeNumber: updatedEpisode.episodeNumber,
              createdAt: updatedEpisode.createdAt || new Date().toISOString(),
              updatedAt: updatedEpisode.updatedAt || new Date().toISOString(),
            };
            newEpisodes = [...chapter.episodes, newEp];
          }

          return {
            ...chapter,
            episodes: newEpisodes,
            episodeCount: newEpisodes.length,
          };
        }
        return chapter;
      }),
    }));

    setOutline(updatedOutline);

    if (isNewEpisode) {
      try {
        const response = await scriptsOutlineApi.updateSections({
          projectId: outline.projectId,
          sections: recalculateNumbers(updatedOutline).sections,
        });
        if (!response.success) {
          throw new Error('更新大纲失败');
        }
      } catch {
        try {
          await scriptsEpisodeApi.deleteEpisode({ id: updatedEpisode.id });
        } catch {
          /* empty */
        }
        await fetchOutline();
        message.error('桥段已创建，但更新大纲结构失败，已回滚');
        return null;
      }
    }

    return updatedEpisode;
  };

  // 创建子节点
  const createChild = async (
    parentId: string,
    childData: any,
    editingNodeType: 'section' | 'chapter',
  ) => {
    if (!outline) return;

    try {
      let updatedOutline = { ...outline };
      let createdEpisodeIdForRollback: string | undefined;

      if (editingNodeType === 'section') {
        // 在章节下创建新章节
        updatedOutline.sections = updatedOutline.sections.map((section) => {
          if (section.sectionId === parentId) {
            const newChapter = {
              ...childData,
              projectId: outline.projectId,
              sectionId: parentId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            const newChapters = [
              ...(section.chapters || []),
              { ...newChapter, chapterNumber: (section.chapters?.length || 0) + 1 },
            ];
            return {
              ...section,
              chapters: newChapters,
              chapterCount: newChapters.length,
            };
          }
          return section;
        });
      } else if (editingNodeType === 'chapter') {
        // 在章节下创建新桥段
        const parentChapter = updatedOutline.sections
          .flatMap((s) => s.chapters || [])
          .find((c) => c.chapterId === parentId);
        const nextEpisodeNumber = (parentChapter?.episodes?.length || 0) + 1;
        const episodeData = {
          projectId: outline.projectId,
          chapterId: parentId,
          episodeNumber: nextEpisodeNumber,
          episodeTitle: childData.episodeTitle,
          episodeContent: '',
          wordCount: 0,
        };

        const episodeResponse = await scriptsEpisodeApi.createEpisode(episodeData);
        if (episodeResponse.success && episodeResponse.data) {
          const newEpisode = episodeResponse.data as ScriptEpisodeDTO;
          if (!newEpisode?.id || newEpisode.id.length > 32) {
            throw new Error('桥段ID非法（长度需≤32）');
          }
          createdEpisodeIdForRollback = newEpisode.id;
          const outlineEpisode: OutlineEpisodeDTO = {
            episodeId: newEpisode.id || '',
            projectId: newEpisode.projectId || '',
            chapterId: newEpisode.chapterId || '',
            episodeTitle: newEpisode.episodeTitle || '',
            episodeNumber: newEpisode.episodeNumber || 1,
            createdAt: newEpisode.createdAt || new Date().toISOString(),
            updatedAt: newEpisode.updatedAt || new Date().toISOString(),
          };

          updatedOutline.sections = updatedOutline.sections.map((section) => ({
            ...section,
            chapters: (section.chapters || []).map((chapter) => {
              if (chapter.chapterId === parentId) {
                const newEpisodes = [...(chapter.episodes || []), outlineEpisode];
                return {
                  ...chapter,
                  episodes: newEpisodes,
                  episodeCount: newEpisodes.length,
                };
              }
              return chapter;
            }),
          }));
        } else {
          throw new Error('创建桥段失败');
        }
      }

      updatedOutline = recalculateNumbers(updatedOutline);

      const response = await scriptsOutlineApi.updateSections({
        projectId: outline.projectId,
        sections: updatedOutline.sections,
      });

      if (!response.success) {
        if (editingNodeType === 'chapter' && createdEpisodeIdForRollback) {
          try {
            await scriptsEpisodeApi.deleteEpisode({ id: createdEpisodeIdForRollback });
          } catch {
            /* empty */
          }
        }
        throw new Error('更新大纲失败');
      }

      setOutline(updatedOutline);
      message.success('子节点创建成功');
      return true;
    } catch (error) {
      console.error('创建子节点失败:', error);
      message.error('创建子节点失败');
      return false;
    }
  };

  // 删除节点
  const deleteNode = async (id: string, nodeType: 'section' | 'chapter' | 'episode') => {
    if (!outline) return;

    if (nodeType === 'section') {
      const section = outline.sections.find((s) => s.sectionId === id);
      if (!section) return;

      try {
        // 先删除章节下的所有桥段
        for (const chapter of section.chapters) {
          if (chapter.episodes.length > 0) {
            const episodeIds = chapter.episodes.map((ep) => ep.episodeId).filter((eid) => eid);
            if (episodeIds.length > 0) {
              await scriptsEpisodeApi.batchDeleteEpisodes({ ids: episodeIds });
            }
          }
        }

        const updatedOutline = {
          ...outline,
          sections: outline.sections.filter((s) => s.sectionId !== id),
        };

        const response = await scriptsOutlineApi.updateSections({
          projectId: outline.projectId,
          sections: updatedOutline.sections,
        });

        if (response.success) {
          setOutline(updatedOutline);
          message.success('章节删除成功');
        }
      } catch (error) {
        console.error('删除章节失败:', error);
        message.error('删除章节失败');
      }
    } else if (nodeType === 'chapter') {
      let chapterToDelete: any = null;
      let parentSectionId = '';

      for (const section of outline.sections) {
        const chapter = section.chapters.find((c) => c.chapterId === id);
        if (chapter) {
          chapterToDelete = chapter;
          parentSectionId = section.sectionId;
          break;
        }
      }

      if (!chapterToDelete) return;

      try {
        if (chapterToDelete.episodes.length > 0) {
          const episodeIds = chapterToDelete.episodes
            .map((ep: any) => ep.episodeId)
            .filter((eid: string) => eid);
          if (episodeIds.length > 0) {
            await scriptsEpisodeApi.batchDeleteEpisodes({ ids: episodeIds });
          }
        }

        const updatedOutline = {
          ...outline,
          sections: outline.sections.map((section) => {
            if (section.sectionId === parentSectionId) {
              return {
                ...section,
                chapters: section.chapters.filter((c) => c.chapterId !== id),
                chapterCount: section.chapters.length - 1,
              };
            }
            return section;
          }),
        };

        const response = await scriptsOutlineApi.updateSections({
          projectId: outline.projectId,
          sections: updatedOutline.sections,
        });

        if (response.success) {
          setOutline(updatedOutline);
          message.success('章节删除成功');
        }
      } catch (error) {
        console.error('删除章节失败:', error);
        message.error('删除章节失败');
      }
    } else if (nodeType === 'episode') {
      let episodeToDelete: any = null;
      let parentChapterId = '';

      for (const section of outline.sections) {
        for (const chapter of section.chapters) {
          const episode = chapter.episodes.find((e) => e.episodeId === id);
          if (episode) {
            episodeToDelete = episode;
            parentChapterId = chapter.chapterId;
            break;
          }
        }
        if (episodeToDelete) break;
      }

      if (!episodeToDelete) return;

      try {
        if (episodeToDelete.episodeId) {
          await scriptsEpisodeApi.deleteEpisode({ id: episodeToDelete.episodeId });
        }

        const updatedOutline = {
          ...outline,
          sections: outline.sections.map((section) => ({
            ...section,
            chapters: section.chapters.map((chapter) => {
              if (chapter.chapterId === parentChapterId) {
                return {
                  ...chapter,
                  episodes: chapter.episodes.filter((e) => e.episodeId !== id),
                  episodeCount: chapter.episodes.length - 1,
                };
              }
              return chapter;
            }),
          })),
        };

        const response = await scriptsOutlineApi.updateSections({
          projectId: outline.projectId,
          sections: updatedOutline.sections,
        });

        if (response.success) {
          setOutline(updatedOutline);
          message.success('桥段删除成功');
        }
      } catch (error) {
        console.error('删除桥段失败:', error);
        message.error('删除桥段失败');
      }
    }
  };

  return {
    outline,
    loading,
    creating,
    fetchOutline,
    createOutline,
    deleteOutline,
    saveNode,
    saveEpisode,
    createChild,
    deleteNode,
    setOutline, // Expose setter if needed for edge cases
  };
};
