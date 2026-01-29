import React from 'react';
import { Menu } from 'antd';
import { 
  SettingOutlined, 
  FileTextOutlined, 
  UsergroupAddOutlined, 
  OrderedListOutlined 
} from '@ant-design/icons';

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
    <div style={{ 
      width: 240, 
      backgroundColor: '#fff', 
      borderRight: '1px solid #f0f0f0',
      height: 'calc(100vh - 64px)',
      position: 'fixed',
      left: 0,
      top: 64,
      zIndex: 1,
      overflow: 'auto'
    }}>
      <div style={{ padding: '16px 0' }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          padding: '0 24px 16px',
          color: '#333'
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
    </div>
  );
};

export default SidebarNav;