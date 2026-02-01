import React, {useState} from 'react';
import {Button, Card, Divider, Input, Popconfirm, Select, Space, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {CharacterRelationship, CharacterRole, RelationshipType} from '@/api/types/character-role-types.ts';

const {Text} = Typography;

interface CharacterRelationshipEditorProps {
    character: CharacterRole | null;
    characters: CharacterRole[];
    relationships: CharacterRelationship[] | undefined;
    onRelationshipsChange: (relationships: CharacterRelationship[]) => void;
}

const CharacterRelationshipEditor: React.FC<CharacterRelationshipEditorProps> = (
    {
        character,
        characters,
        relationships = [], // 默认值确保不为 undefined
        onRelationshipsChange
    }
) => {
    const [editingRelationshipIndex, setEditingRelationshipIndex] = useState<number | null>(null);

    // 角色关系操作函数
    const handleAddRelationship = () => {
        const newRelationship: CharacterRelationship = {
            relatedCharacterId: '',
            relatedCharacterName: '',
            relationshipType: '',
            description: ''
        };
        const safeRelationships = relationships || [];
        const updatedRelationships = [...safeRelationships, newRelationship];
        onRelationshipsChange(updatedRelationships);
        setEditingRelationshipIndex(safeRelationships.length);
    };

    const handleUpdateRelationship = (index: number, field: keyof CharacterRelationship, value: string) => {
        const safeRelationships = relationships || [];
        const updatedRelationships = [...safeRelationships];
        updatedRelationships[index] = {
            ...updatedRelationships[index],
            [field]: value
        };

        // 如果是选择角色，自动填充角色名
        if (field === 'relatedCharacterId' && value) {
            const selectedCharacter = characters.find((char: CharacterRole) => char.id === value);
            if (selectedCharacter) {
                updatedRelationships[index].relatedCharacterName = selectedCharacter.name;
            }
        }

        onRelationshipsChange(updatedRelationships);
    };

    const handleRemoveRelationship = (index: number) => {
        const safeRelationships = relationships || [];
        const updatedRelationships = safeRelationships.filter((_, i) => i !== index);
        onRelationshipsChange(updatedRelationships);
        if (editingRelationshipIndex === index) {
            setEditingRelationshipIndex(null);
        } else if (editingRelationshipIndex !== null && editingRelationshipIndex > index) {
            setEditingRelationshipIndex(editingRelationshipIndex - 1);
        }
    };

    const handleCancelEditRelationship = (index: number) => {
        const safeRelationships = relationships || [];
        // 如果是新建的空关系，直接删除
        if (index >= safeRelationships.length || !safeRelationships[index]?.relatedCharacterId) {
            handleRemoveRelationship(index);
        } else {
            setEditingRelationshipIndex(null);
        }
    };

    // 获取可用的角色选项（排除当前角色本身）
    const getAvailableCharacters = () => {
        return characters.filter((char: CharacterRole) => char.id !== character?.id);
    };

    // 获取关系类型选项
    const getRelationshipTypes = () => {
        return [
            {value: RelationshipType.FRIEND, label: '朋友'},
            {value: RelationshipType.ENEMY, label: '敌人'},
            {value: RelationshipType.LOVER, label: '恋人'},
            {value: RelationshipType.FAMILY, label: '家人'},
            {value: RelationshipType.COLLEAGUE, label: '同事'},
            {value: RelationshipType.ACQUAINTANCE, label: '熟人'},
            {value: RelationshipType.RIVAL, label: '对手'},
            {value: RelationshipType.MENTOR, label: '导师'},
            {value: RelationshipType.PROTEGE, label: '学生'},
            {value: RelationshipType.OTHER, label: '其他'}
        ];
    };

    return (
        <div>
            <Divider>编辑角色关系</Divider>
            <div style={{marginBottom: 16}}>
                <Button
                    type="dashed"
                    onClick={handleAddRelationship}
                    block
                    style={{borderStyle: 'dashed'}}
                >
                    <PlusOutlined/> 新增一行
                </Button>
            </div>

            {(relationships || []).length > 0 && (
                <div>
                    {relationships.map((relationship, index) => (
                        <Card
                            key={index}
                            size="small"
                            style={{marginBottom: 12}}
                            actions={editingRelationshipIndex === index ? [
                                <Button
                                    size="small"
                                    onClick={() => handleCancelEditRelationship(index)}
                                >
                                    退出编辑
                                </Button>
                            ] : [
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => setEditingRelationshipIndex(index)}
                                >
                                    编辑
                                </Button>,
                                <Popconfirm
                                    title="确定要删除这个关系吗？"
                                    onConfirm={() => handleRemoveRelationship(index)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="link" size="small" danger>
                                        删除
                                    </Button>
                                </Popconfirm>
                            ]}
                        >
                            {editingRelationshipIndex === index ? (
                                <Space orientation="vertical" style={{width: '100%'}}>
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="选择关联角色"
                                        value={relationship.relatedCharacterId || undefined}
                                        onChange={(value) => handleUpdateRelationship(index, 'relatedCharacterId', value)}
                                        options={getAvailableCharacters().map(char => ({
                                            value: char.id,
                                            label: char.name
                                        }))}
                                    />
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="选择关系类型"
                                        value={relationship.relationshipType || undefined}
                                        onChange={(value) => handleUpdateRelationship(index, 'relationshipType', value)}
                                        options={getRelationshipTypes()}
                                    />
                                    <Input
                                        placeholder="关系描述"
                                        value={relationship.description}
                                        onChange={(e) => handleUpdateRelationship(index, 'description', e.target.value)}
                                    />
                                </Space>
                            ) : (
                                <Space orientation="vertical">
                                    <Text><strong>关联角色:</strong> {relationship.relatedCharacterName || '未选择'}
                                    </Text>
                                    <Text><strong>关系类型:</strong> {getRelationshipTypes().find(t => t.value === relationship.relationshipType)?.label || '未选择'}
                                    </Text>
                                    <Text><strong>关系描述:</strong> {relationship.description || '无'}</Text>
                                </Space>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {(relationships || []).length === 0 && (
                <Text type="secondary">暂无角色关系，点击上方按钮添加</Text>
            )}
        </div>
    );
};

export default CharacterRelationshipEditor;