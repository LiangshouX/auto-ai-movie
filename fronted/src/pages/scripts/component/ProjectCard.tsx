import React from 'react';
import {Card, Typography, Tag, Button} from 'antd';
import {ScriptProject, ProjectStatus} from '../../../api/types/project-types';

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
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(project.id!, project.title || '未命名项目');
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

            <div style={{marginTop: 10}}>
                <Button
                    danger
                    size="small"
                    loading={operationLoading}
                    onClick={handleDeleteClick}
                >
                    {operationLoading ? '...' : '删除'}
                </Button>
            </div>
            </div>
        </Card>
    );
};

export default ProjectCard;