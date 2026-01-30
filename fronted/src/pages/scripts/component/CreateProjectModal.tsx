import React from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';

const { Text } = Typography;

interface CreateProjectModalProps {
  open: boolean;
  operationLoading: boolean;
  apiLoading: boolean;
  error: string | null;
  newProjectName: string;
  newProjectDescription: string;
  form: any;
  onClose: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  operationLoading,
  apiLoading,
  error,
  newProjectName,
  newProjectDescription,
  form,
  onClose,
  onNameChange,
  onDescriptionChange,
  onSubmit
}) => {
  const isLoading = operationLoading || apiLoading;

  return (
    <Modal
      title="创建新项目"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="back"
          onClick={onClose}
          disabled={isLoading}
        >
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          loading={isLoading}
          disabled={!newProjectName.trim()}
        >
          {isLoading ? '创建中...' : '创建'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        {error && (
          <div style={{
            padding: 10,
            backgroundColor: '#fff6f6',
            border: '1px solid #ffccc7',
            borderRadius: 4,
            marginBottom: 16
          }}>
            <Text type="danger">错误: {error}</Text>
          </div>
        )}

        <Form.Item
          label="项目名称"
          name="projectName"
          rules={[{ required: true, message: '请输入项目名称!' }]}
        >
          <Input
            value={newProjectName}
            onChange={onNameChange}
            placeholder="输入项目名称"
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item
          label="项目描述"
          name="projectDescription"
        >
          <Input.TextArea
            value={newProjectDescription}
            onChange={onDescriptionChange}
            placeholder="输入项目描述"
            rows={4}
            disabled={isLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;