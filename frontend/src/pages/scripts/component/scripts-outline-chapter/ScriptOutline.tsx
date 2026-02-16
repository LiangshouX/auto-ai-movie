import React, {useCallback, useEffect, useState} from 'react';
import {Button, Drawer, Flex, message, Modal, Space} from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    FundProjectionScreenOutlined,
    PlusOutlined,
    ReadOutlined,
    ReloadOutlined,
    RobotOutlined
} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {useParams} from 'react-router-dom';
import {scriptsOutlineApi} from '@/api/service/scripts-outline';
import {scriptsEpisodeApi} from '@/api/service/scripts-episode';

import type {OutlineEpisodeDTO, StoryOutlineDTO, StructureType} from '@/api/types/scripts-outline-types';
import type {ScriptEpisodeDTO} from '@/api/types/scripts-episode-types';

import {createClientNodeId, createDefaultOutlineStructure, generateOutlineText, recalculateNumbers} from './utils/outline-utils';
import CreateOutlineModal from './components/CreateOutlineModal';
import NodeEditorDrawer from './components/NodeEditorDrawer';
import EpisodeEditorDrawer from './components/EpisodeEditorDrawer';
import ScriptOutlineFlow from './ScriptOutlineFlow';

interface ScriptOutlineProps {
    projectTitle: string;
}

const ScriptOutline: React.FC<ScriptOutlineProps> = ({projectTitle}) => {

    const {projectId} = useParams<{ projectId: string }>();

    // 状态管理
    const [outline, setOutline] = useState<StoryOutlineDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [episodeDrawerVisible, setEpisodeDrawerVisible] = useState(false);
    const [readDrawerVisible, setReadDrawerVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [creating, setCreating] = useState(false);
    const [outlineText, setOutlineText] = useState('');
    const [editorDrawerVisible, setEditorDrawerVisible] = useState(false);
    const [editingNodeType, setEditingNodeType] = useState<'section' | 'chapter' | 'episode' | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<any>(null);
    const [editingParentId, setEditingParentId] = useState<string>('');
    const [currentEpisode, setCurrentEpisode] = useState<OutlineEpisodeDTO | null>(null);

    // 获取大纲数据
    const fetchOutline = useCallback(async () => {
        if (!projectId) return;

        setLoading(true);
        try {
            const response = await scriptsOutlineApi.getOutlineByProject({projectId});
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

    // 处理节点点击
    const handleNodeSelect = async (nodeType: 'section' | 'chapter' | 'episode', data: any) => {
        switch (nodeType) {
            case 'section':
                setEditingNodeType('section');
                setEditingNodeData(data);
                setEditingParentId(data.sectionId);
                setEditorDrawerVisible(true);
                break;
            case 'chapter':
                setEditingNodeType('chapter');
                setEditingNodeData(data);
                setEditingParentId(data.chapterId);
                setEditorDrawerVisible(true);
                break;
            case 'episode':
                setCurrentEpisode(data as OutlineEpisodeDTO);
                setEditingParentId(data.chapterId);
                setEpisodeDrawerVisible(true);
                break;
        }
    };

    // 刷新大纲
    const handleRefresh = () => {
        fetchOutline();
    };

    // 新建大纲
    const handleCreateOutline = () => {
        setCreateModalVisible(true);
    };

    // 处理大纲创建
    const handleCreateOutlineConfirm = async (structureType: StructureType) => {
        if (!projectId) return;

        setCreating(true);
        try {
            const outlineData = createDefaultOutlineStructure(projectId, structureType);
            const response = await scriptsOutlineApi.createOutline(outlineData);

            if (response.success && response.data) {
                message.success('大纲创建成功');
                setOutline(response.data as StoryOutlineDTO);
                setCreateModalVisible(false);
            }
        } catch (error) {
            console.error('创建大纲失败:', error);
            message.error('创建大纲失败');
        } finally {
            setCreating(false);
        }
    };

    // 保存节点编辑 (Section/Chapter)
    const handleNodeSave = async (updatedData: any) => {
        if (!outline) return;

        try {
            let updatedOutline = {...outline};

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
                                updatedAt: new Date().toISOString()
                            }
                        ];
                        break;
                    case 'chapter':
                        // 新建章节
                        updatedOutline.sections = updatedOutline.sections.map(section => {
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
                                            updatedAt: new Date().toISOString()
                                        }
                                    ],
                                    chapterCount: (section.chapters?.length || 0) + 1
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
                        updatedOutline.sections = updatedOutline.sections.map(section =>
                            section.sectionId === updatedData.sectionId ? updatedData : section
                        );
                        break;
                    case 'chapter':
                        // 更新章节
                        updatedOutline.sections = updatedOutline.sections.map(section => ({
                            ...section,
                            chapters: section.chapters.map(chapter =>
                                chapter.chapterId === updatedData.chapterId ? updatedData : chapter
                            )
                        }));
                        break;
                }
            }

            // 重新计算编号
            updatedOutline = recalculateNumbers(updatedOutline);

            // 更新到后端
            const response = await scriptsOutlineApi.updateSections({
                projectId: outline.projectId,
                sections: updatedOutline.sections
            });

            if (!response.success) {
                throw new Error('更新大纲失败');
            }

            setOutline(updatedOutline);
            message.success('保存成功');
        } catch (error) {
            console.error('保存节点失败:', error);
            message.error('保存节点失败');
        }
    };

    // 处理桥段保存
    const handleEpisodeSave = async (updatedEpisode: ScriptEpisodeDTO) => {
        if (!outline) return;
        if (!updatedEpisode?.id || updatedEpisode.id.length > 32) {
            message.error('桥段ID非法（长度需≤32），请检查后端ID生成策略');
            return;
        }
        
        // 更新本地 outline 状态以反映最新的标题和字数
        const updatedOutline = {...outline};
        let isNewEpisode = false;
        
        updatedOutline.sections = updatedOutline.sections.map(section => ({
            ...section,
            chapters: section.chapters.map(chapter => {
                if (chapter.chapterId === updatedEpisode.chapterId) {
                    const exists = chapter.episodes.some(ep => ep.episodeId === updatedEpisode.id);
                    let newEpisodes;
                    
                    if (exists) {
                        newEpisodes = chapter.episodes.map(ep => {
                            if (ep.episodeId === updatedEpisode.id) {
                                return {
                                    ...ep,
                                    episodeTitle: updatedEpisode.episodeTitle,
                                    // episodeNumber: updatedEpisode.episodeNumber,
                                    updatedAt: new Date().toISOString()
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
                            updatedAt: updatedEpisode.updatedAt || new Date().toISOString()
                        };
                        newEpisodes = [...chapter.episodes, newEp];
                    }

                    return {
                        ...chapter,
                        episodes: newEpisodes,
                        episodeCount: newEpisodes.length
                    };
                }
                return chapter;
            })
        }));
        
        setOutline(updatedOutline);

        if (isNewEpisode) {
            try {
                const response = await scriptsOutlineApi.updateSections({
                    projectId: outline.projectId,
                    sections: recalculateNumbers(updatedOutline).sections
                });
                if (!response.success) {
                    throw new Error('更新大纲失败');
                }
            } catch (error) {
                try {
                    await scriptsEpisodeApi.deleteEpisode({id: updatedEpisode.id});
                } catch { /* empty */ }
                await fetchOutline();
                message.error('桥段已创建，但更新大纲结构失败，已回滚');
                return;
            }
        }
        
        // 如果是新增，可能需要关闭 drawer 或者更新 currentEpisode
        if (currentEpisode && !currentEpisode.episodeId) {
             // 之前是新建模式，现在保存了，更新 currentEpisode 为真实数据
             // 或者直接关闭，用户体验可能更好？这里选择不关闭，允许继续编辑
             setCurrentEpisode({
                 episodeId: updatedEpisode.id,
                 projectId: updatedEpisode.projectId,
                 chapterId: updatedEpisode.chapterId,
                 episodeTitle: updatedEpisode.episodeTitle,
                 episodeNumber: updatedEpisode.episodeNumber,
                 createdAt: updatedEpisode.createdAt,
                 updatedAt: updatedEpisode.updatedAt
             });
        }
    };

    // 处理添加同级节点
    const handleAddSibling = (id: string, nodeType: 'section' | 'chapter' | 'episode') => {
        if (!outline) return;

        if (nodeType === 'section') {
             handleAddSection(); 
        } else if (nodeType === 'chapter') {
             // Find parent section
             const section = outline.sections.find(s => s.chapters.some(c => c.chapterId === id));
             if (section) {
                 handleFlowAddChild(section.sectionId, 'chapter'); 
             }
        } else if (nodeType === 'episode') {
             // Find parent chapter
             for (const section of outline.sections) {
                 const chapter = section.chapters.find(c => c.episodes.some(e => e.episodeId === id));
                 if (chapter) {
                     handleFlowAddChild(chapter.chapterId, 'episode');
                     break;
                 }
             }
        }
    };

    // 处理复制节点
    const handleCopyNode = (_id: string, _nodeType: 'section' | 'chapter' | 'episode') => {
        message.info('复制功能暂未实现');
    };

    // 创建子节点
    const handleCreateChild = async (parentId: string, childData: any) => {
        if (!outline) return;

        try {
            let updatedOutline = {...outline};
            let createdEpisodeIdForRollback: string | undefined;

            if (editingNodeType === 'section') {
                // 在章节下创建新章节
                updatedOutline.sections = updatedOutline.sections.map(section => {
                    if (section.sectionId === parentId) {
                        // 创建新章节时需要设置必要的字段
                        const newChapter = {
                            ...childData,
                            projectId: outline.projectId,
                            sectionId: parentId,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        const newChapters = [...(section.chapters || []), {...newChapter, chapterNumber: (section.chapters?.length || 0) + 1}];
                        return {
                            ...section,
                            chapters: newChapters,
                            chapterCount: newChapters.length
                        };
                    }
                    return section;
                });
            } else if (editingNodeType === 'chapter') {
                 // 在章节下创建新桥段
                // 使用专门的episode API创建桥段
                const parentChapter = updatedOutline.sections
                    .flatMap(s => s.chapters || [])
                    .find(c => c.chapterId === parentId);
                const nextEpisodeNumber = (parentChapter?.episodes?.length || 0) + 1;
                const episodeData = {
                    projectId: outline.projectId,
                    chapterId: parentId,
                    episodeNumber: nextEpisodeNumber,
                    episodeTitle: childData.episodeTitle,
                    episodeContent: '',
                    wordCount: 0
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
                        updatedAt: newEpisode.updatedAt || new Date().toISOString()
                    };

                    updatedOutline.sections = updatedOutline.sections.map(section => ({
                        ...section,
                        chapters: (section.chapters || []).map(chapter => {
                            if (chapter.chapterId === parentId) {
                                const newEpisodes = [...(chapter.episodes || []), outlineEpisode];
                                return {
                                    ...chapter,
                                    episodes: newEpisodes,
                                    episodeCount: newEpisodes.length
                                };
                            }
                            return chapter;
                        })
                    }));
                } else {
                    throw new Error('创建桥段失败');
                }
            }

            // 重新计算编号
            updatedOutline = recalculateNumbers(updatedOutline);

            const response = await scriptsOutlineApi.updateSections({
                projectId: outline.projectId,
                sections: updatedOutline.sections
            });

            if (!response.success) {
                if (editingNodeType === 'chapter' && createdEpisodeIdForRollback) {
                    try {
                        await scriptsEpisodeApi.deleteEpisode({id: createdEpisodeIdForRollback});
                    } catch { /* empty */ }
                }
                throw new Error('更新大纲失败');
            }

            setOutline(updatedOutline);
            message.success('子节点创建成功');
        } catch (error) {
            console.error('创建子节点失败:', error);
            message.error('创建子节点失败');
        }
    };

    // 处理 Flow 中直接添加子节点
    const handleFlowAddChild = (parentId: string, nodeType: 'section' | 'chapter' | 'episode') => {
        setEditingParentId(parentId);
        
        if (nodeType === 'episode') {
             setEditingNodeType('episode');
             
             // Calculate next episode number
             let nextNumber = 1;
             if (outline) {
                 for (const section of outline.sections) {
                     const chapter = section.chapters.find(c => c.chapterId === parentId);
                     if (chapter) {
                         nextNumber = (chapter.episodes.length || 0) + 1;
                         break;
                     }
                 }
             }

             const newEpisodeStub: OutlineEpisodeDTO = {
                 episodeId: '', // Empty ID indicates new
                 projectId: outline?.projectId || '',
                 chapterId: parentId,
                 episodeNumber: nextNumber,
                 episodeTitle: '新桥段',
                 createdAt: new Date().toISOString(),
                 updatedAt: new Date().toISOString()
             };

             setCurrentEpisode(newEpisodeStub); 
             setEpisodeDrawerVisible(true);
        } else {
             setEditingNodeType(nodeType as 'section' | 'chapter');
             setEditingNodeData(null); // New Section/Chapter
             setEditorDrawerVisible(true);
        }
    };

    // 处理 Flow 中添加 Section
    const handleAddSection = () => {
         setEditingNodeType('section');
         setEditingNodeData(null); // New Section
         setEditingParentId(''); // No parent for section
         setEditorDrawerVisible(true);
    };


    // 删除大纲
    const handleDeleteOutline = () => {
        if (!outline) return;

        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要删除当前剧本大纲吗？此操作将同时删除所有章节和桥段内容。',
            okText: '确认删除',
            okButtonProps: {danger: true},
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await scriptsOutlineApi.deleteOutline({id: outline.id});
                    if (response.success) {
                        message.success('大纲删除成功');
                        setOutline(null);
                    }
                } catch (error) {
                    console.error('删除大纲失败:', error);
                    message.error('删除大纲失败');
                }
            }
        });
    };

    // 删除节点
    const handleDeleteNode = (id: string, nodeType: 'section' | 'chapter' | 'episode') => {
        if (nodeType === 'section') handleDeleteSection(id);
        if (nodeType === 'chapter') handleDeleteChapter(id);
        if (nodeType === 'episode') handleDeleteEpisode(id);
    };

    // 删除章节 (Section)
    const handleDeleteSection = (sectionId: string) => {
        if (!outline) return;

        const section = outline.sections.find(s => s.sectionId === sectionId);
        if (!section) return;

        Modal.confirm({
            title: '确认删除章节',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除章节"${section.sectionTitle}"吗？此操作将同时删除该章节下的所有内容。`,
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 先删除章节下的所有桥段
                    for (const chapter of section.chapters) {
                        if (chapter.episodes.length > 0) {
                            const episodeIds = chapter.episodes.map(ep => ep.episodeId).filter(id => id);
                            if (episodeIds.length > 0) {
                                await scriptsEpisodeApi.batchDeleteEpisodes({ ids: episodeIds });
                            }
                        }
                    }

                    // 更新大纲结构
                    const updatedOutline = {
                        ...outline,
                        sections: outline.sections.filter(s => s.sectionId !== sectionId)
                    };

                    const response = await scriptsOutlineApi.updateSections({
                        projectId: outline.projectId,
                        sections: updatedOutline.sections
                    });

                    if (response.success) {
                        setOutline(updatedOutline);
                        message.success('章节删除成功');
                    }
                } catch (error) {
                    console.error('删除章节失败:', error);
                    message.error('删除章节失败');
                }
            }
        });
    };

    // 删除章节 (Chapter)
    const handleDeleteChapter = (chapterId: string) => {
        if (!outline) return;

        let chapterToDelete: any = null;
        let parentSectionId = '';
        
        // 查找章节
        for (const section of outline.sections) {
            const chapter = section.chapters.find(c => c.chapterId === chapterId);
            if (chapter) {
                chapterToDelete = chapter;
                parentSectionId = section.sectionId;
                break;
            }
        }

        if (!chapterToDelete) return;

        Modal.confirm({
            title: '确认删除章节',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除章节"${chapterToDelete.chapterTitle}"吗？此操作将同时删除该章节下的所有桥段。`,
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 先删除章节下的所有桥段
                    if (chapterToDelete.episodes.length > 0) {
                        const episodeIds = chapterToDelete.episodes.map((ep: any) => ep.episodeId).filter((id: string) => id);
                        if (episodeIds.length > 0) {
                            await scriptsEpisodeApi.batchDeleteEpisodes({ ids: episodeIds });
                        }
                    }

                    // 更新大纲结构
                    const updatedOutline = {
                        ...outline,
                        sections: outline.sections.map(section => {
                            if (section.sectionId === parentSectionId) {
                                return {
                                    ...section,
                                    chapters: section.chapters.filter(c => c.chapterId !== chapterId),
                                    chapterCount: section.chapters.length - 1
                                };
                            }
                            return section;
                        })
                    };

                    const response = await scriptsOutlineApi.updateSections({
                        projectId: outline.projectId,
                        sections: updatedOutline.sections
                    });

                    if (response.success) {
                        setOutline(updatedOutline);
                        message.success('章节删除成功');
                    }
                } catch (error) {
                    console.error('删除章节失败:', error);
                    message.error('删除章节失败');
                }
            }
        });
    };

    // 删除桥段
    const handleDeleteEpisode = (episodeId: string) => {
        if (!outline) return;

        let episodeToDelete: any = null;
        let parentChapterId = '';
        
        // 查找桥段
        for (const section of outline.sections) {
            for (const chapter of section.chapters) {
                const episode = chapter.episodes.find(e => e.episodeId === episodeId);
                if (episode) {
                    episodeToDelete = episode;
                    parentChapterId = chapter.chapterId;
                    break;
                }
            }
            if (episodeToDelete) break;
        }

        if (!episodeToDelete) return;

        Modal.confirm({
            title: '确认删除桥段',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除桥段"${episodeToDelete.episodeTitle}"吗？`,
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 删除桥段
                    if (episodeToDelete.episodeId) {
                        await scriptsEpisodeApi.deleteEpisode({ id: episodeToDelete.episodeId });
                    }

                    // 更新大纲结构
                    const updatedOutline = {
                        ...outline,
                        sections: outline.sections.map(section => ({
                            ...section,
                            chapters: section.chapters.map(chapter => {
                                if (chapter.chapterId === parentChapterId) {
                                    return {
                                        ...chapter,
                                        episodes: chapter.episodes.filter(e => e.episodeId !== episodeId),
                                        episodeCount: chapter.episodes.length - 1
                                    };
                                }
                                return chapter;
                            })
                        }))
                    };

                    const response = await scriptsOutlineApi.updateSections({
                        projectId: outline.projectId,
                        sections: updatedOutline.sections
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
        });
    };

    // AI生成
    const handleAIGenerate = () => {
        message.info('AI生成功能预留接口');
    };

    // 阅读剧本
    const handleReadScript = () => {
        if (outline) {
            const text = generateOutlineText(outline);
            setOutlineText(text);
            setReadDrawerVisible(true);
        }
    };

    // 初始化加载
    useEffect(() => {
        fetchOutline();
    }, [fetchOutline]);

    return (
        <Flex vertical style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        }}>
            {/* 工具栏 */}
            <Flex justify="space-between" align="center" style={{
                marginBottom: 0, position: 'sticky', top: 0, zIndex: 1, background: '#fff',
                // padding: '16px 24px', borderBottom: '1px solid #f0f0f0'
            }}>
                <Title level={3} style={{margin: 0}}>
                    <Space>
                        <FundProjectionScreenOutlined/>
                        <span>剧本设计</span>
                    </Space>
                </Title>
                <Space>
                    <Button
                        size="large"
                        icon={<ReloadOutlined/>}
                        onClick={handleRefresh}
                        loading={loading}
                    >
                        刷新
                    </Button>

                    <Button
                        size="large"
                        icon={<PlusOutlined/>}
                        onClick={handleCreateOutline}
                        disabled={!!outline}
                    >
                        新建剧本
                    </Button>

                    <Button
                        size="large"
                        icon={<DeleteOutlined/>}
                        onClick={handleDeleteOutline}
                        disabled={!outline}
                        danger
                    >
                        删除剧本
                    </Button>

                    <Button
                        size="large"
                        icon={<ReadOutlined/>}
                        onClick={handleReadScript}
                        disabled={!outline}
                    >
                        阅读
                    </Button>

                    <Button
                        size="large"
                        icon={<RobotOutlined/>}
                        onClick={handleAIGenerate}
                        disabled={!outline}
                    >
                        AI生成
                    </Button>
                </Space>
            </Flex>

            {/* 主内容区域 - React Flow */}
            <div style={{flex: 1, margin: '16px', border: '1px solid #e8e8e8', borderRadius: 8, background: '#fff', overflow: 'hidden'}}>
                {outline ? (
                    <ScriptOutlineFlow 
                        outline={outline}
                        onNodeClick={handleNodeSelect}
                        onAddChild={handleFlowAddChild}
                        onDeleteNode={handleDeleteNode}
                        onAddSection={handleAddSection}
                        onAddSibling={handleAddSibling}
                        onCopyNode={handleCopyNode}
                    />
                ) : (
                    <Flex vertical align="center" justify="center" style={{height: '100%', color: '#999'}}>
                        <FundProjectionScreenOutlined style={{fontSize: '48px', marginBottom: '16px'}}/>
                        <div>暂无剧本大纲</div>
                        <div style={{marginTop: '8px', fontSize: '12px'}}>点击&quot;新建剧本&quot;开始创作</div>
                    </Flex>
                )}
            </div>

            {/* 新建大纲模态框 */}
            <CreateOutlineModal
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={handleCreateOutlineConfirm}
                loading={creating}
            />

            {/* 节点编辑抽屉 (Section/Chapter) */}
            <NodeEditorDrawer
                open={editorDrawerVisible}
                onClose={() => {
                    setEditorDrawerVisible(false);
                    setEditingNodeType(null);
                    setEditingNodeData(null);
                    setEditingParentId('');
                }}
                nodeType={editingNodeType}
                nodeData={editingNodeData}
                parentId={editingParentId}
                onSave={handleNodeSave}
                onCreateChild={handleCreateChild}
                childNodes={editingNodeType === 'section' 
                    ? editingNodeData?.chapters || [] 
                    : editingNodeType === 'chapter' 
                        ? editingNodeData?.episodes || [] 
                        : []
                }
                onDeleteChild={(childId) => {
                    if (editingNodeType === 'section') {
                        handleDeleteChapter(childId);
                    } else if (editingNodeType === 'chapter') {
                        handleDeleteEpisode(childId);
                    }
                }}
            />

            {/* 桥段编辑抽屉 */}
            <EpisodeEditorDrawer
                open={episodeDrawerVisible}
                onClose={() => {
                    setEpisodeDrawerVisible(false);
                    setCurrentEpisode(null);
                }}
                episode={currentEpisode}
                projectId={outline?.projectId || ''}
                chapterId={editingParentId}
                onSave={handleEpisodeSave}
            />

            {/* 剧本阅读抽屉 */}
            <Drawer
                title="剧本全文阅读"
                placement="right"
                size={800}
                open={readDrawerVisible}
                onClose={() => setReadDrawerVisible(false)}
                extra={
                    <Button
                        type="primary"
                        onClick={() => {
                            const blob = new Blob([outlineText], {type: 'text/plain;charset=utf-8'});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${projectTitle || '剧本大纲'}_大纲.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        导出
                    </Button>
                }
            >
                <div style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6}}>
                    {outlineText}
                </div>
            </Drawer>
        </Flex>
    );

};

export default ScriptOutline;
