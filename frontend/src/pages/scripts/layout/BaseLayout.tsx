import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface BaseLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
  layoutStyle?: React.CSSProperties;
  className?: string;
  embedded?: boolean;
}

/**
 * 通用的布局组件，提供标准的 Header + Sidebar + Content 结构
 */
const BaseLayout: React.FC<BaseLayoutProps> = ({ 
  header, 
  sidebar, 
  children, 
  contentStyle,
  layoutStyle,
  className,
  embedded = false
}) => {
  return (
    <Layout style={{ height: embedded ? '100%' : '100vh', ...layoutStyle }} className={className}>
      {header}
      <Layout
        hasSider
        style={
          embedded
            ? { flex: 1, minHeight: 0 }
            : { marginTop: header ? 64 : 0, height: header ? 'calc(100vh - 64px)' : '100vh' }
        }
      >
        {sidebar}
        <Content
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: 'var(--color-bg-page)',
            minHeight: 0,
            ...contentStyle,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
