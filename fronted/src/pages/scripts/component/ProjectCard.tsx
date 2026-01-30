import React, {useState} from 'react';
import {Card, Typography, Tag, Button, Drawer, Form, Input, Select, Divider} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {ScriptProject, ProjectStatus} from '../../../api/types/project-types';
import {projectApi} from '../../../api/service/ai-scripts';

const {Title, Text} = Typography;

interface ProjectCardProps {
    project: ScriptProject;
    operationLoading: boolean;
    onClick: () => void;
    onDelete: (id: string, projectName: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
                                                     project,
                                                     operationLoading,
                                                     onClick,
                                                     onDelete
                                                 }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(project.id!, project.title || '未命名项目');
    };

    const showDrawer = () => {
        form.setFieldsValue({
            id: project.id,
            title: project.title,
            description: project.description,
            status: project.status,
            theme: project.theme,
            summary: project.summary,
        });
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleUpdate = async (values: any) => {
        setUpdateLoading(true);
        try {
            await projectApi.updateProject(project.id!, {
                title: values.title,
                description: values.description,
                status: values.status,
            });
            // 关闭抽屉并刷新数据
            setDrawerVisible(false);
        } catch (error) {
            console.error('更新项目失败:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <Card
            hoverable
            style={{
                height: 340,
                width: 320,
                display: 'flex',
                flexDirection: 'column',
                padding: 16
            }}
            onClick={onClick}
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
                        height: 300,
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


                <div style={{borderTop: '1px solid #eee', paddingTop: 10, marginTop: 'auto'}}>
                    <Text type="secondary" style={{fontSize: '12px'}}>
                        更新时间: {new Date(project.updatedAt || project.createdAt || '').toLocaleString()}
                    </Text>
                </div>

                <div style={{marginTop: 10, display: 'flex', gap: 80}}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            showDrawer();
                        }}
                    >
                        编辑
                    </Button>

                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined/>}
                        loading={operationLoading}
                        onClick={handleDeleteClick}
                    >
                        {operationLoading ? '...' : '删除'}
                    </Button>
                </div>

                <Drawer
                    title={`编辑项目: ${project.title || '未命名项目'}`}
                    width={700}
                    onClose={closeDrawer}
                    open={drawerVisible}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button onClick={closeDrawer} style={{marginRight: 8}}>
                                取消
                            </Button>
                            <Button onClick={() => form.submit()} type="primary" loading={updateLoading}>
                                保存
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        initialValues={{
                            title: project.title,
                            description: project.description,
                            status: project.status,
                        }}
                    >
                        <Form.Item name="id" label="项目ID">
                            <Input disabled value={`${project.id}`}/>
                        </Form.Item>

                        <Form.Item name="title" label="标题" rules={[{required: true, message: '请输入标题'}]}>
                            <Input placeholder="请输入项目标题"/>
                        </Form.Item>

                        <Form.Item name="description" label="描述">
                            <Input.TextArea rows={4} placeholder="请输入项目描述"/>
                        </Form.Item>

                        <Form.Item name="status" label="状态" rules={[{required: true, message: '请选择状态'}]}>
                            <Select placeholder="请选择项目状态">
                                <Select.Option value={ProjectStatus.CREATED}>已创建</Select.Option>
                                <Select.Option value={ProjectStatus.DRAFT}>草稿</Select.Option>
                                <Select.Option value={ProjectStatus.IN_PROGRESS}>进行中</Select.Option>
                                <Select.Option value={ProjectStatus.REVIEW}>审核中</Select.Option>
                                <Select.Option value={ProjectStatus.COMPLETED}>已完成</Select.Option>
                                <Select.Option value={ProjectStatus.ARCHIVED}>已归档</Select.Option>
                                <Select.Option value={ProjectStatus.DELETED}>已删除</Select.Option>
                            </Select>
                        </Form.Item>

                        <Divider orientation="horizontal">只读信息</Divider>
                        <Form.Item label="主题背景">
                            <Input disabled value={project.theme || '暂无'} placeholder="需要编辑请前往剧本设计"/>
                        </Form.Item>

                        <Form.Item label="剧情梗概">
                            <Input.TextArea
                                rows={4}
                                disabled
                                value={project.summary || '暂无'}
                                placeholder="需要编辑请前往剧本设计"
                            />
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        </Card>
    );
};

export default ProjectCard;