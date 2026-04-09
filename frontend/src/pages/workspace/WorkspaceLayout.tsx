import { Avatar, Button, Dropdown, Layout, Menu } from 'antd';
import {
  HomeOutlined,
  BackwardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { workspaceStore } from '@/store/workspace-store.ts';
import ThemeSwitch from '@/components/ThemeSwitch.tsx';
import { useAppThemeMode } from '@/theme-provider.tsx';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'script', label: '剧本创作' },
  { key: 'characters', label: '角色设计' },
  { key: 'storyboard', label: '画面分镜' },
  { key: 'voice', label: '人物配音' },
  { key: 'bgm', label: 'BGM' },
  { key: 'compose', label: '视频合成' },
  { key: 'monitor', label: '数据监控' },
];

const WorkspaceLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId = '' } = useParams<{ projectId: string }>();
  const { resolvedThemeMode } = useAppThemeMode();

  const selectedKey = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments[2] || 'script';
  }, [location.pathname]);

  const handleMenuChange = ({ key }: { key: string }) => {
    navigate(`/workspace/${projectId}/${key}`);
  };

  const goPortal = () => {
    workspaceStore.clearCurrentProject();
    navigate('/portal');
  };

  const goWorkspaceList = () => {
    workspaceStore.clearCurrentProject();
    navigate('/workspace');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        style={{
          height: 56,
          position: 'fixed',
          insetInline: 0,
          top: 0,
          zIndex: 200,
          padding: '0 16px',
          background: 'var(--color-header-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            style={{ color: 'var(--color-text-primary)' }}
          />
          <Button
            type="text"
            onClick={goPortal}
            style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'Syne, sans-serif', fontSize: 15 }}
          >
            <HomeOutlined /> Auto AI Movie
          </Button>
          <Button
            type="text"
            onClick={goWorkspaceList}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <BackwardOutlined /> 项目管理
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeSwitch />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出',
                  onClick: goPortal,
                },
              ],
            }}
            trigger={['click']}
          >
            <Avatar size="small" style={{ cursor: 'pointer', backgroundColor: 'var(--color-primary)' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Layout style={{ marginTop: 56 }}>
        <Sider
          width={180}
          collapsedWidth={64}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: 'var(--color-header-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRight: '1px solid var(--color-border)',
            overflow: 'hidden',
            height: 'calc(100vh - 56px)',
            position: 'sticky',
            top: 56,
            left: 0,
            zIndex: 100
          }}
        >
          <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }} className="slim-scroll">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuChange}
              items={menuItems}
              style={{ borderInlineEnd: 0, paddingTop: 12, background: 'transparent' }}
              className="workspace-menu"
              theme={resolvedThemeMode === 'dark' ? 'dark' : 'light'}
            />
          </div>
        </Sider>
        <Content
          style={{
            padding: selectedKey === 'script' ? '8px 16px' : 24,
            background: 'transparent',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkspaceLayout;
