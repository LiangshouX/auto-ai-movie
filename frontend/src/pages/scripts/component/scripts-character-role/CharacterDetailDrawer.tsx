import React, {useEffect, useRef, useState} from 'react';
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
import {
    CharacterRelationship,
    CharacterRole,
    CreateCharacterRoleData,
    Gender
} from '../../../../api/types/character-role-types.ts';
import {characterRoleApi} from '../../../../api/service/character-role.ts';
import CharacterRelationshipEditor from "./CharacterRelationshipEditor.tsx";

const {Title, Text} = Typography;
const {Option} = Select;

// 可复用的 Tag 输入组件
interface TagInputProps {
    value?: string[];
    onChange?: (value: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    maxLength?: number;
}

const TagInput: React.FC<TagInputProps> = (
    {
        value = [],
        onChange,
        placeholder = "输入后按回车添加",
        maxTags = 20,
        maxLength = 30
    }
) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>(value);
    const inputRef = useRef<any>(null);

    // 同步外部值变化
    useEffect(() => {
        setTags(value);
    }, [value]);

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) return;

        // 检查重复
        if (tags.includes(trimmedValue)) {
            message.warning('该标签已存在');
            return;
        }

        // 检查数量限制
        if (tags.length >= maxTags) {
            message.warning(`最多只能添加 ${maxTags} 个标签`);
            return;
        }

        // 检查长度限制
        if (trimmedValue.length > maxLength) {
            message.warning(`单个标签长度不能超过 ${maxLength} 个字符`);
            return;
        }

        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        setInputValue('');
        onChange?.(newTags);

        // 聚焦到输入框以便继续输入
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        onChange?.(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // 当输入框为空时按退格键删除最后一个标签
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div>
            {/* 已添加的标签 */}
            {tags.length > 0 && (
                <div style={{marginBottom: 8}}>
                    {tags.map((tag, index) => (
                        <Tag
                            key={`${tag}-${index}`}
                            closable
                            color={'#10b981'}
                            onClose={() => removeTag(tag)}
                            style={{marginRight: 8, marginBottom: 8}}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}

            {/* 输入框 */}
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPressEnter={addTag}
                placeholder={placeholder}
                maxLength={maxLength}
                suffix={
                    <span style={{color: '#999', fontSize: 12}}>
                        {tags.length}/{maxTags}
                    </span>
                }
            />
            <div style={{marginTop: 4, fontSize: 12, color: '#999'}}>
                按回车键添加标签，点击标签可删除
            </div>
        </div>
    );
};

interface CharacterManageDrawerProps {
    character: CharacterRole | null;
    characters: CharacterRole[] | []
    open: boolean;
    mode: 'create' | 'view' | 'edit';
    projectId: string | undefined;
    onClose: () => void;
    onSuccess: (character: CharacterRole, action: 'create' | 'update' | 'delete') => void;
}

const CharacterDetailDrawer: React.FC<CharacterManageDrawerProps> = (
    {
        character,
        characters,
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

    // 状态管理
    const [personalityTags, setPersonalityTags] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [editingRelationships, setEditingRelationships] =
        useState<CharacterRelationship[]>(character ? (character.relationships? character.relationships:[] ): []);

    // 数据处理工具函数
    const parseTagsInput = (input: string | string[] | undefined): string[] => {
        if (Array.isArray(input)) {
            return input;
        }
        if (!input) {
            return [];
        }
        return input.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
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
                const personalityTagsArray = parseTagsInput(character.personalityTags);
                const skillsArray = parseTagsInput(character.skills);

                form.setFieldsValue({
                    name: character.name,
                    age: character.age,
                    gender: character.gender,
                    roleInStory: character.roleInStory,
                    characterSetting: character.characterSetting
                });

                setPersonalityTags(personalityTagsArray);
                setSkills(skillsArray);
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

        // 使用状态中的标签数据
        /*@ts-ignore*/
        const personalityTagsArray = parseTagsInput(personalityTags);
        /*@ts-ignore*/
        const skillsArray = parseTagsInput(skills);

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
                // 准备基础更新数据
                const baseUpdateData: Partial<CharacterRole> = {
                    name: values.name?.trim() || '',
                    age: values.age,
                    gender: values.gender || '',
                    roleInStory: values.roleInStory?.trim() || '',
                    personalityTags: parseTagsInput(personalityTags),
                    skills: parseTagsInput(skills),
                    characterSetting: values.characterSetting?.trim() || ''
                };

                // 处理角色关系的对称更新
                const originalRelationships = character ? (character.relationships? character.relationships:[] ): [];
                const currentRelationships = editingRelationships;

                // 找出新增的关系
                const addedRelationships = currentRelationships.filter((newRel: CharacterRelationship) =>
                    !originalRelationships.some((origRel: CharacterRelationship) =>
                        origRel.relatedCharacterId === newRel.relatedCharacterId &&
                        origRel.relationshipType === newRel.relationshipType
                    )
                );

                const updateData: Partial<CharacterRole> = {
                    ...baseUpdateData,
                    relationships: currentRelationships
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
                    // 处理对称关系更新
                    try {
                        for (const newRelationship of addedRelationships) {
                            const relatedCharacter = characters.find((char: CharacterRole) =>
                                char.id === newRelationship.relatedCharacterId
                            );

                            if (relatedCharacter) {
                                const symmetricRelationship = createSymmetricRelationship(newRelationship);
                                const updatedRelatedCharacter: CharacterRole = {
                                    ...relatedCharacter,
                                    relationships: [...(relatedCharacter.relationships || []), symmetricRelationship]
                                };

                                // 异步更新关联角色（不等待结果，避免阻塞主流程）
                                characterRoleApi.updateCharacter(updatedRelatedCharacter).catch(err => {
                                    console.warn('Failed to update symmetric relationship for character:', relatedCharacter.id, err);
                                });
                            }
                        }
                    } catch (symmetricError) {
                        console.warn('Error updating symmetric relationships:', symmetricError);
                        // 不中断主流程，只是记录警告
                    }

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

    // 生成对称关系描述
    const generateSymmetricDescription = (_originalDescription: string) => {
        return `【由角色${character?.name || ''}创建的关系，注意及时更新！】`;
    };

    // 创建对称关系
    const createSymmetricRelationship = (relationship: CharacterRelationship): CharacterRelationship => {
        return {
            relatedCharacterId: character?.id || '',
            relatedCharacterName: character?.name || '',
            relationshipType: relationship.relationshipType,
            description: generateSymmetricDescription(relationship.description)
        };
    };

    // 处理关闭
    const handleClose = () => {
        form.resetFields();
        setPersonalityTags([]);
        setSkills([]);
        setEditingRelationships(character?character.relationships : []);
        setIsEditing(false);
        onClose();
    };

    // 处理取消编辑
    const handleCancelEdit = () => {
        if (character && mode !== 'create') {
            const personalityTagsArray = parseTagsInput(character.personalityTags);
            const skillsArray = parseTagsInput(character.skills);

            form.setFieldsValue({
                name: character.name,
                age: character.age,
                gender: character.gender,
                roleInStory: character.roleInStory,
                characterSetting: character.characterSetting
            });

            setPersonalityTags(personalityTagsArray);
            setSkills(skillsArray);
            setEditingRelationships(character.relationships || []);
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
                                <Tag key={`${tag}-${index}`} color={'#10b981'}
                                     style={{marginRight: 8, marginBottom: 8}}>
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    ) : (
                        <Text type="secondary"></Text>
                    )}
                </div>

                <div style={{marginBottom: 16}}>
                    <Text strong>技能特长: </Text>
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
                        label="性格标签"
                        extra={`已添加 ${personalityTags.length} 个标签`}
                    >
                        <TagInput
                            value={personalityTags}
                            onChange={setPersonalityTags}
                            placeholder="输入性格标签后按回车添加，如：勇敢、聪明、善良"
                            maxTags={10}
                            maxLength={20}
                        />
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
                            defaultValue={'无'}
                        />
                    </Form.Item>

                    <Form.Item
                        label="技能特长"
                        extra={`已添加 ${skills.length} 个技能`}
                    >
                        <TagInput
                            value={skills}
                            onChange={setSkills}
                            placeholder="输入技能特长后按回车添加，如：武术、医术、剑术"
                            maxTags={15}
                            maxLength={25}
                        />
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
                            defaultValue={'无'}
                        />
                    </Form.Item>

                     角色关系编辑部分
                    <CharacterRelationshipEditor
                        character={character}
                        characters={characters}
                        relationships={editingRelationships}
                        onRelationshipsChange={setEditingRelationships}
                    />
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
            size={520}
            // destroyOnClose
        >
            {isEditing ? renderEditView() : renderReadOnlyView()}
        </Drawer>
    );
};

export default CharacterDetailDrawer;