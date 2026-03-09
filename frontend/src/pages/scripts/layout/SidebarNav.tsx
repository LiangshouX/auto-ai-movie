import React from 'react';
import { Menu } from 'antd';
import { 
  SettingOutlined, 
  FileTextOutlined, 
  UsergroupAddOutlined, 
  OrderedListOutlined 
} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, onTabChange }) => {
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
      width={140}
      theme="light"
      style={{
        backgroundColor: 'var(--color-bg-container)',
        borderRight: '1px solid var(--color-border-soft)',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          padding: '0 24px 16px',
          color: 'var(--color-text-primary)'
        }}>
          编辑内容
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={handleMenuClick}
          items={tabs.map(tab => ({
            key: tab.key,
            icon: tab.icon,
            label: tab.label
          }))}
          style={{ borderInlineEnd: 'none' }}
        />
      </div>
    </Sider>
  );
};

export default SidebarNav;
