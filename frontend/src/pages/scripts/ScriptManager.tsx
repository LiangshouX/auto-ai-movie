import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useProjectApi} from '../../hooks/useApi';
import {ScriptProject, ProjectStatus, ScriptProjectType} from '../../api/types/project-types';
import {
    Button,
    Input,
    Row,
    Col,
    Form,
    Typography,
    Space,
    message,
    Layout,
    Modal
} from 'antd';

import './style/ScriptManagerStyle.css';
import ProjectCard from './component/scripts-manage/ProjectCard.tsx';
import LoadingSpinner from './component/scripts-manage/LoadingSpinner.tsx';
import ErrorMessage from './component/scripts-manage/ErrorMessage.tsx';
import EmptyState from './component/scripts-manage/EmptyState.tsx';
import CreateProjectModal from './component/scripts-manage/CreateProjectModal.tsx';
import {HomeOutlined} from '@ant-design/icons'

const {Title} = Typography;
const {Search} = Input;
const {Header, Content} = Layout;

const ScriptManager = () => {
    const navigate = useNavigate();
    const {
        loading: apiLoading,
        error: apiError,
        getAllProjects,
        createProject,
        deleteProject
    } = useProjectApi();

    const [projects, setProjects] = useState<ScriptProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [newProjectDescription, setNewProjectDescription] = useState<string>('');
    const [operationLoading, setOperationLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            await getAllProjects(
                (response: any) => {
                    console.log('API Response:', response); // 调试日志

                    // 正确处理API响应数据
                    let projectList;

                    // 检查响应是否是标准API响应格式
                    if (response && typeof response === 'object') {
                        if (Array.isArray(response)) {
                            // 如果直接是数组
                            projectList = response;
                        } else if (response.data && Array.isArray(response.data)) {
                            // 如果是 { data: [...] } 格式
                            projectList = response.data;
                        } else if (response.items && Array.isArray(response.items)) {
                            // 如果是 { items: [...] } 格式
                            projectList = response.items;
                        } else {
                            // 尝试将整个响应作为数组
                            projectList = [];
                        }
                    } else {
                        projectList = [];
                    }

                    console.log('Project List:', projectList); // 调试日志

                    // 映射到ScriptProject类型，使用ScriptProjectType.fromApiResponse辅助函数
                    const mappedProjects = projectList.map((item: any) => {
                        // 优先使用ScriptProjectType.fromApiResponse，如果失败则手动映射
                        try {
                            return ScriptProjectType.fromApiResponse(item);
                        } catch (error) {
                            // 如果fromApiResponse失败，回退到手动映射
                            return {
                                id: item.id || item._id || null,
                                title: item.title || item.name || item.projectName || '未命名项目',
                                description: item.description || item.desc || '',
                                theme: item.theme || item.projectTheme || '',
                                summary: item.summary || item.projectSummary || '',
                                status: item.status || item.projectStatus || ProjectStatus.DRAFT,
                                authorId: item.authorId || item.userId || item.creatorId || null,
                                createdAt: item.createdAt || item.created_at || item.createTime || null,
                                updatedAt: item.updatedAt || item.updated_at || item.updateTime || null
                            };
                        }
                    });

                    console.log('Mapped Projects:', mappedProjects); // 调试日志
                    setProjects(mappedProjects);
                },
                (error: any) => {
                    setError(error.message || '获取项目列表失败');
                }
            );
        } catch (err: any) {
            setError(err.message || '获取项目列表失败');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            setError('请输入项目名称');
            return;
        }

        setOperationLoading(true);
        setError(null);

        try {
            const newProject = {
                title: newProjectName,
                description: newProjectDescription,
                status: 'DRAFT' as ProjectStatus // 使用大写状态值，与ProjectStatus保持一致
            };

            await createProject(
                newProject,
                () => {
                    setNewProjectName('');
                    setNewProjectDescription('');
                    setShowCreateModal(false);
                    form.resetFields(); // 重置表单
                    fetchProjects(); // 重新获取项目列表
                    message.success('项目创建成功！');
                },
                (error: any) => {
                    setError(error.message || '创建项目失败');
                    message.error(error.message || '创建项目失败');
                }
            );
        } catch (err: any) {
            setError(err.message || '创建项目失败');
            message.error(err.message || '创建项目失败');
            console.error('Error creating project:', err);
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDeleteProject = async (id: string, projectName: string) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除项目 "${projectName}" 吗？此操作不可撤销。`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                setOperationLoading(true);
                setError(null);

                try {
                    await deleteProject(
                        id,
                        () => {
                            fetchProjects(); // 重新获取项目列表
                            message.success('项目删除成功！');
                        },
                        (error: any) => {
                            setError(error.message || '删除项目失败');
                            message.error(error.message || '删除项目失败');
                        }
                    );
                } catch (err: any) {
                    setError(err.message || '删除项目失败');
                    message.error(err.message || '删除项目失败');
                    console.error('Error deleting project:', err);
                } finally {
                    setOperationLoading(false);
                }
            }
        });
    };

    // 过滤项目列表
    const filteredProjects = projects.filter(project =>
        (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.summary && project.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    // 处理项目卡片删除事件
    const handleProjectDelete = (id: string, projectName: string) => {
        handleDeleteProject(id, projectName);
    };

    // 处理创建项目模态框关闭
    const handleCloseModal = () => {
        setShowCreateModal(false);
        setError(null);
        form.resetFields();
    };

    // 处理项目名称输入变化
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProjectName(e.target.value);
        if ((error || apiError) && e.target.value.trim()) {
            setError(null);
        }
    };

    // 处理项目描述输入变化
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewProjectDescription(e.target.value);
    };

    // 使用 Ant Design 的 Layout 结构
    return (

        <Layout style={{padding: '24px 0', height: '100vh'}}>
            <Header style={{
                backgroundColor: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px #f0f0f0',
                zIndex: 100,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                justifyContent: 'space-between',
                height: 64,
                top: 0,
                left: 0,
                right: 0,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Space size="large">
                    <Button onClick={() => navigate('/')} type="text" size="large"><HomeOutlined/> 首页</Button>
                    <Title level={2} style={{margin: 0, color: 'rgba(0, 0, 0, 0.88)'}}>AI 剧本项目管理</Title>
                </Space>

                <Space>
                    <Search
                        placeholder="搜索项目..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{width: 300, marginRight: 16}}
                        allowClear
                    />
                    <Button
                        type="default"
                        size="large"
                        onClick={() => {
                            // 刷新项目列表
                            fetchProjects();
                        }}
                        disabled={operationLoading || apiLoading}
                    >
                        刷新
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            setShowCreateModal(true);
                            setError(null); // 清除错误状态
                        }}
                        disabled={operationLoading || apiLoading}
                    >
                        {operationLoading || apiLoading ? '处理中...' : '+ 新建项目'}
                    </Button>
                </Space>
            </Header>

            <Content style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#f9f9f9',
                minHeight: 'calc(100vh - 64px)',
                minWidth: 'max(1500px, calc(100vw - 200px))'
            }}>

                {(loading || apiLoading) ? (
                    <LoadingSpinner/>
                ) : (error || apiError) ? (
                    <ErrorMessage
                        error={error || apiError}
                        onRetry={fetchProjects}
                    />
                ) : filteredProjects.length > 0 ? (
                    <>
                        <div className="card-scroll-container">
                            <Row gutter={[16, 16]} style={{marginBottom: 30, marginTop: 30, width: '100%'}}>
                                {filteredProjects.map((project) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                                        <ProjectCard
                                            project={project}
                                            operationLoading={operationLoading}
                                            // onClick={() => handleProjectClick(project.id!)}
                                            onClick={() => {
                                            }}
                                            onDelete={handleProjectDelete}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                ) : (
                    <EmptyState
                        searchTerm={searchTerm}
                        operationLoading={operationLoading}
                        apiLoading={apiLoading}
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
                    apiLoading={apiLoading}
                    error={error}
                    newProjectName={newProjectName}
                    newProjectDescription={newProjectDescription}
                    form={form}
                    onClose={handleCloseModal}
                    onNameChange={handleNameChange}
                    onDescriptionChange={handleDescriptionChange}
                    onSubmit={handleCreateProject}
                />
            </Content>
        </Layout>

    );
};

export default ScriptManager;