import React from 'react';
import { Menu, MenuProps } from 'antd';
import { 
  DeleteOutlined, 
  CopyOutlined, 
  EnterOutlined,
  SubnodeOutlined
} from '@ant-design/icons';

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top: number;
  left: number;
  type: string;
  onClose: () => void;
  onAction: (action: string, id: string, type: string) => void;
}

export default function ContextMenu({
  id,
  top,
  left,
  type,
  onClose,
  onAction,
  ...props
}: ContextMenuProps) {
  const items: MenuProps['items'] = [
    {
      key: 'insert-after',
      icon: <EnterOutlined />,
      label: '在此后插入同级',
      disabled: type === 'project', // Project usually root
    },
    {
      key: 'insert-child',
      icon: <SubnodeOutlined />,
      label: '插入子级',
      disabled: type === 'episode', // Episode is leaf
    },
    {
        type: 'divider',
    },
    {
      key: 'copy',
      icon: <CopyOutlined />,
      label: '复制',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
    },
  ];

  const handleClick = (e: any) => {
      onAction(e.key, id, type);
      onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        backgroundColor: '#fff',
      }}
      {...props}
    >
      <Menu
        items={items}
        onClick={handleClick}
        style={{ borderRadius: '4px', minWidth: 160 }}
        mode="vertical"
      />
    </div>
  );
}
