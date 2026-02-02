import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, message, Space, Tabs} from 'antd';
import {CloseOutlined, PlusOutlined, SaveOutlined, EditOutlined} from '@ant-design/icons';
import {createDefaultChapter, createDefaultEpisode} from '../utils/outline-utils';
import {scriptsEpisodeApi} from '@/api/service/scripts-episode';
import type {ScriptEpisodeDTO} from '@/api/types/scripts-episode-types';

interface NodeEditorDrawerProps {
    open: boolean;
    onClose: () => void;
    nodeType: 'section' | 'chapter' | 'episode' | null;
    nodeData: any;
    parentId?: string; // 父节点ID，用于创建子节点
    onSave: (updatedData: any, newNode?: any) => void;
    onCreateChild?: (parentId: string, childData: any) => void;
}

const NodeEditorDrawer: React.FC<NodeEditorDrawerProps> = (
    {
        open,
        onClose,
        nodeType,
        nodeData,
        parentId,
        onSave,
        onCreateChild
    }
) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [episodeContent, setEpisodeContent] = useState('');
    const [wordCount, setWordCount] = useState(0);

    // 设置表单初始值
    useEffect(() => {
        if (open) {
            if (nodeData) {
                switch (nodeType) {
                    case 'section':
                        form.setFieldsValue({
                            sectionTitle: nodeData.sectionTitle,
                            description: nodeData.description
                        });
                        break;
                    case 'chapter':
                        form.setFieldsValue({
                            chapterTitle: nodeData.chapterTitle,
                            chapterSummary: nodeData.chapterSummary
                        });
                        break;
                    case 'episode':
                        form.setFieldsValue({
                            episodeTitle: nodeData.episodeTitle
                        });
                        // 加载episode详细内容
                        loadEpisodeContent(nodeData.episodeId);
                        break;
                }
            } else {
                // 新建节点时清空表单
                form.resetFields();
                setEpisodeContent('');
                setWordCount(0);
                setActiveTab('basic');
            }
        }
    }, [open, nodeData, nodeType, form]);

    const getTitle = () => {
        if (!nodeType) return '节点编辑';

        const titles = {
            section: nodeData ? '编辑章节' : '新增章节',
            chapter: nodeData ? '编辑章节' : '新增章节',
            episode: nodeData ? '编辑桥段' : '新增桥段'
        };
        return titles[nodeType];
    };

    // 加载episode详细内容
    const loadEpisodeContent = async (episodeId: string) => {
        if (!episodeId) return;

        try {
            const response = await scriptsEpisodeApi.getEpisodeById({id: episodeId});
            if (response.success && response.data) {
                const episode = response.data as ScriptEpisodeDTO;
                setEpisodeContent(episode.episodeContent);
                setWordCount(episode.wordCount);
            }
        } catch (error) {
            console.error('加载桥段内容失败:', error);
        }
    };

    // 计算字数
    const calculateWordCount = (content: string): number => {
        return content.replace(/\s+/g, '').length;
    };

    // 处理内容变化
    const handleContentChange = (content: string) => {
        setEpisodeContent(content);
        setWordCount(calculateWordCount(content));
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            let updatedData;

            switch (nodeType) {
                case 'section':
                    updatedData = {
                        ...nodeData,
                        sectionTitle: values.sectionTitle,
                        description: values.description,
                        updatedAt: new Date().toISOString()
                    };
                    break;
                case 'chapter':
                    updatedData = {
                        ...nodeData,
                        chapterTitle: values.chapterTitle,
                        chapterSummary: values.chapterSummary,
                        updatedAt: new Date().toISOString()
                    };
                    break;
                case 'episode':
                    updatedData = {
                        ...nodeData,
                        episodeTitle: values.episodeTitle,
                        updatedAt: new Date().toISOString()
                    };

                    // 同时更新episode内容
                    if (nodeData?.episodeId) {
                        try {
                            await scriptsEpisodeApi.updateEpisode({
                                id: nodeData.episodeId,
                                episodeTitle: values.episodeTitle,
                                episodeContent: episodeContent,
                                wordCount: wordCount
                            });
                        } catch (error) {
                            console.error('更新桥段内容失败:', error);
                            message.error('更新桥段内容失败');
                            setLoading(false);
                            return;
                        }
                    }
                    break;
            }

            onSave(updatedData);
            message.success('保存成功');
            onClose();
        } catch (error) {
            console.error('保存失败:', error);
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChild = async () => {
        if (!parentId || !onCreateChild) return;

        try {
            const values = await form.validateFields();
            setLoading(true);

            let childData;

            switch (nodeType) {
                case 'section':
                    // 在章节下创建新章節
                    childData = createDefaultChapter(parentId);
                    childData.chapterTitle = values.newChapterTitle || '新章节';
                    childData.chapterSummary = values.newChapterSummary || '章节简介';
                    break;
                case 'chapter':
                    // 在章節下创建新桥段
                    childData = createDefaultEpisode('', parentId);
                    childData.episodeTitle = values.newEpisodeTitle || '新桥段';
                    break;
            }

            if (childData) {
                onCreateChild(parentId, childData);
                message.success('子节点创建成功');
                onClose();
            }
        } catch (error) {
            console.error('创建子节点失败:', error);
            message.error('创建子节点失败');
        } finally {
            setLoading(false);
        }
    };

    const renderBasicFields = () => {
        switch (nodeType) {
            case 'section':
                return (
                    <>
                        <Form.Item
                            name="sectionTitle"
                            label="章节标题"
                            rules={[{required: true, message: '请输入章节标题'}]}
                        >
                            <Input placeholder="请输入章节标题"/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="章节描述"
                            rules={[{required: true, message: '请输入章节描述'}]}
                        >
                            <Input.TextArea
                                placeholder="请输入章节描述"
                                autoSize={{minRows: 3, maxRows: 6}}
                            />
                        </Form.Item>

                        {nodeData && onCreateChild && (
                            <>
                                <div style={{
                                    margin: '24px 0 16px 0',
                                    padding: '8px 0',
                                    borderTop: '1px solid #f0f0f0',
                                    fontWeight: 'bold',
                                    color: '#1890ff'
                                }}>
                                    新增子节点
                                </div>
                                <Form.Item
                                    name="newChapterTitle"
                                    label="新章节标题"
                                >
                                    <Input placeholder="请输入新章节标题"/>
                                </Form.Item>
                                <Form.Item
                                    name="newChapterSummary"
                                    label="新章节描述"
                                >
                                    <Input.TextArea
                                        placeholder="请输入新章节描述"
                                        autoSize={{minRows: 2, maxRows: 4}}
                                    />
                                </Form.Item>
                            </>
                        )}
                    </>
                );

            case 'chapter':
                return (
                    <>
                        <Form.Item
                            name="chapterTitle"
                            label="章节标题"
                            rules={[{required: true, message: '请输入章节标题'}]}
                        >
                            <Input placeholder="请输入章节标题"/>
                        </Form.Item>
                        <Form.Item
                            name="chapterSummary"
                            label="章节简介"
                            rules={[{required: true, message: '请输入章节简介'}]}
                        >
                            <Input.TextArea
                                placeholder="请输入章节简介"
                                autoSize={{minRows: 3, maxRows: 6}}
                            />
                        </Form.Item>

                        {nodeData && onCreateChild && (
                            <>
                                <div style={{
                                    margin: '24px 0 16px 0',
                                    padding: '8px 0',
                                    borderTop: '1px solid #f0f0f0',
                                    fontWeight: 'bold',
                                    color: '#1890ff'
                                }}>
                                    新增子节点
                                </div>
                                <Form.Item
                                    name="newEpisodeTitle"
                                    label="新桥段标题"
                                >
                                    <Input placeholder="请输入新桥段标题"/>
                                </Form.Item>
                            </>
                        )}
                    </>
                );

            case 'episode':
                return (
                    <>
                        <Form.Item
                            name="episodeTitle"
                            label="桥段标题"
                            rules={[{required: true, message: '请输入桥段标题'}]}
                        >
                            <Input placeholder="请输入桥段标题"/>
                        </Form.Item>
                        {nodeData && (
                            <div style={{marginBottom: '16px', fontSize: '12px', color: '#666'}}>
                                字数统计: {wordCount} 字
                            </div>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    const renderContentFields = () => {
        if (nodeType !== 'episode') return null;

        return (
            <Form.Item label="桥段内容">
                <Input.TextArea
                    value={episodeContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="请输入桥段内容..."
                    autoSize={{minRows: 10, maxRows: 20}}
                    style={{fontFamily: 'monospace'}}
                />
            </Form.Item>
        );
    };

    const renderTabs = () => {
        if (nodeType !== 'episode') {
            return renderBasicFields();
        }

        return (
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'basic',
                        label: '基本信息',
                        children: renderBasicFields()
                    },
                    {
                        key: 'content',
                        label: '内容编辑',
                        children: renderContentFields()
                    }
                ]}
            />
        );
    };

    return (
        <Drawer
            title={
                <Space>
                    <EditOutlined/>
                    <span>{getTitle()}</span>
                </Space>
            }
            placement="right"
            width={nodeType === 'episode' ? 700 : 500}
            open={open}
            onClose={onClose}
            destroyOnClose
            extra={
                <Space>
                    <Button
                        icon={<CloseOutlined/>}
                        onClick={onClose}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined/>}
                        onClick={handleSave}
                        loading={loading}
                    >
                        保存
                    </Button>
                    {nodeData && onCreateChild && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={handleCreateChild}
                            loading={loading}
                        >
                            保存并新增子节点
                        </Button>
                    )}
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                {renderTabs()}
            </Form>
        </Drawer>
    );
};

export default NodeEditorDrawer;