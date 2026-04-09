import React from 'react';
import { Menu } from 'antd';
import { 
  SettingOutlined, 
  FileTextOutlined, 
  UsergroupAddOutlined, 
  OrderedListOutlined 
} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { useAppThemeMode } from '@/theme-provider.tsx';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, onTabChange }) => {
  const { resolvedThemeMode } = useAppThemeMode();
  const tabs = [
    { key: 'background', label: '背景设定', icon: <SettingOutlined /> },
    { key: 'summary', label: '剧情梗概', icon: <FileTextOutlined /> },
    { key: 'characters', label: '角色设计', icon: <UsergroupAddOutlined /> },
    { key: 'outline', label: '剧本大纲', icon: <OrderedListOutlined /> }
  ];

  const handleMenuClick = (e: { key: string }) => {
    onTabChange(e.key);
  };

  return (
    <Sider
      width={72}
      theme={resolvedThemeMode === 'dark' ? 'dark' : 'light'}
      style={{
        backgroundColor: 'var(--color-bg-container)',
        borderRight: '1px solid var(--color-border)',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Menu
          mode="inline"
          theme={resolvedThemeMode === 'dark' ? 'dark' : 'light'}
          selectedKeys={[activeTab]}
          onClick={handleMenuClick}
          className="editor-sidebar-menu"
          items={tabs.map(tab => ({
            key: tab.key,
            icon: tab.icon,
            label: tab.label,
            title: tab.label
          }))}
          style={{ borderInlineEnd: 'none', backgroundColor: 'transparent', width: '100%' }}
        />
      </div>
    </Sider>
  );
};

export default SidebarNav;
