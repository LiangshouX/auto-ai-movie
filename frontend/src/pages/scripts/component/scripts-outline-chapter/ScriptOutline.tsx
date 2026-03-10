import React, { useEffect, useState } from 'react';
import { Button, Drawer, Flex, message, Modal, Space } from 'antd';
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
import { useParams } from 'react-router-dom';

import type { OutlineEpisodeDTO, StructureType } from '@/api/types/scripts-outline-types';
import type { ScriptEpisodeDTO } from '@/api/types/scripts-episode-types';

import { generateOutlineText } from './utils/outline-utils';
import CreateOutlineModal from './components/CreateOutlineModal';
import NodeEditorDrawer from './components/NodeEditorDrawer';
import EpisodeEditorDrawer from './components/EpisodeEditorDrawer';
import ScriptOutlineFlow from './ScriptOutlineFlow';
import { useScriptOutline } from './hooks/useScriptOutline';

interface ScriptOutlineProps {
    projectTitle: string;
}

const ScriptOutline: React.FC<ScriptOutlineProps> = ({ projectTitle }) => {

    const { projectId } = useParams<{ projectId: string }>();

    // Use custom hook for data management
    const {
        outline,
        loading,
        creating,
        fetchOutline,
        createOutline,
        deleteOutline,
        saveNode,
        saveEpisode,
        createChild,
        deleteNode
    } = useScriptOutline(projectId);

    // UI State
    const [episodeDrawerVisible, setEpisodeDrawerVisible] = useState(false);
    const [readDrawerVisible, setReadDrawerVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [outlineText, setOutlineText] = useState('');
    const [editorDrawerVisible, setEditorDrawerVisible] = useState(false);
    const [editingNodeType, setEditingNodeType] = useState<'section' | 'chapter' | 'episode' | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<any>(null);
    const [editingParentId, setEditingParentId] = useState<string>('');
    const [currentEpisode, setCurrentEpisode] = useState<OutlineEpisodeDTO | null>(null);

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
        const success = await createOutline(structureType);
        if (success) {
            setCreateModalVisible(false);
        }
    };

    // 保存节点编辑 (Section/Chapter)
    const handleNodeSave = async (updatedData: any) => {
        if (!editingNodeType || editingNodeType === 'episode') return;
        await saveNode(editingNodeType, editingParentId, editingNodeData, updatedData);
    };

    // 处理桥段保存
    const handleEpisodeSave = async (updatedEpisode: ScriptEpisodeDTO) => {
        const result = await saveEpisode(updatedEpisode, currentEpisode);
        if (result && currentEpisode && !currentEpisode.episodeId) {
             setCurrentEpisode({
                 episodeId: result.id || '',
                 projectId: result.projectId || '',
                 chapterId: result.chapterId || '',
                 episodeTitle: result.episodeTitle || '',
                 episodeNumber: result.episodeNumber || 1,
                 createdAt: result.createdAt || new Date().toISOString(),
                 updatedAt: result.updatedAt || new Date().toISOString()
             });
        }
    };

    // 处理添加同级节点
    const handleAddSibling = (id: string, nodeType: 'section' | 'chapter' | 'episode') => {
        if (!outline) return;

        if (nodeType === 'section') {
             handleAddSection(); 
        } else if (nodeType === 'chapter') {
             const section = outline.sections.find(s => s.chapters.some(c => c.chapterId === id));
             if (section) {
                 handleFlowAddChild(section.sectionId, 'chapter'); 
             }
        } else if (nodeType === 'episode') {
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
        if (!editingNodeType || editingNodeType === 'episode') return;
        await createChild(parentId, childData, editingNodeType);
    };

    // 处理 Flow 中直接添加子节点
    const handleFlowAddChild = (parentId: string, nodeType: 'section' | 'chapter' | 'episode') => {
        setEditingParentId(parentId);
        
        if (nodeType === 'episode') {
             setEditingNodeType('episode');
             
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
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要删除当前剧本大纲吗？此操作将同时删除所有章节和桥段内容。',
            okText: '确认删除',
            okButtonProps: {danger: true},
            cancelText: '取消',
            onOk: async () => {
                await deleteOutline();
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
                await deleteNode(sectionId, 'section');
            }
        });
    };

    // 删除章节 (Chapter)
    const handleDeleteChapter = (chapterId: string) => {
        if (!outline) return;
        // Find chapter for title
        let chapterTitle = '该章节';
        for (const section of outline.sections) {
            const chapter = section.chapters.find(c => c.chapterId === chapterId);
            if (chapter) {
                chapterTitle = chapter.chapterTitle;
                break;
            }
        }

        Modal.confirm({
            title: '确认删除章节',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除章节"${chapterTitle}"吗？此操作将同时删除该章节下的所有桥段。`,
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                await deleteNode(chapterId, 'chapter');
            }
        });
    };

    // 删除桥段
    const handleDeleteEpisode = (episodeId: string) => {
        if (!outline) return;
        // Find episode for title
        let episodeTitle = '该桥段';
        for (const section of outline.sections) {
            for (const chapter of section.chapters) {
                const episode = chapter.episodes.find(e => e.episodeId === episodeId);
                if (episode) {
                    episodeTitle = episode.episodeTitle;
                    break;
                }
            }
        }

        Modal.confirm({
            title: '确认删除桥段',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除桥段"${episodeTitle}"吗？`,
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                await deleteNode(episodeId, 'episode');
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
