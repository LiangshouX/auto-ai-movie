import React, {useState, useEffect, useRef} from 'react';
import {Input, Button, Space, message} from 'antd';
import type {InputRef} from 'antd';
import {CheckOutlined, CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {scriptsEpisodeApi} from '@/api/service/scripts-episode';
import type {CreateScriptEpisodeData} from '@/api/types/scripts-episode-types';

interface InlineEditorProps {
    visible: boolean;
    nodeType: 'section' | 'chapter' | 'episode';
    parentId: string;
    projectId: string;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    onCreateChild?: (parentId: string, childData: any) => Promise<void>;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
    visible,
    nodeType,
    parentId,
    projectId,
    onSave,
    onCancel,
    onCreateChild
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (visible) {
            setTitle('');
            setDescription('');
            // 自动聚焦到第一个输入框
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [visible]);

    const handleSave = async () => {
        if (!title.trim()) {
            message.warning(`请输入${getNodeTypeName()}标题`);
            return;
        }

        setSaving(true);
        try {
            let newData: any;

            switch (nodeType) {
                case 'section':
                    newData = {
                        sectionTitle: title.trim(),
                        description: description.trim(),
                        sequence: 0, // 后续会重新计算
                        chapterCount: 0,
                        chapters: []
                    };
                    break;
                case 'chapter':
                    newData = {
                        chapterTitle: title.trim(),
                        chapterSummary: description.trim(),
                        chapterNumber: 0, // 后续会重新计算
                        episodeCount: 0,
                        wordCount: 0,
                        episodes: []
                    };
                    break;
                case 'episode':
                    // 对于桥段，需要调用专门的API
                    const episodeData: CreateScriptEpisodeData = {
                        projectId,
                        chapterId: parentId,
                        episodeNumber: 0, // 后续会重新计算
                        episodeTitle: title.trim(),
                        episodeContent: '',
                        wordCount: 0
                    };
                    
                    const response = await scriptsEpisodeApi.createEpisode(episodeData);
                    if (response.success && response.data) {
                        newData = {
                            episodeId: (response.data as any).id,
                            episodeTitle: title.trim(),
                            episodeNumber: 0, // 后续会重新计算
                            projectId,
                            chapterId: parentId
                        };
                    } else {
                        message.error('创建桥段失败');
                    }
                    break;
            }

            await onSave(newData);
            message.success(`${getNodeTypeName()}创建成功`);
            
            // 如果有创建子节点的需求，处理它
            if (onCreateChild && description.trim()) {
                const childData = {
                    [nodeType === 'section' ? 'chapterTitle' : 'episodeTitle']: description.trim(),
                    ...(nodeType === 'section' ? { chapterSummary: '' } : {})
                };
                await onCreateChild(parentId, childData);
            }
            
            onCancel(); // 关闭编辑器
        } catch (error) {
            console.error('保存失败:', error);
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const getNodeTypeName = () => {
        switch (nodeType) {
            case 'section': return '章节';
            case 'chapter': return '章节';
            case 'episode': return '桥段';
            default: return '节点';
        }
    };

    if (!visible) return null;

    return (
        <div style={{
            padding: '12px',
            border: '1px solid #1890ff',
            borderRadius: '6px',
            backgroundColor: '#f0f7ff',
            marginBottom: '8px',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
        }}>
            <Space orientation="vertical" style={{width: '100%'}} size="small">
                <Input
                    ref={inputRef}
                    placeholder={`请输入${getNodeTypeName()}标题`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onPressEnter={handleKeyPress}
                    autoFocus
                />
                
                {(nodeType === 'section' || nodeType === 'chapter') && (
                    <Input.TextArea
                        placeholder={`请输入${nodeType === 'section' ? '章节描述' : '章节简介'}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoSize={{minRows: 2, maxRows: 4}}
                        onPressEnter={handleKeyPress}
                    />
                )}

                <Space>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleSave}
                        loading={saving}
                        size="small"
                    >
                        确定
                    </Button>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={onCancel}
                        size="small"
                    >
                        取消
                    </Button>
                    {onCreateChild && (
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => {
                                // 这里可以扩展为同时创建子节点的逻辑
                                handleSave();
                            }}
                            size="small"
                        >
                            并新增子节点
                        </Button>
                    )}
                </Space>
            </Space>
        </div>
    );
};

export default InlineEditor;