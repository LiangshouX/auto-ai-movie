import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ApiResponse} from '@/api/request.ts';
import {projectApi} from '@/api/service/scripts-project.ts';
import {CreateScriptProjectData, ProjectStatus, ScriptProject} from '@/api/types/project-types.ts';
import {Button, Card, Form, message, Skeleton, Space} from 'antd';
import {useNavigate} from 'react-router-dom';

import '../../style/ScriptManagerStyle.css';
import ProjectCard from './ProjectCard.tsx';
import ErrorMessage from './ErrorMessage.tsx';
import EmptyState from './EmptyState.tsx';
import CreateProjectModal from './CreateProjectModal.tsx';
import BaseLayout from '../../layout/BaseLayout.tsx';
import AppHeader from '../../layout/AppHeader.tsx';
import {workspaceStore} from '@/store/workspace-store.ts';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
    return typeof value === 'object' && value !== null;
};

const readString = (value: unknown) => {
    return typeof value === 'string' ? value : '';
};

const mapStatus = (value: unknown): ProjectStatus => {
    const candidate = readString(value);
    const statuses = Object.values(ProjectStatus);
    return statuses.includes(candidate as ProjectStatus) ? candidate as ProjectStatus : ProjectStatus.DRAFT;
};

const mapProject = (value: unknown): ScriptProject => {
    if (!isRecord(value)) {
        return {
            id: null,
            title: '未命名项目',
            description: '',
            theme: '',
            summary: '',
            status: ProjectStatus.DRAFT,
            authorId: null,
            createdAt: null,
            updatedAt: null
        };
    }

    const id = readString(value.id) || readString(value._id);

    return {
        id: id || null,
        title: readString(value.title) || readString(value.name) || readString(value.projectName) || '未命名项目',
        description: readString(value.description) || readString(value.desc),
        theme: readString(value.theme) || readString(value.projectTheme),
        summary: readString(value.summary) || readString(value.projectSummary),
        status: mapStatus(value.status || value.projectStatus),
        authorId: readString(value.authorId) || readString(value.userId) || readString(value.creatorId) || null,
        createdAt: readString(value.createdAt) || readString(value.created_at) || readString(value.createTime) || null,
        updatedAt: readString(value.updatedAt) || readString(value.updated_at) || readString(value.updateTime) || null
    };
};

const pickProjectArray = (payload: unknown): unknown[] => {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (!isRecord(payload)) {
        return [];
    }
    if (Array.isArray(payload.items)) {
        return payload.items;
    }
    if (Array.isArray(payload.data)) {
        return payload.data;
    }
    if (isRecord(payload.data) && Array.isArray(payload.data.items)) {
        return payload.data.items;
    }
    if (isRecord(payload.data) && Array.isArray(payload.data.data)) {
        return payload.data.data;
    }
    return [];
};

const getFriendlyError = (input: unknown) => {
    if (isRecord(input) && typeof input.message === 'string') {
        const lowerMessage = input.message.toLowerCase();
        if (lowerMessage.includes('timeout')) {
            return '网络超时，请检查网络后重试';
        }
        return input.message;
    }
    if (typeof input === 'string') {
        if (input.toLowerCase().includes('timeout')) {
            return '网络超时，请检查网络后重试';
        }
        return input;
    }
    return '获取项目列表失败，请稍后重试';
};

const ScriptManager = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ScriptProject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [newProjectDescription, setNewProjectDescription] = useState<string>('');
    const [operationLoading, setOperationLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await projectApi.getAllProjects() as ApiResponse<unknown>;
            if (!response.success) {
                setProjects([]);
                setError(getFriendlyError(response.message));
                return;
            }
            const projectList = pickProjectArray(response.data);
            const safeList = Array.isArray(projectList) ? projectList : [];
            setProjects(safeList.map(mapProject));
        } catch (err: unknown) {
            setProjects([]);
            setError(getFriendlyError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProjects();
    }, [fetchProjects]);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            setError('请输入项目名称');
            return;
        }

        setOperationLoading(true);
        setError(null);

        try {
            const newProject: CreateScriptProjectData = {
                title: newProjectName,
                description: newProjectDescription,
                status: ProjectStatus.DRAFT
            };
            const response = await projectApi.createProject(newProject) as ApiResponse<unknown>;
            if (!response.success) {
                const errorMessage = getFriendlyError(response.message || '创建项目失败');
                setError(errorMessage);
                message.error(errorMessage);
                return;
            }
            setNewProjectName('');
            setNewProjectDescription('');
            setShowCreateModal(false);
            form.resetFields();
            message.success('项目创建成功！');
            await fetchProjects();
        } catch (err: unknown) {
            const errorMessage = getFriendlyError(err);
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setOperationLoading(false);
        }
    };

    const handleEnterProject = (project: ScriptProject) => {
        if (!project.id) {
            message.warning('当前项目缺少 ID，无法进入');
            return;
        }
        workspaceStore.setCurrentProject(project);
        navigate(`/workspace/${project.id}/script`);
    };

    const filteredProjects = useMemo(() => {
        const normalizedKeyword = searchTerm.trim().toLowerCase();
        const sourceList = Array.isArray(projects) ? projects : [];
        if (!normalizedKeyword) {
            return sourceList;
        }
        return sourceList.filter((project) => {
            const title = (project.title || '').toLowerCase();
            const summary = (project.summary || '').toLowerCase();
            const description = (project.description || '').toLowerCase();
            return title.includes(normalizedKeyword) || summary.includes(normalizedKeyword) || description.includes(normalizedKeyword);
        });
    }, [projects, searchTerm]);

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setError(null);
        form.resetFields();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProjectName(e.target.value);
        if (error && e.target.value.trim()) {
            setError(null);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewProjectDescription(e.target.value);
    };

    const renderSkeletonCards = () => {
        return (
            <div className="workspace-project-grid">
                {Array.from({length: 8}, (_, index) => (
                    <Card key={`skeleton-${index}`} className="workspace-project-card">
                        <Skeleton.Image active style={{width: '100%', height: 120}}/>
                        <Skeleton active paragraph={{rows: 3}} style={{marginTop: 16}}/>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <BaseLayout
            header={
                <AppHeader
                    title="AI 剧本管理"
                    onSearch={setSearchTerm}
                    searchValue={searchTerm}
                    searchPlaceholder="搜索项目..."
                    extra={
                        <Space>
                            <Button
                                type="default"
                                size="large"
                                onClick={fetchProjects}
                                disabled={operationLoading || loading}
                            >
                                刷新
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                    setShowCreateModal(true);
                                    setError(null);
                                }}
                                disabled={operationLoading || loading}
                            >
                                {operationLoading || loading ? '处理中...' : '+ 新建项目'}
                            </Button>
                        </Space>
                    }
                />
            }
        >
            {loading ? (
                renderSkeletonCards()
            ) : error ? (
                <ErrorMessage
                    error={error}
                    onRetry={fetchProjects}
                />
            ) : filteredProjects.length > 0 ? (
                <div className="workspace-project-grid">
                    {(Array.isArray(filteredProjects) ? filteredProjects : []).map((project) => (
                        <ProjectCard
                            key={project.id || `${project.title}-${project.createdAt}`}
                            project={project}
                            disabled={operationLoading}
                            onEnter={handleEnterProject}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    searchTerm={searchTerm}
                    operationLoading={operationLoading}
                    apiLoading={loading}
                    onCreateProject={() => {
                        setShowCreateModal(true);
                        setError(null);
                    }}
                />
            )}

            {/* 创建项目模态框 */}
            <CreateProjectModal
                open={showCreateModal}
                operationLoading={operationLoading}
                apiLoading={loading}
                error={error}
                newProjectName={newProjectName}
                newProjectDescription={newProjectDescription}
                form={form}
                onClose={handleCloseModal}
                onNameChange={handleNameChange}
                onDescriptionChange={handleDescriptionChange}
                onSubmit={handleCreateProject}
            />
        </BaseLayout>
    );
};

export default ScriptManager;
