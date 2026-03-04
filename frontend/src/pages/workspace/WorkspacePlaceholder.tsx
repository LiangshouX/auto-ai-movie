import {Card, Typography} from 'antd';

const {Title, Text} = Typography;

interface WorkspacePlaceholderProps {
    title: string;
}

const WorkspacePlaceholder = ({title}: WorkspacePlaceholderProps) => {
    return (
        <Card>
            <Title level={3}>{title}</Title>
            <Text type="secondary">该模块正在建设中，敬请期待。</Text>
        </Card>
    );
};

export default WorkspacePlaceholder;
