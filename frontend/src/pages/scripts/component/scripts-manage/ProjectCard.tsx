import React from 'react';
import {Avatar, Button, Card, Input, Space, Typography} from 'antd';
import {ArrowRightOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {ScriptProject} from '@/api/types/project-types.ts';

const {Title, Text} = Typography;

export interface ProjectCardProps {
    project: ScriptProject;
    disabled: boolean;
    onEnter: (project: ScriptProject) => void;
    onDelete: (project: ScriptProject) => void;
    onRename: (project: ScriptProject, nextTitle: string) => Promise<string | null>;
    activeAction: 'delete' | 'rename' | null;
}

const getDisplayTime = (project: ScriptProject) => {
    const source = project.updatedAt || project.createdAt;
    if (!source) {
        return '暂无时间';
    }
    const date = new Date(source);
    if (Number.isNaN(date.getTime())) {
        return '暂无时间';
    }
    return date.toLocaleString();
};

const getInitials = (name: string) => {
    const safeName = name.trim();
    if (!safeName) {
        return 'AI';
    }
    return safeName.slice(0, 2).toUpperCase();
};

const ProjectCard: React.FC<ProjectCardProps> = ({project, disabled, onEnter, onDelete, onRename, activeAction}) => {
    const [editing, setEditing] = React.useState(false);
    const [draftName, setDraftName] = React.useState(project.title || '');
    const [renameError, setRenameError] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setDraftName(project.title || '');
        if (!editing) {
            setRenameError('');
        }
    }, [editing, project.title]);

    React.useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editing]);

    const handleStartEdit = () => {
        setEditing(true);
        setRenameError('');
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setSaving(false);
        setRenameError('');
        setDraftName(project.title || '');
    };

    const submitRename = async () => {
        if (saving || !project.id) {
            return;
        }
        const normalized = draftName.trim();
        if (!normalized) {
            setRenameError('项目名称不能为空');
            return;
        }
        setSaving(true);
        setRenameError('');
        const error = await onRename(project, normalized);
        if (error) {
            setRenameError(error);
            setSaving(false);
            return;
        }
        setSaving(false);
        setEditing(false);
    };

    return (
        <Card className="workspace-project-card" hoverable>
            <div className="workspace-project-cover"/>
            <div className="workspace-project-body">
                <Title level={4} className="workspace-project-title">
                    {editing ? (
                        <Input
                            ref={inputRef}
                            value={draftName}
                            onChange={(event) => {
                                setDraftName(event.target.value);
                                if (renameError) {
                                    setRenameError('');
                                }
                            }}
                            onPressEnter={() => {
                                void submitRename();
                            }}
                            onBlur={() => {
                                void submitRename();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    event.preventDefault();
                                    handleCancelEdit();
                                }
                            }}
                            status={renameError ? 'error' : undefined}
                            maxLength={50}
                            disabled={disabled || saving}
                            aria-label="项目名称输入框"
                        />
                    ) : (project.title || '未命名项目')}
                </Title>
                <Text type="secondary" className="workspace-project-time">
                    更新时间：{getDisplayTime(project)}
                </Text>
                {renameError && (
                    <Text type="danger" className="workspace-project-error">
                        {renameError}
                    </Text>
                )}
                <Space size={0} className="workspace-project-members">
                    <Avatar className="workspace-member-avatar">{getInitials(project.title)}</Avatar>
                    <Avatar className="workspace-member-avatar">UI</Avatar>
                    <Avatar className="workspace-member-avatar">DEV</Avatar>
                </Space>
                <div className="workspace-project-actions">
                    {editing ? (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined/>}
                                disabled={disabled || saving || !project.id}
                                loading={activeAction === 'rename' || saving}
                                onClick={() => {
                                    void submitRename();
                                }}
                                className="workspace-project-action-btn"
                            >
                                保存
                            </Button>
                            <Button
                                icon={<CloseOutlined/>}
                                disabled={disabled || saving}
                                onClick={handleCancelEdit}
                                className="workspace-project-action-btn"
                            >
                                取消
                            </Button>
                            <Button
                                type="default"
                                icon={<ArrowRightOutlined/>}
                                disabled
                                className="workspace-project-action-btn"
                            >
                                进入项目
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                icon={<ArrowRightOutlined/>}
                                disabled={disabled || !project.id}
                                onClick={() => onEnter(project)}
                                className="workspace-project-action-btn"
                            >
                                进入项目
                            </Button>
                            <Button
                                icon={<EditOutlined/>}
                                disabled={disabled || !project.id}
                                loading={activeAction === 'rename'}
                                onClick={handleStartEdit}
                                className="workspace-project-action-btn"
                            >
                                重命名
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined/>}
                                disabled={disabled || !project.id}
                                loading={activeAction === 'delete'}
                                onClick={() => onDelete(project)}
                                className="workspace-project-action-btn"
                            >
                                删除
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default React.memo(ProjectCard);
