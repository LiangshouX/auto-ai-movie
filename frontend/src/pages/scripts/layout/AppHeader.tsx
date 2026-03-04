import React from 'react';
import { Layout, Space, Button, Typography, Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {workspaceStore} from '@/store/workspace-store.ts';

const { Header } = Layout;
const { Title, Text } = Typography;
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
        backgroundColor: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px #f0f0f0',
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
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Space size="large">
        <Text
          onClick={handlePortalClick}
          style={{fontWeight: 700, cursor: 'pointer', fontSize: 18, color: '#111827'}}
        >
          Auto AI Movie
        </Text>
        {showHome && (
          <Button onClick={handlePortalClick} type="text" size="large">
            <HomeOutlined /> 首页
          </Button>
        )}
        <Title level={2} style={{ margin: 0, color: 'rgba(0, 0, 0, 0.88)' }}>
          {title}
        </Title>
      </Space>

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
        {extra}
      </Space>
    </Header>
  );
};

export default AppHeader;
