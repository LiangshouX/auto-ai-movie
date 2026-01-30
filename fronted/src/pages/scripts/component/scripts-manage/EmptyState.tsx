import React from 'react';
import { Button, Typography, Empty } from 'antd';

const { Title, Text } = Typography;

interface EmptyStateProps {
  searchTerm: string;
  operationLoading: boolean;
  apiLoading: boolean;
  onCreateProject: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchTerm, 
  operationLoading, 
  apiLoading, 
  onCreateProject 
}) => {
  const isLoading = operationLoading || apiLoading;

  return (
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
        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            size="large"
            onClick={onCreateProject}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '+ 新建项目'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;