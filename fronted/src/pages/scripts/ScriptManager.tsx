import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useProjectApi} from '../../hooks/useApi';
import {ScriptProject, ProjectStatus, ScriptProjectType} from '../../api/types/project-types';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Modal,
    Form,
    Typography,
    Space,
    Tag,
    message,
    Spin,
    Empty,
    Layout
} from 'antd';

const {Title, Text} = Typography;
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

    // 使用 Ant Design 的 Layout 结构
    return (
        <Layout>
            <Layout style={{padding: '24px 0',height: '100vh'}}>
                <Header style={{
                    backgroundColor: '#fff',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px #f0f0f0',
                    // zIndex: 100,
                    width: '200%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 64,
                    top: 0,
                    left: 0,
                    right: 0,
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Space size="large">
                        <Button onClick={() => navigate('/')} type="text" size="large">⌂ 首页</Button>
                        <Title level={2} style={{margin: 0, color: 'rgba(0, 0, 0, 0.88)'}}>AI 剧本项目管理</Title>
                    </Space>

                    <Space>
                        <Search
                            placeholder="搜索项目..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // style={{width: 250}}
                            allowClear
                        />
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
                    // overflowY: 'auto',
                    // overflowX: 'auto',
                    padding: 24,
                    display: 'flex',
                    width: '200%',
                    backgroundColor: '#f9f9f9',
                    minHeight: 'calc(100vh - 64px)'
                }}>

                    {(loading || apiLoading) ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '70vh'
                        }}>
                            <Spin size="large"/>
                        </div>
                    ) : error || apiError ? (
                        <div style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
                            <Text type="danger">错误: {error || apiError}</Text>
                            <div style={{marginTop: 16}}>
                                <Button type="primary" onClick={fetchProjects}>重试</Button>
                            </div>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <>
                            <Row gutter={[24, 24]} style={{marginBottom: 30}}>
                                {filteredProjects.map((project) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                                        <Card
                                            hoverable
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            onClick={() => navigate(`/scripts/editor/${project.id}`)}
                                            cover={
                                                <div style={{
                                                    height: 100,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: -5,
                                                        width: 5,
                                                        height: '100%',
                                                        background: 'linear-gradient(to right, #5a67d8, #4c51bf)',
                                                        borderRadius: '0 3px 3px 0'
                                                    }}></div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 5,
                                                        left: 5,
                                                        right: 5,
                                                        bottom: 5,
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: 3
                                                    }}></div>
                                                </div>
                                            }
                                        >
                                            <div style={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 180
                                            }}>
                                                <Title
                                                    level={4}
                                                    style={{
                                                        margin: '0 0 10px 0',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        fontSize: '16px',
                                                        lineHeight: '1.4em'
                                                    }}
                                                >
                                                    {project.title || '未命名项目'}
                                                </Title>
                                                <Text
                                                    style={{
                                                        marginBottom: 10,
                                                        flex: 1,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: '1.4em',
                                                        color: 'rgba(0, 0, 0, 0.65)'
                                                    }}
                                                    ellipsis={{tooltip: project.description}}
                                                >
                                                    {project.description || '暂无描述'}
                                                </Text>
                                                <Tag
                                                    color={
                                                        project.status === ProjectStatus.COMPLETED ? 'green' :
                                                            project.status === ProjectStatus.IN_PROGRESS ? 'blue' :
                                                                project.status === ProjectStatus.ARCHIVED ? 'orange' :
                                                                    'default'
                                                    }
                                                    style={{marginBottom: 10}}
                                                >
                                                    状态: {project.status || '未知'}
                                                </Tag>
                                            </div>

                                            <div style={{borderTop: '1px solid #eee', paddingTop: 10, marginTop: 'auto'}}>
                                                <Text type="secondary" style={{fontSize: '12px'}}>
                                                    更新时间: {new Date(project.updatedAt || project.createdAt || '').toLocaleString()}
                                                </Text>
                                            </div>

                                            <div style={{marginTop: 10}}>
                                                <Button
                                                    danger
                                                    size="small"
                                                    loading={operationLoading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteProject(project.id!, project.title || '未命名项目');
                                                    }}
                                                >
                                                    {operationLoading ? '...' : '删除'}
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    ) : (
                        <div style={{
                            backgroundColor: 'white',
                            padding: '40px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            marginTop: 30
                        }}>
                            <Empty
                                description={
                                    <div>
                                        <Title level={3}>暂无剧本项目</Title>
                                        <Text
                                            type="secondary">{searchTerm ? '没有找到匹配的项目' : '点击新建按钮创建您的第一个AI剧本项目'}</Text>
                                    </div>
                                }
                            />
                            {!searchTerm && (
                                <div style={{marginTop: 16}}>
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
                                </div>
                            )}
                        </div>
                    )}

                    {/* 创建项目模态框 */}
                    <Modal
                        title="创建新项目"
                        open={showCreateModal}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setError(null); // 关闭模态框时清除错误状态
                            form.resetFields(); // 重置表单
                        }}
                        footer={[
                            <Button
                                key="back"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setError(null); // 关闭模态框时清除错误状态
                                    form.resetFields(); // 重置表单
                                }}
                                disabled={operationLoading || apiLoading}
                            >
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleCreateProject}
                                loading={operationLoading || apiLoading}
                                disabled={!newProjectName.trim()}
                            >
                                {operationLoading || apiLoading ? '创建中...' : '创建'}
                            </Button>,
                        ]}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleCreateProject}
                        >
                            {(error || apiError) && (
                                <div style={{
                                    padding: 10,
                                    backgroundColor: '#fff6f6',
                                    border: '1px solid #ffccc7',
                                    borderRadius: 4,
                                    marginBottom: 16
                                }}>
                                    <Text type="danger">错误: {error || apiError}</Text>
                                </div>
                            )}

                            <Form.Item
                                label="项目名称"
                                name="projectName"
                                rules={[{required: true, message: '请输入项目名称!'}]}
                            >
                                <Input
                                    value={newProjectName}
                                    onChange={(e) => {
                                        setNewProjectName(e.target.value);
                                        if ((error || apiError) && newProjectName.trim()) {
                                            setError(null); // 输入变化时清除错误状态
                                        }
                                    }}
                                    placeholder="输入项目名称"
                                    disabled={operationLoading || apiLoading}
                                />
                            </Form.Item>

                            <Form.Item
                                label="项目描述"
                                name="projectDescription"
                            >
                                <Input.TextArea
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    placeholder="输入项目描述"
                                    rows={4}
                                    disabled={operationLoading || apiLoading}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Content>
            </Layout>
        </Layout>

    );
};

export default ScriptManager;