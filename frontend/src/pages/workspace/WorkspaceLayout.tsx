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
    <Layout style={{ minHeight: '100vh', background: 'var(--color-bg-page)' }}>
      <Header
        style={{
          height: 64,
          position: 'fixed',
          insetInline: 0,
          top: 0,
          zIndex: 200,
          padding: '0 20px',
          background: 'var(--color-header-bg)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            style={{ color: 'var(--color-text-primary)' }}
          />
          <Button
            type="default"
            onClick={goPortal}
            // style={{color: '#d6e4ff', fontWeight: 700, paddingInline: 0}}
          >
            <HomeOutlined />Auto AI Movie
          </Button>
          <Button
            type="default"
            onClick={goWorkspaceList}
          >
            <BackwardOutlined />项目管理
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <Avatar style={{ cursor: 'pointer', backgroundColor: 'var(--color-primary)' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: 'var(--color-bg-elevated)',
            borderRight: '1px solid var(--color-border)',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'sticky',
            top: 64,
            left: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuChange}
            items={menuItems}
            style={{ height: '100%', borderInlineEnd: 0, paddingTop: 12 }}
            theme={resolvedThemeMode === 'dark' ? 'dark' : 'light'}
          />
        </Sider>
        <Content
          style={{
            padding: selectedKey === 'script' ? '8px 16px' : 24,
            background: 'var(--color-bg-page)',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkspaceLayout;
