import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Typography, Space, Tooltip, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const SectionNode = memo(({ data, isConnectable }: NodeProps<any>) => {
  return (
    <Card
      size="small"
      style={{
        width: 280,
        borderColor: '#1890ff',
        borderWidth: 2,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      bodyStyle={{ padding: '8px 12px' }}
    >
      <div className="custom-drag-handle" style={{ cursor: 'move' }}>
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
              {data.sectionTitle}
            </Title>
            <Space size={4}>
               {/* Toolbar will appear on hover via CSS or always visible for now */}
               <Tooltip title="添加章节">
                 <Button 
                    type="text" 
                    size="small" 
                    icon={<PlusOutlined />} 
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onAddChild?.(data.sectionId);
                    }}
                 />
               </Tooltip>
            </Space>
          </div>
          <Text type="secondary" ellipsis={{ tooltip: true }} style={{ fontSize: 12 }}>
            {data.description}
          </Text>
        </Space>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#1890ff' }}
      />
    </Card>
  );
});

SectionNode.displayName = 'SectionNode';

export default SectionNode;
