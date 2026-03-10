import React from 'react';
import { Button, Result, Typography } from 'antd';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('ErrorBoundary caught an error:', error);

  let title = '出错了';
  let subTitle = '抱歉，发生了一个意外错误。';
  let extra = (
    <Button type="primary" onClick={() => window.location.reload()}>
      刷新页面
    </Button>
  );

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404';
      subTitle = '抱歉，您访问的页面不存在。';
      extra = (
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      );
    } else if (error.status === 401) {
      title = '401';
      subTitle = '抱歉，您没有权限访问该页面，请先登录。';
      extra = (
        <Button type="primary" onClick={() => navigate('/login')}>
          去登录
        </Button>
      );
    } else if (error.status === 503) {
      title = '503';
      subTitle = '服务暂时不可用，请稍后再试。';
    } else {
      title = `${error.status}`;
      subTitle = error.statusText || '未知错误';
    }
  } else if (error instanceof Error) {
    // 处理动态导入失败的情况
    if (error.message.includes('Failed to fetch dynamically imported module') || 
        error.message.includes('Importing a module script failed')) {
      title = '版本更新';
      subTitle = '检测到新版本发布，请刷新页面以加载最新内容。';
      extra = (
        <Button type="primary" onClick={() => window.location.reload()}>
          立即刷新
        </Button>
      );
    } else {
      subTitle = error.message;
      extra = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Button type="primary" onClick={() => window.location.reload()}>
            重试
          </Button>
          <Paragraph type="secondary" style={{ maxWidth: 600, textAlign: 'left' }}>
            <Text strong>错误详情：</Text>
            <br />
            <Text code>{error.stack}</Text>
          </Paragraph>
        </div>
      );
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'var(--color-bg-page, #f5f7fb)'
    }}>
      <Result
        status="error"
        title={title}
        subTitle={subTitle}
        extra={extra}
      />
    </div>
  );
};

export default ErrorBoundary;
