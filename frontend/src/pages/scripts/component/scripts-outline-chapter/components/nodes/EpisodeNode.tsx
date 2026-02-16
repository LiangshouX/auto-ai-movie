import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Typography, Space, Tooltip, Badge, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const EpisodeNode = memo(({ data, isConnectable }: NodeProps<any>) => {
  return (
    <Card
      size="small"
      style={{
        width: 220,
        borderColor: '#fa8c16',
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      bodyStyle={{ padding: '8px 12px' }}
      hoverable
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#fa8c16' }}
      />
      
      <div className="custom-drag-handle" style={{ cursor: 'move' }}>
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <Space justify="space-between" style={{ width: '100%' }}>
            <Text strong>{data.episodeTitle}</Text>
            <Space size={4}>
               <Tooltip title="编辑内容">
                 <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onEdit?.(data.episodeId);
                    }}
                 />
               </Tooltip>
            </Space>
          </Space>
          <Space size={8} style={{ marginTop: 4 }}>
            <Badge 
              status="processing" 
              text="待完善" 
              style={{ fontSize: 10, color: '#999' }} 
            />
            <Badge 
              count={`${data.wordCount || 0} 字`} 
              style={{ backgroundColor: '#fff7e6', color: '#fa8c16', fontSize: 10, boxShadow: 'none' }} 
            />
          </Space>
        </Space>
      </div>
    </Card>
  );
});

EpisodeNode.displayName = 'EpisodeNode';

export default EpisodeNode;
