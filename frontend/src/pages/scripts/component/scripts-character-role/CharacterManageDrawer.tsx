import React, {useEffect, useState} from 'react';
import {
    Button,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Popconfirm,
    Select,
    Space,
    Tag,
    Typography
} from 'antd';
import {CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined} from '@ant-design/icons';
import {CharacterRole, CreateCharacterRoleData, Gender} from '../../../../api/types/character-role-types.ts';
import {characterRoleApi} from '../../../../api/service/character-role.ts';

const {Title, Text} = Typography;
const {Option} = Select;

interface CharacterManageDrawerProps {
    character: CharacterRole | null;
    open: boolean;
    mode: 'create' | 'view' | 'edit';
    projectId: string | undefined;
    onClose: () => void;
    onSuccess: (character: CharacterRole, action: 'create' | 'update' | 'delete') => void;
}

const CharacterManageDrawer: React.FC<CharacterManageDrawerProps> = (
    {
        character,
        open,
        mode,
        projectId,
        onClose,
        onSuccess
    }
) => {
    const [form] = Form.useForm();
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(mode === 'edit');

    // 数据处理工具函数
    const parseTagsInput = (input: string | undefined): string[] => {
        if (!input) {
            return [];
        }
        return input.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    };

    const formatTagsForDisplay = (tags: string[] | string | undefined): string => {
        if (Array.isArray(tags)) {
            return tags.join(',');
        }
        if (typeof tags === 'string') {
            try {
                const parsed = JSON.parse(tags);
                if (Array.isArray(parsed)) {
                    return parsed.join(',');
                }
            } catch {
                return tags;
            }
        }
        return '';
    };

    // 根据模式设置标题
    const getDrawerTitle = () => {
        switch (mode) {
            case 'create':
                return '创建新角色';
            case 'edit':
                return '编辑角色';
            case 'view':
                return '角色详情';
            default:
                return '角色管理';
        }
    };

    // 初始化表单数据
    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                // 创建模式 - 清空表单
                form.resetFields();
                form.setFieldsValue({
                    gender: Gender.UNKNOWN
                });
                setIsEditing(true);
            } else if (character && (mode === 'view' || mode === 'edit')) {
                // 查看或编辑模式 - 填充角色数据
                form.setFieldsValue({
                    name: character.name,
                    age: character.age,
                    gender: character.gender,
                    roleInStory: character.roleInStory,
                    personalityTags: formatTagsForDisplay(character.personalityTags),
                    skills: formatTagsForDisplay(character.skills),
                    characterSetting: character.characterSetting
                });
                setIsEditing(mode === 'edit');
            }
        }
    }, [open, mode, character, form]);

    // 数据预处理和验证
    const preprocessCharacterData = (values: any): CreateCharacterRoleData => {
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

        // 验证 projectId
        if (!projectId) {
            throw new Error('项目ID不能为空');
        }

        // 处理字符串数组字段
        const personalityTags = parseTagsInput(values.personalityTags);
        const skills = parseTagsInput(values.skills);

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

    // 处理保存（创建或更新）
    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            if (mode === 'create') {
                // 创建新角色
                const createData = preprocessCharacterData(values);
                const response = await characterRoleApi.createCharacter(createData);

                if (response.success && response.data) {
                    message.success('角色创建成功！');
                    onSuccess(response.data as CharacterRole, 'create');
                    handleClose();
                } else {
                    message.error(response.message || '创建角色失败');
                }
            } else if (mode === 'edit' && character) {
                // 更新现有角色
                const updateData: Partial<CharacterRole> = {
                    name: values.name?.trim() || '',
                    age: values.age,
                    gender: values.gender || '',
                    roleInStory: values.roleInStory?.trim() || '',
                    personalityTags: parseTagsInput(values.personalityTags),
                    skills: parseTagsInput(values.skills),
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
                    const updatedCharacter: CharacterRole = {
                        ...character,
                        ...updateData,
                        updatedAt: new Date().toISOString()
                    };
                    onSuccess(updatedCharacter, 'update');
                    setIsEditing(false);
                } else {
                    message.error(response.message || '保存失败');
                }
            }
        } catch (error: any) {
            console.error('Save character error:', error);
            message.error(error.message || '操作失败，请稍后重试');
        } finally {
            setSaving(false);
        }
    };

    // 处理删除
    const handleDelete = async () => {
        if (!character) return;

        try {
            setDeleting(true);
            const response = await characterRoleApi.deleteCharacter({id: character.id});

            if (response.success) {
                message.success('角色删除成功');
                onSuccess(character, 'delete');
                handleClose();
            } else {
                message.error(response.message || '删除失败');
            }
        } catch (error: any) {
            console.error('Delete character error:', error);
            message.error(error.message || '删除失败，请稍后重试');
        } finally {
            setDeleting(false);
        }
    };

    // 处理关闭
    const handleClose = () => {
        form.resetFields();
        setIsEditing(false);
        onClose();
    };

    // 处理取消编辑
    const handleCancelEdit = () => {
        if (character && mode !== 'create') {
            form.setFieldsValue({
                name: character.name,
                age: character.age,
                gender: character.gender,
                roleInStory: character.roleInStory,
                personalityTags: formatTagsForDisplay(character.personalityTags),
                skills: formatTagsForDisplay(character.skills),
                characterSetting: character.characterSetting
            });
        }
        setIsEditing(false);
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
                            icon={<EditOutlined/>}
                            onClick={() => setIsEditing(true)}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定要删除这个角色吗？"
                            description="删除后无法恢复"
                            onConfirm={handleDelete}
                            okText="确定"
                            cancelText="取消"
                            okButtonProps={{loading: deleting}}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined/>}
                                loading={deleting}
                            >
                                删除
                            </Button>
                        </Popconfirm>
                        <Button icon={<CloseOutlined/>} onClick={handleClose}>
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
                            {character.personalityTags.map((tag, index) => (
                                <Tag key={`${tag}-${index}`} color="blue" style={{marginRight: 8, marginBottom: 8}}>
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
                            {character.skills.map((skill, index) => (
                                <Tag key={`${skill}-${index}`} color="green" style={{marginRight: 8, marginBottom: 8}}>
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

    // 渲染编辑/创建视图
    const renderEditView = () => {
        return (
            <div style={{padding: '0 24px'}}>
                <div style={{marginBottom: 24}}>
                    <Space style={{marginBottom: 16}}>
                        <Button
                            type="primary"
                            icon={<SaveOutlined/>}
                            onClick={handleSave}
                            loading={saving}
                        >
                            {mode === 'create' ? '创建' : '保存'}
                        </Button>
                        {mode !== 'create' && (
                            <Button onClick={handleCancelEdit}>
                                取消
                            </Button>
                        )}
                        <Button icon={<CloseOutlined/>} onClick={handleClose}>
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
                        name="name"
                        label="角色姓名"
                        rules={[
                            {required: true, message: '请输入角色姓名'},
                            {max: 50, message: '角色姓名长度不能超过50个字符'}
                        ]}
                    >
                        <Input placeholder="请输入角色姓名" maxLength={50}/>
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
                        <InputNumber
                            placeholder="请输入年龄"
                            min={0}
                            max={150}
                            style={{width: '100%'}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="性别"
                        rules={[{required: true, message: '请选择性别'}]}
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
                            {max: 200, message: '性格标签总长度不能超过200个字符'}
                        ]}
                        extra="多个标签请用逗号分隔"
                    >
                        <Input placeholder="用逗号分隔多个标签，如：勇敢,聪明,善良" maxLength={200}/>
                    </Form.Item>

                    <Form.Item
                        name="roleInStory"
                        label="在故事中的作用"
                        rules={[
                            {required: true, message: '请输入角色在故事中的作用'},
                            {max: 200, message: '故事作用描述不能超过200个字符'}
                        ]}
                    >
                        <Input.TextArea
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
                            {max: 300, message: '技能特长总长度不能超过300个字符'}
                        ]}
                        extra="多个技能请用逗号分隔"
                    >
                        <Input placeholder="用逗号分隔多项技能" maxLength={300}/>
                    </Form.Item>

                    <Form.Item
                        name="characterSetting"
                        label="角色设定"
                        rules={[
                            {required: true, message: '请输入角色设定'},
                            {max: 500, message: '角色设定不能超过500个字符'}
                        ]}
                    >
                        <Input.TextArea
                            placeholder="详细描述角色的外貌、性格特征等..."
                            rows={4}
                            maxLength={500}
                            showCount
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
                    <span>{getDrawerTitle()}</span>
                    {character && mode !== 'create' && (
                        <Text type="secondary" style={{fontSize: '14px'}}>
                            角色 ID: <Tag color={'#10b981'}>{character.id.substring(0, 16)}...</Tag>
                        </Text>
                    )}
                </div>
            }
            placement="right"
            open={open}
            onClose={handleClose}
            width={520}
            destroyOnClose
        >
            {isEditing ? renderEditView() : renderReadOnlyView()}
        </Drawer>
    );
};

export default CharacterManageDrawer;