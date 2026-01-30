import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  height?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height = '70vh' }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height
    }}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;