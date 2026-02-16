import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Typography, Space, Tooltip, Badge, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChapterNode = memo(({ data, isConnectable }: NodeProps<any>) => {
  return (
    <Card
      size="small"
      style={{
        width: 250,
        borderColor: '#52c41a',
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      bodyStyle={{ padding: '8px 12px' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#52c41a' }}
      />
      
      <div className="custom-drag-handle" style={{ cursor: 'move' }}>
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Text strong>{data.chapterTitle}</Text>
            <Space size={4}>
               <Tooltip title="添加桥段">
                 <Button 
                    type="text" 
                    size="small" 
                    icon={<PlusOutlined />} 
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onAddChild?.(data.chapterId);
                    }}
                 />
               </Tooltip>
            </Space>
          </div>
          <Text type="secondary" ellipsis={{ tooltip: true }} style={{ fontSize: 12 }}>
            {data.chapterSummary}
          </Text>
          <Space size={8} style={{ marginTop: 4 }}>
            <Badge 
              count={`${data.episodeCount || 0} 桥段`} 
              style={{ backgroundColor: '#f0f0f0', color: '#666', fontSize: 10, boxShadow: 'none' }} 
            />
            <Badge 
              count={`${data.wordCount || 0} 字`} 
              style={{ backgroundColor: '#f0f0f0', color: '#666', fontSize: 10, boxShadow: 'none' }} 
            />
          </Space>
        </Space>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#52c41a' }}
      />
    </Card>
  );
});

ChapterNode.displayName = 'ChapterNode';

export default ChapterNode;
