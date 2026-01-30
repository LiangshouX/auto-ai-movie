import React, {useState, useEffect} from 'react';
import {
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Tag,
    Divider,
    List,
    Button,
    Space,
    message,
    Typography
} from 'antd';
import {CloseOutlined, SaveOutlined, EditOutlined} from '@ant-design/icons';
import {CharacterRole, Gender} from '../../../../api/types/character-role-types.ts';
import {characterRoleApi} from '../../../../api/service/character-role.ts';

const {Title, Text} = Typography;
const {Option} = Select;

interface CharacterDetailDrawerProps {
    character: CharacterRole | null;
    open: boolean;
    onClose: () => void;
    onUpdateSuccess: (updatedCharacter: CharacterRole) => void;
}

const CharacterDetailDrawer: React.FC<CharacterDetailDrawerProps> = ({
                                                                         character,
                                                                         open,
                                                                         onClose,
                                                                         onUpdateSuccess
                                                                     }) => {
    const [form] = Form.useForm();
    // 移除未使用的loading状态
    const [saving, setSaving] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);

    // 初始化表单数据
    useEffect(() => {
        if (open && character) {
            form.setFieldsValue({
                name: character.name,
                age: character.age,
                gender: character.gender,
                roleInStory: character.roleInStory,
                personalityTags: Array.isArray(character.personalityTags) 
                    ? character.personalityTags.join(',') 
                    : (typeof character.personalityTags === 'string' 
                        ? (() => {
                            try {
                                const parsed = JSON.parse(character.personalityTags);
                                return Array.isArray(parsed) ? parsed.join(',') : character.personalityTags;
                            } catch {
                                return character.personalityTags;
                            }
                        })()
                        : ''),
                skills: Array.isArray(character.skills) 
                    ? character.skills.join(',') 
                    : (typeof character.skills === 'string' 
                        ? (() => {
                            try {
                                const parsed = JSON.parse(character.skills);
                                return Array.isArray(parsed) ? parsed.join(',') : character.skills;
                            } catch {
                                return character.skills;
                            }
                        })()
                        : ''),
                characterSetting: character.characterSetting
            });
            setEditing(false);
        }
    }, [open, character, form]);

    // 处理保存
    const handleSave = async () => {
        if (!character) return;

        try {
            setSaving(true);
            const values = await form.validateFields();
            
            // 数据转换和验证
            const updateData: Partial<CharacterRole> = {
                name: values.name?.trim() || '',
                age: values.age,
                gender: values.gender || '',
                roleInStory: values.roleInStory?.trim() || '',
                personalityTags: values.personalityTags 
                    ? JSON.stringify(values.personalityTags.split(',').map((tag: string) => tag.trim()).filter(Boolean))
                    : '[]',
                skills: values.skills 
                    ? JSON.stringify(values.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean))
                    : '[]',
                characterSetting: values.characterSetting?.trim() || ''
            };

            // 基础数据验证
            if (!updateData.name) {
                message.error('角色姓名不能为空');
                return;
            }

            if (!updateData.roleInStory) {
                message.error('角色定位不能为空');
                return;
            }

            // 构造完整的角色数据对象
            const fullCharacterData: CharacterRole = {
                ...character,
                ...updateData
            };
            
            const response = await characterRoleApi.updateCharacter(fullCharacterData);

            if (response.success) {
                message.success('角色信息保存成功');
                setEditing(false);
                
                // 更新成功后的回调
                const updatedCharacter: CharacterRole = {
                    ...character,
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };
                onUpdateSuccess(updatedCharacter);
            } else {
                message.error(response.message || '保存失败');
            }
        } catch (error: any) {
            console.error('Save character error:', error);
            message.error(error.message || '保存过程中发生错误');
        } finally {
            setSaving(false);
        }
    };

    // 处理取消编辑
    const handleCancelEdit = () => {
        if (character) {
            form.setFieldsValue({
                name: character.name,
                age: character.age,
                gender: character.gender,
                roleInStory: character.roleInStory,
                personalityTags: Array.isArray(character.personalityTags) 
                    ? character.personalityTags.join(',') 
                    : (typeof character.personalityTags === 'string' 
                        ? character.personalityTags 
                        : ''),
                skills: Array.isArray(character.skills) 
                    ? character.skills.join(',') 
                    : (typeof character.skills === 'string' 
                        ? character.skills 
                        : ''),
                characterSetting: character.characterSetting
            });
        }
        setEditing(false);
    };

    // 渲染只读视图
    const renderReadOnlyView = () => {
        if (!character) return null;

        return (
            <div style={{padding: '0 24px'}}>
                <div style={{marginBottom: 24}}>
                    <Space style={{marginBottom: 16}}>
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            onClick={() => setEditing(true)}
                        >
                            编辑
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={onClose}>
                            关闭
                        </Button>
                    </Space>
                </div>

                <div style={{marginBottom: 24}}>
                    <Title level={4}>{character.name}</Title>
                    <Text type="secondary">{character.roleInStory}</Text>
                </div>

                <Divider>基本信息</Divider>
                <div style={{marginBottom: 16}}>
                    <Text strong>年龄: </Text>
                    <Text>{character.age ? `${character.age}岁` : '未知'}</Text>
                </div>
                <div style={{marginBottom: 16}}>
                    <Text strong>性别: </Text>
                    <Text>{character.gender || '未知'}</Text>
                </div>

                <Divider>性格特征</Divider>
                <div style={{marginBottom: 16}}>
                    <Text strong>性格标签: </Text>
                    {Array.isArray(character.personalityTags) && character.personalityTags.length > 0 ? (
                        <div style={{marginTop: 8}}>
                            {character.personalityTags.map(tag => (
                                <Tag key={tag} color="blue" style={{marginRight: 8, marginBottom: 8}}>
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    ) : (
                        <Text type="secondary">无</Text>
                    )}
                </div>

                <div style={{marginBottom: 16}}>
                    <Text strong>技能: </Text>
                    {Array.isArray(character.skills) && character.skills.length > 0 ? (
                        <div style={{marginTop: 8}}>
                            {character.skills.map(skill => (
                                <Tag key={skill} color="green" style={{marginRight: 8, marginBottom: 8}}>
                                    {skill}
                                </Tag>
                            ))}
                        </div>
                    ) : (
                        <Text type="secondary">无</Text>
                    )}
                </div>

                <Divider>背景设定</Divider>
                <div>
                    <Text>{character.characterSetting || '无'}</Text>
                </div>

                <Divider>角色关系</Divider>
                {(character.relationships?.length ?? 0) === 0 ? (
                    <Text type="secondary">暂无关系</Text>
                ) : (
                    <List
                        dataSource={character.relationships}
                        renderItem={(rel: any, index: number) => {
                            const key = rel.id || `${character.id}-rel-${index}`;
                            return (
                                <List.Item key={key}>
                                    <List.Item.Meta
                                        title={rel.relatedCharacterName}
                                        description={
                                            <>
                                                <Tag color="orange">{rel.relationshipType}</Tag>
                                                {rel.description}
                                            </>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>
        );
    };

    // 渲染编辑视图
    const renderEditView = () => {
        if (!character) return null;

        return (
            <div style={{padding: '0 24px'}}>
                <div style={{marginBottom: 24}}>
                    <Space style={{marginBottom: 16}}>
                        <Button 
                            type="primary" 
                            icon={<SaveOutlined />} 
                            onClick={handleSave}
                            loading={saving}
                        >
                            保存
                        </Button>
                        <Button onClick={handleCancelEdit}>
                            取消
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={onClose}>
                            关闭
                        </Button>
                    </Space>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    disabled={saving}
                >
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{required: true, message: '请输入角色姓名'}]}
                    >
                        <Input placeholder="请输入角色姓名"/>
                    </Form.Item>

                    <Form.Item
                        label="年龄"
                        name="age"
                    >
                        <InputNumber 
                            placeholder="请输入年龄" 
                            min={0} 
                            max={150}
                            style={{width: '100%'}}
                        />
                    </Form.Item>

                    <Form.Item
                        label="性别"
                        name="gender"
                    >
                        <Select placeholder="请选择性别">
                            <Option value={Gender.MALE}>男</Option>
                            <Option value={Gender.FEMALE}>女</Option>
                            <Option value={Gender.OTHER}>其他</Option>
                            <Option value={Gender.UNKNOWN}>未知</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="角色定位"
                        name="roleInStory"
                        rules={[{required: true, message: '请输入角色定位'}]}
                    >
                        <Input placeholder="请输入角色在故事中的定位"/>
                    </Form.Item>

                    <Form.Item
                        label="性格标签"
                        name="personalityTags"
                        extra="多个标签请用逗号分隔"
                    >
                        <Input placeholder="例如：勇敢,聪明,善良"/>
                    </Form.Item>

                    <Form.Item
                        label="技能"
                        name="skills"
                        extra="多个技能请用逗号分隔"
                    >
                        <Input placeholder="例如：武术,医术,绘画"/>
                    </Form.Item>

                    <Form.Item
                        label="背景设定"
                        name="characterSetting"
                    >
                        <Input.TextArea 
                            placeholder="请输入角色的背景设定" 
                            rows={4}
                            showCount
                            maxLength={1000}
                        />
                    </Form.Item>
                </Form>
            </div>
        );
    };

    return (
        <Drawer
            title={
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>角色详情</span>
                    {character && (
                        <Text type="secondary" style={{fontSize: '14px'}}>
                            ID: {character.id.substring(0, 16)}...
                        </Text>
                    )}
                </div>
            }
            placement="right"
            open={open}
            onClose={onClose}
            width={520}
        >
            {editing ? renderEditView() : renderReadOnlyView()}
        </Drawer>
    );
};

export default CharacterDetailDrawer;