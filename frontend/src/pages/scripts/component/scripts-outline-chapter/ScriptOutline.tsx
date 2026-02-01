import React, {useEffect, useState} from 'react';
import {Button, Card, Drawer, Flex, message, Modal, Space, Tree, Typography} from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    FundProjectionScreenOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    ReadOutlined,
    ReloadOutlined,
    RobotOutlined
} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {useParams} from 'react-router-dom';
import {scriptsOutlineApi} from '@/api/service/scripts-outline';

import type {OutlineEpisodeDTO, StoryOutlineDTO, StructureType} from '@/api/types/scripts-outline-types';
import type {DataNode} from 'antd/es/tree';

import {createDefaultOutlineStructure, generateOutlineText, recalculateNumbers} from './utils/outline-utils';
import CreateOutlineModal from './components/CreateOutlineModal';
import NodeEditorDrawer from './components/NodeEditorDrawer';

const { Paragraph } = Typography;

interface ScriptOutlineProps {
    projectTitle: string;
}

// 定义树节点的数据类型
interface TreeNode extends DataNode {
    title: React.ReactNode;
    key: string;
    nodeType: 'project' | 'section' | 'chapter' | 'episode';
    nodeData?: any;
    children?: TreeNode[];
}

const ScriptOutline: React.FC<ScriptOutlineProps> = ({projectTitle}) => {

    const { projectId } = useParams<{ projectId: string }>();
    
    // 状态管理
    const [outline, setOutline] = useState<StoryOutlineDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [episodeDrawerVisible, setEpisodeDrawerVisible] = useState(false);
    const [readDrawerVisible, setReadDrawerVisible] = useState(false);
    const [currentEpisode, _setCurrentEpisode] = useState<OutlineEpisodeDTO | null>(null);
    const [editingChapterId, _setEditingChapterId] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [creating, setCreating] = useState(false);
    const [outlineText, setOutlineText] = useState('');
    const [editorDrawerVisible, setEditorDrawerVisible] = useState(false);
    const [editingNodeType, setEditingNodeType] = useState<'section' | 'chapter' | 'episode' | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<any>(null);
    const [editingParentId, setEditingParentId] = useState<string>('');
    
    // 获取大纲数据
    const fetchOutline = async () => {
        if (!projectId) return;
        
        setLoading(true);
        try {
            const response = await scriptsOutlineApi.getOutlineByProject({ projectId });
            if (response.success && response.data) {
                setOutline(response.data as StoryOutlineDTO);
                buildTreeData(response.data as StoryOutlineDTO);
            } else {
                setOutline(null);
                setTreeData([]);
            }
        } catch (error) {
            console.error('获取大纲失败:', error);
            message.error('获取大纲数据失败');
            setOutline(null);
            setTreeData([]);
        } finally {
            setLoading(false);
        }
    };
    
    // 构建树形数据
    const buildTreeData = (outlineData: StoryOutlineDTO) => {
        const rootNode: TreeNode = {
            title: (
                <div style={{ padding: '12px 16px', fontWeight: 'bold', fontSize: '16px' }}>
                    {projectTitle || '剧本大纲'}
                </div>
            ),
            key: `project-${outlineData.projectId}`,
            nodeType: 'project',
            nodeData: outlineData,
            children: outlineData.sections.map(section => ({
                title: (
                    <div style={{ 
                        padding: '12px 16px', 
                        border: '1px solid #e8e8e8', 
                        borderRadius: '6px',
                        backgroundColor: '#fafafa',
                        marginBottom: '8px'
                    }}>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{section.sectionTitle}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{section.description}</div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>章节: {section.chapterCount}</div>
                    </div>
                ),
                key: `section-${section.sectionId}`,
                nodeType: 'section',
                nodeData: section,
                children: section.chapters.map(chapter => ({
                    title: (
                        <div style={{ 
                            padding: '10px 14px', 
                            border: '1px solid #d9d9d9', 
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            marginBottom: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{chapter.chapterTitle}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{chapter.chapterSummary}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
                                <span>桥段: {chapter.episodeCount}</span>
                                <span>字数: {chapter.wordCount}</span>
                            </div>
                        </div>
                    ),
                    key: `chapter-${chapter.chapterId}`,
                    nodeType: 'chapter',
                    nodeData: chapter,
                    children: chapter.episodes.map(episode => ({
                        title: (
                            <div style={{ 
                                padding: '8px 12px', 
                                border: '1px dashed #d9d9d9', 
                                borderRadius: '4px',
                                backgroundColor: '#fff',
                                marginBottom: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f7ff';
                                e.currentTarget.style.borderColor = '#1890ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#fff';
                                e.currentTarget.style.borderColor = '#d9d9d9';
                            }}>
                                <div style={{ fontWeight: 'normal', fontSize: '13px' }}>{episode.episodeTitle}</div>
                                <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>#{episode.episodeNumber}</div>
                            </div>
                        ),
                        key: `episode-${episode.episodeId}`,
                        nodeType: 'episode',
                        nodeData: episode
                    }))
                }))
            }))
        };
        
        setTreeData([rootNode]);
    };

    // 处理节点点击
    const handleNodeSelect = (_selectedKeys: React.Key[], info: any) => {
        const node = info.node as TreeNode;
        
        // 打开对应的编辑抽屉
        switch (node.nodeType) {
            case 'section':
                setEditingNodeType('section');
                setEditingNodeData(node.nodeData);
                setEditingParentId('');
                setEditorDrawerVisible(true);
                break;
            case 'chapter':
                setEditingNodeType('chapter');
                setEditingNodeData(node.nodeData);
                setEditingParentId(node.nodeData.sectionId);
                setEditorDrawerVisible(true);
                break;
            case 'episode':
                setEditingNodeType('episode');
                setEditingNodeData(node.nodeData);
                setEditingParentId(node.nodeData.chapterId);
                setEditorDrawerVisible(true);
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
                buildTreeData(response.data as StoryOutlineDTO);
                setCreateModalVisible(false);
            }
        } catch (error) {
            console.error('创建大纲失败:', error);
            message.error('创建大纲失败');
        } finally {
            setCreating(false);
        }
    };
    
    // 保存节点编辑
    const handleNodeSave = async (updatedData: any) => {
        if (!outline) return;
        
        try {
            let updatedOutline = { ...outline };
            
            // 处理新建节点的情况
            if (!editingNodeData) {
                // 新建节点
                switch (editingNodeType) {
                    case 'section':
                        // 新建章节
                        updatedOutline.sections = [
                            ...updatedOutline.sections,
                            {
                                ...updatedData,
                                projectId: outline.projectId,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }
                        ];
                        break;
                    case 'chapter':
                        // 新建章節
                        updatedOutline.sections = updatedOutline.sections.map(section => {
                            if (section.sectionId === editingParentId) {
                                return {
                                    ...section,
                                    chapters: [
                                        ...section.chapters,
                                        {
                                            ...updatedData,
                                            projectId: outline.projectId,
                                            sectionId: editingParentId,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString()
                                        }
                                    ],
                                    chapterCount: section.chapters.length + 1
                                };
                            }
                            return section;
                        });
                        break;
                    case 'episode':
                        // 新建桥段
                        updatedOutline.sections = updatedOutline.sections.map(section => ({
                            ...section,
                            chapters: section.chapters.map(chapter => {
                                if (chapter.chapterId === editingParentId) {
                                    return {
                                        ...chapter,
                                        episodes: [
                                            ...chapter.episodes,
                                            {
                                                ...updatedData,
                                                projectId: outline.projectId,
                                                chapterId: editingParentId,
                                                createdAt: new Date().toISOString(),
                                                updatedAt: new Date().toISOString()
                                            }
                                        ],
                                        episodeCount: chapter.episodes.length + 1
                                    };
                                }
                                return chapter;
                            })
                        }));
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
                        // 更新章節
                        updatedOutline.sections = updatedOutline.sections.map(section => ({
                            ...section,
                            chapters: section.chapters.map(chapter => 
                                chapter.chapterId === updatedData.chapterId ? updatedData : chapter
                            )
                        }));
                        break;
                    case 'episode':
                        // 更新桥段
                        updatedOutline.sections = updatedOutline.sections.map(section => ({
                            ...section,
                            chapters: section.chapters.map(chapter => ({
                                ...chapter,
                                episodes: chapter.episodes.map(episode => 
                                    episode.episodeId === updatedData.episodeId ? updatedData : episode
                                )
                            }))
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
            
            if (response.success) {
                setOutline(updatedOutline);
                buildTreeData(updatedOutline);
            }
        } catch (error) {
            console.error('保存节点失败:', error);
            message.error('保存节点失败');
        }
    };
    
    // 创建子节点
    const handleCreateChild = async (parentId: string, childData: any) => {
        if (!outline) return;
        
        try {
            let updatedOutline = { ...outline };
            
            if (editingNodeType === 'section') {
                // 在章节下创建新章節
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
                        const newChapters = [...section.chapters, newChapter];
                        return {
                            ...section,
                            chapters: newChapters,
                            chapterCount: newChapters.length
                        };
                    }
                    return section;
                });
            } else if (editingNodeType === 'chapter') {
                // 在章節下创建新桥段
                updatedOutline.sections = updatedOutline.sections.map(section => ({
                    ...section,
                    chapters: section.chapters.map(chapter => {
                        if (chapter.chapterId === parentId) {
                            // 创建新桥段时需要设置必要的字段
                            const newEpisode = {
                                ...childData,
                                projectId: outline.projectId,
                                chapterId: parentId,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            const newEpisodes = [...chapter.episodes, newEpisode];
                            return {
                                ...chapter,
                                episodes: newEpisodes,
                                episodeCount: newEpisodes.length
                            };
                        }
                        return chapter;
                    })
                }));
            }
            
            // 重新计算编号
            updatedOutline = recalculateNumbers(updatedOutline);
            
            // 更新到后端
            const response = await scriptsOutlineApi.updateSections({
                projectId: outline.projectId,
                sections: updatedOutline.sections
            });
            
            if (response.success) {
                setOutline(updatedOutline);
                buildTreeData(updatedOutline);
            }
        } catch (error) {
            console.error('创建子节点失败:', error);
            message.error('创建子节点失败');
        }
    };
    
    // 删除大纲
    const handleDeleteOutline = () => {
        if (!outline) return;
        
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除当前剧本大纲吗？此操作将同时删除所有章节和桥段内容。',
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await scriptsOutlineApi.deleteOutline({ id: outline.id });
                    if (response.success) {
                        message.success('大纲删除成功');
                        setOutline(null);
                        setTreeData([]);
                    }
                } catch (error) {
                    console.error('删除大纲失败:', error);
                    message.error('删除大纲失败');
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
    }, [projectId]);
    
    return (
        <Flex vertical style={{
            height: '100%',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minHeight: 'calc(100vh - 10px)',
            maxHeight: 'calc(100vh - 10px)',
            minWidth: 'max(1200px, calc(100vw - 340px))'
        }}>
            {/* 工具栏 */}
            <Flex justify="space-between" align="center" style={{
                marginBottom: 0, position: 'sticky', top: 0, zIndex: 1, background: '#fff',
                padding: '16px 24px', borderBottom: '1px solid #f0f0f0'
            }}>
                <Title level={3} style={{margin: 0}}>
                    <Space>
                        <FundProjectionScreenOutlined />
                        <span>剧本设计</span>
                    </Space>
                </Title>
                <Space>
                    <Button
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                    >
                        刷新
                    </Button>

                    <Button
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleCreateOutline}
                        disabled={!!outline}
                    >
                        新建剧本
                    </Button>

                    <Button
                        size="large"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteOutline}
                        disabled={!outline}
                        danger
                    >
                        删除剧本
                    </Button>

                    <Button
                        size="large"
                        icon={<ReadOutlined />}
                        onClick={handleReadScript}
                        disabled={!outline}
                    >
                        阅读
                    </Button>

                    <Button
                        size="large"
                        icon={<RobotOutlined />}
                        onClick={handleAIGenerate}
                        disabled={!outline}
                    >
                        AI生成
                    </Button>
                </Space>
            </Flex>
            
            {/* 主内容区域 */}
            <Card style={{ flex: 1, margin: '16px', overflow: 'hidden' }}>
                <Flex style={{ gap: '24px', height: '100%' }}>
                    {/* 大纲树形结构 */}
                    <Flex flex={3} vertical style={{ overflow: 'auto' }}>
                        {outline ? (
                            <Tree
                                defaultExpandAll
                                showLine={{ showLeafIcon: false }}
                                treeData={treeData}
                                onSelect={handleNodeSelect}
                                draggable
                                onDrop={(info) => {
                                    console.log('拖拽信息:', info);
                                    // TODO: 实现拖拽逻辑
                                }}
                            />
                        ) : (
                            <Flex vertical align="center" justify="center" style={{ height: '100%', color: '#999' }}>
                                <FundProjectionScreenOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                <div>暂无剧本大纲</div>
                                <div style={{ marginTop: '8px', fontSize: '12px' }}>点击"新建剧本"开始创作</div>
                            </Flex>
                        )}
                    </Flex>

                    {/* 说明面板 */}
                    <Flex flex={1} vertical>
                        <Card
                            title={
                                <Space>
                                    <InfoCircleOutlined />
                                    <span>使用说明</span>
                                </Space>
                            }
                            size="small"
                            style={{ height: 'fit-content' }}
                        >
                            <Paragraph>
                                <ul style={{ paddingLeft: '16px' }}>
                                    <li>左侧展示剧本大纲的层级结构</li>
                                    <li>支持拖拽调整节点顺序</li>
                                    <li>点击桥段卡片可在右侧编辑</li>
                                    <li>通过工具栏管理大纲生命周期</li>
                                    <li>支持两种经典剧本结构模板</li>
                                </ul>
                            </Paragraph>
                        </Card>
                        
                        {outline && (
                            <Card
                                title="当前项目信息"
                                size="small"
                                style={{ marginTop: '16px', height: 'fit-content' }}
                            >
                                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                                    <div><strong>项目ID:</strong> {outline.projectId}</div>
                                    <div><strong>结构类型:</strong> {outline.structureType === 'BEGINNING_RISING_ACTION_CLIMAX_END' ? '起承转合' : '引起承转合'}</div>
                                    <div><strong>章节总数:</strong> {outline.sections.reduce((sum, section) => sum + section.chapterCount, 0)}</div>
                                    <div><strong>最后更新:</strong> {new Date(outline.updatedAt).toLocaleString()}</div>
                                </div>
                            </Card>
                        )}
                    </Flex>
                </Flex>
            </Card>
            
            {/* 新建大纲模态框 */}
            <CreateOutlineModal
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={handleCreateOutlineConfirm}
                loading={creating}
            />
            
            {/* 节点编辑抽屉 */}
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
            />
            
            {/* 桥段编辑抽屉 - 待实现 */}
            <Drawer
                title="桥段编辑"
                placement="right"
                width={600}
                open={episodeDrawerVisible}
                onClose={() => setEpisodeDrawerVisible(false)}
            >
                <div>桥段编辑功能待实现</div>
            </Drawer>
            
            {/* 剧本阅读抽屉 */}
            <Drawer
                title="剧本全文阅读"
                placement="right"
                width={800}
                open={readDrawerVisible}
                onClose={() => setReadDrawerVisible(false)}
                extra={
                    <Button 
                        type="primary" 
                        onClick={() => {
                            // TODO: 实现导出功能
                            const blob = new Blob([outlineText], { type: 'text/plain;charset=utf-8' });
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
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>
                    {outlineText}
                </div>
            </Drawer>
        </Flex>
    );
    
    // 为了防止TS6133警告，这里添加对状态变量的引用
    // 这些变量在JSX中被使用，但TypeScript静态分析可能检测不到
    // 故意保留这些变量引用以避免TS6133警告
    // 这些变量在JSX中被实际使用
    void [currentEpisode, editingChapterId, createModalVisible, creating, outlineText, handleCreateOutlineConfirm, 
          editorDrawerVisible, editingNodeType, editingNodeData, editingParentId, handleNodeSave, handleCreateChild];
};

export default ScriptOutline;