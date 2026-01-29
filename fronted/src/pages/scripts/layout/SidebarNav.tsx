import React from 'react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'background', label: '背景设定' },
    { id: 'summary', label: '剧情梗概' },
    { id: 'characters', label: '角色设计' },
    { id: 'outline', label: '剧本大纲' }
  ];

  return (
    <div className="sidebar-nav">
      <h3 className="sidebar-title">编辑内容</h3>
      <nav className="sidebar-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidebarNav;