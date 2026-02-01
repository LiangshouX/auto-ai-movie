import React, { useState } from 'react';
import { Modal, Form, Radio, Alert, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { StructureType } from '@/api/types/scripts-outline-types';

interface CreateOutlineModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (structureType: StructureType) => void;
  loading?: boolean;
}

const structureOptions = [
  {
    value: 'BEGINNING_RISING_ACTION_CLIMAX_END' as StructureType,
    label: '起承转合结构',
    description: '经典的四幕剧结构：开始→发展→高潮→结局'
  },
  {
    value: 'HOOK_RISE_CONTINUATION_TURN_CONCLUSION' as StructureType,
    label: '引起承转合结构',
    description: '五幕剧结构：引子→递进→延续→转折→结局'
  }
];

const CreateOutlineModal: React.FC<CreateOutlineModalProps> = ({
  open,
  onCancel,
  onOk,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [selectedStructure, setSelectedStructure] = useState<StructureType | null>(null);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.structureType) {
        onOk(values.structureType);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedStructure(null);
    onCancel();
  };

  const handleStructureChange = (value: StructureType) => {
    setSelectedStructure(value);
  };

  return (
    <Modal
      title="新建剧本大纲"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="创建"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ structureType: 'BEGINNING_RISING_ACTION_CLIMAX_END' }}
      >
        <Form.Item
          name="structureType"
          label="选择剧本结构"
          rules={[{ required: true, message: '请选择一种剧本结构' }]}
        >
          <Radio.Group onChange={(e) => handleStructureChange(e.target.value)}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {structureOptions.map(option => (
                <Radio key={option.value} value={option.value} style={{ width: '100%' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{option.label}</div>
                    <div style={{ color: '#666', marginTop: '4px' }}>{option.description}</div>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>

      {selectedStructure && (
        <Alert
          message="结构说明"
          description={
            <div>
              {selectedStructure === 'BEGINNING_RISING_ACTION_CLIMAX_END' ? (
                <>
                  <div><strong>起：</strong>故事开端，介绍背景和主要角色</div>
                  <div><strong>承：</strong>情节发展，冲突逐渐显现</div>
                  <div><strong>转：</strong>故事高潮，主要冲突爆发</div>
                  <div><strong>合：</strong>故事收尾，矛盾得到解决</div>
                </>
              ) : (
                <>
                  <div><strong>引：</strong>吸引注意，设置故事基调</div>
                  <div><strong>起：</strong>情节推进，紧张感增强</div>
                  <div><strong>承：</strong>深化主题，故事线发展</div>
                  <div><strong>转：</strong>关键转折，改变故事走向</div>
                  <div><strong>合：</strong>最终结局，呼应开头</div>
                </>
              )}
            </div>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginTop: '16px' }}
        />
      )}

      <Alert
        message="提示"
        description="创建后可以在大纲中添加章节和桥段，支持拖拽调整顺序"
        type="info"
        showIcon
        style={{ marginTop: '16px' }}
      />
    </Modal>
  );
};

export default CreateOutlineModal;