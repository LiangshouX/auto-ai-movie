import { Modal, Form, Input as AntInput, Select, message } from "antd";
import { useState } from "react";
import {CharacterRole, CreateCharacterRoleData, Gender} from "../../../../api/types/character-role-types.ts";
import {characterRoleApi} from "../../../../api/service/character-role.ts";
const { Option } = Select;

interface AddCharacterModalProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  onCreated: (newCharacter: CharacterRole) => void;
}

const AddCharacterModal = ({ visible, projectId, onCancel, onCreated }: AddCharacterModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 处理模态框确认
  const handleOk = async () => {
    try {
      setLoading(true);
      
      // 表单验证
      const values = await form.validateFields();
      
      // 数据预处理和验证
      const processedData = preprocessCharacterData(values, projectId);
      
      // 调用API创建角色
      const response = await characterRoleApi.createCharacter(processedData);
      
      if (response.success && response.data) {
        message.success('角色创建成功！');
        form.resetFields();
        onCreated(response.data as CharacterRole);
      } else {
        throw new Error(response.message || '创建角色失败');
      }
    } catch (error: any) {
      console.error('创建角色失败:', error);
      message.error(error.message || '创建角色失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理模态框取消
  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      onCancel();
    }
  };

  // 数据预处理函数
  const preprocessCharacterData = (values: any, projectId: string): CreateCharacterRoleData & { projectId: string } => {
    // 验证必填字段
    if (!values.name?.trim()) {
      throw new Error('角色姓名不能为空');
    }
    
    if (!values.roleInStory?.trim()) {
      throw new Error('在故事中的作用不能为空');
    }
    
    if (!values.characterSetting?.trim()) {
      throw new Error('角色设定不能为空');
    }
    
    if (!values.gender) {
      throw new Error('性别不能为空');
    }

    // 处理字符串数组字段
    const personalityTags = values.personalityTags 
      ? values.personalityTags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];
      
    const skills = values.skills 
      ? values.skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0)
      : [];

    // 年龄验证和转换
    let age: number | undefined = undefined;
    if (values.age !== undefined && values.age !== null && values.age !== '') {
      const ageNum = Number(values.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        throw new Error('年龄必须是0-150之间的有效数字');
      }
      age = ageNum;
    }

    return {
      projectId,
      name: values.name.trim(),
      age,
      gender: values.gender,
      personalityTags,
      roleInStory: values.roleInStory.trim(),
      skills,
      characterSetting: values.characterSetting.trim(),
      relationships: []
    };
  };

  return (
    <Modal
      title="创建新角色"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="创建"
      cancelText="取消"
      width={600}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical"
        initialValues={{
          gender: Gender.UNKNOWN
        }}
      >
        <Form.Item
          name="name"
          label="角色姓名"
          rules={[
            { required: true, message: '请输入角色姓名' },
            { max: 50, message: '角色姓名长度不能超过50个字符' }
          ]}
        >
          <AntInput placeholder="请输入角色姓名" maxLength={50} />
        </Form.Item>
        
        <Form.Item
          name="age"
          label="年龄"
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === '') {
                  return Promise.resolve();
                }
                const num = Number(value);
                if (isNaN(num) || num < 0 || num > 150) {
                  return Promise.reject('请输入0-150之间的有效年龄');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <AntInput type="number" placeholder="请输入年龄" min={0} max={150} />
        </Form.Item>
        
        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Select placeholder="请选择性别">
            <Option value={Gender.MALE}>男性</Option>
            <Option value={Gender.FEMALE}>女性</Option>
            <Option value={Gender.OTHER}>其他</Option>
            <Option value={Gender.UNKNOWN}>未知</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="personalityTags"
          label="性格标签"
          rules={[
            { max: 200, message: '性格标签总长度不能超过200个字符' }
          ]}
        >
          <AntInput placeholder="用逗号分隔多个标签，如：勇敢,聪明,善良" maxLength={200} />
        </Form.Item>
        
        <Form.Item
          name="roleInStory"
          label="在故事中的作用"
          rules={[
            { required: true, message: '请输入角色在故事中的作用' },
            { max: 200, message: '故事作用描述不能超过200个字符' }
          ]}
        >
          <AntInput.TextArea 
            placeholder="描述这个角色在故事中扮演什么角色..." 
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="skills"
          label="技能特长"
          rules={[
            { max: 300, message: '技能特长总长度不能超过300个字符' }
          ]}
        >
          <AntInput placeholder="用逗号分隔多项技能" maxLength={300} />
        </Form.Item>
        
        <Form.Item
          name="characterSetting"
          label="角色设定"
          rules={[
            { required: true, message: '请输入角色设定' },
            { max: 500, message: '角色设定不能超过500个字符' }
          ]}
        >
          <AntInput.TextArea 
            placeholder="详细描述角色的外貌、性格特征等..." 
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCharacterModal;