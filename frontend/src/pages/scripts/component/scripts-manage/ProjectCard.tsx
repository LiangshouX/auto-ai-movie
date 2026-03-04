import React from 'react';
import {Avatar, Button, Card, Space, Typography} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import {ScriptProject} from '@/api/types/project-types.ts';

const {Title, Text} = Typography;

export interface ProjectCardProps {
    project: ScriptProject;
    disabled: boolean;
    onEnter: (project: ScriptProject) => void;
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

const ProjectCard: React.FC<ProjectCardProps> = ({project, disabled, onEnter}) => {
    return (
        <Card className="workspace-project-card" hoverable>
            <div className="workspace-project-cover"/>
            <div className="workspace-project-body">
                <Title level={4} className="workspace-project-title">
                    {project.title || '未命名项目'}
                </Title>
                <Text type="secondary" className="workspace-project-time">
                    更新时间：{getDisplayTime(project)}
                </Text>
                <Space size={0} className="workspace-project-members">
                    <Avatar className="workspace-member-avatar">{getInitials(project.title)}</Avatar>
                    <Avatar className="workspace-member-avatar">UI</Avatar>
                    <Avatar className="workspace-member-avatar">DEV</Avatar>
                </Space>
                <Button
                    type="primary"
                    icon={<ArrowRightOutlined/>}
                    disabled={disabled || !project.id}
                    onClick={() => onEnter(project)}
                    block
                >
                    进入项目
                </Button>
            </div>
        </Card>
    );
};

export default React.memo(ProjectCard);
