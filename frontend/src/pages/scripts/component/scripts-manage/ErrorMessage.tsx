import React from 'react';
import { Button, Typography } from 'antd';

const { Text } = Typography;

interface ErrorMessageProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <Text type="danger">错误: {error || '未知错误'}</Text>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={onRetry}>重试</Button>
      </div>
    </div>
  );
};

export default ErrorMessage;