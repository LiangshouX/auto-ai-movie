import React from 'react';
import { Button, Input, Layout, Space, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { workspaceStore } from '@/store/workspace-store.ts';
import ThemeSwitch from '@/components/ThemeSwitch.tsx';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

interface AppHeaderProps {
  title: string;
  showHome?: boolean;
  extra?: React.ReactNode;
  onSearch?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
}

/**
 * 通用的头部组件，包含标题、返回首页按钮、搜索框和自定义操作区域
 */
const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showHome = true,
  extra,
  onSearch,
  searchValue,
  searchPlaceholder = "搜索...",
}) => {
  const navigate = useNavigate();
  const handlePortalClick = () => {
    workspaceStore.clearCurrentProject();
    navigate('/portal');
  };

  return (
    <Header
      style={{
        backgroundColor: 'var(--color-header-bg)',
        padding: '0 24px',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 100,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        justifyContent: 'space-between',
        height: 64,
        top: 0,
        left: 0,
        right: 0,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Space size="large">
        {showHome && (
          <Button onClick={handlePortalClick} type="text" size="large" style={{fontWeight: 700, cursor: 'pointer', fontSize: 18, color: 'var(--color-text-primary)'}}>
            <HomeOutlined /> Auto AI Movie Home
          </Button>
        )}
      </Space>

      <Title level={2} style={{ 
        margin: 0, 
        color: 'var(--color-text-primary)',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        {title}
      </Title>

      <Space>
        {onSearch && (
          <Search
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
            allowClear
          />
        )}
        <ThemeSwitch />
        {extra}
      </Space>
    </Header>
  );
};

export default AppHeader;
