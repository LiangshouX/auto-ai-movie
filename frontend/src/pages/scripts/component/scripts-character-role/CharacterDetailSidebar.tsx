import {Button, Card, Col, Row, Tag, Typography} from "antd";
import {DeleteOutlined, EditOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Gender, RelationshipType} from "../../../../api/types/character-role-types";
import {findCharacterById} from "./data/mockCharacters";

const { Title, Text } = Typography;

interface CharacterDetailSidebarProps {
    selectedRoleId: string | null;
    onEdit: (roleId: string) => void;
    onDelete: (roleId: string) => void;
}

const CharacterDetailSidebar = ({ selectedRoleId, onEdit, onDelete }: CharacterDetailSidebarProps) => {
    if (!selectedRoleId) return null;

    const character = findCharacterById(selectedRoleId);
    if (!character) return null;

    // 获取性别显示文本
    const getGenderDisplay = (gender: string) => {
        switch (gender) {
            case Gender.MALE: return '男';
            case Gender.FEMALE: return '女';
            case Gender.OTHER: return '其他';
            default: return '未知';
        }
    };

    // 获取关系类型显示文本
    const getRelationshipTypeDisplay = (relationshipType: string) => {
        switch (relationshipType) {
            case RelationshipType.FRIEND: return '朋友';
            case RelationshipType.ENEMY: return '敌人';
            case RelationshipType.LOVER: return '恋人';
            case RelationshipType.FAMILY: return '家人';
            case RelationshipType.COLLEAGUE: return '同事';
            case RelationshipType.ACQUAINTANCE: return '熟人';
            case RelationshipType.RIVAL: return '对手';
            case RelationshipType.MENTOR: return '导师';
            case RelationshipType.PROTEGE: return '学生';
            default: return '其他';
        }
    };

    return (
        <div style={{
            position: 'absolute',
            right: 0,
            top: 64,
            bottom: 0,
            width: 320,
            backgroundColor: '#fff',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            overflowY: 'auto'
        }}>
            <div style={{ padding: 24 }}>
                <Title level={3} style={{ margin: '0 0 16px 0', color: '#1f1f1f' }}>
                    {character.name}
                </Title>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <Tag icon={<UserOutlined />} color="blue">
                        {getGenderDisplay(character.gender || '')}
                    </Tag>
                    {character.age && (
                        <Tag color="green">{character.age}岁</Tag>
                    )}
                </div>

                <Text strong>在故事中的定位：</Text>
                <br />
                <Text type="secondary">{character.roleInStory}</Text>

                <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ margin: '16px 0 12px 0', color: '#434343' }}>性格标签</Title>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {character.personalityTags.map((tag, index) => (
                            <Tag key={index} color="purple">{tag}</Tag>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ margin: '16px 0 12px 0', color: '#434343' }}>技能</Title>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {character.skills.map((skill, index) => (
                            <Tag key={index} color="cyan">{skill}</Tag>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ margin: '16px 0 12px 0', color: '#434343' }}>角色设定</Title>
                    <Text type="secondary">{character.characterSetting || '暂无设定'}</Text>
                </div>

                {(character.characterRelationships?.length ?? 0) > 0 && (
                    <div>
                        <Title level={4} style={{ margin: '16px 0 12px 0', color: '#434343' }}>
                            <TeamOutlined /> 人际关系
                        </Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {(character.characterRelationships || []).map((rel, index) => (
                                <Card size="small" key={index}>
                                    <div>
                                        <Text strong>{rel.relatedCharacterName}</Text>
                                        <Tag color="orange" style={{ marginLeft: 8 }}>
                                            {getRelationshipTypeDisplay(rel.relationshipType)}
                                        </Tag>
                                        <br />
                                        <Text type="secondary">{rel.description}</Text>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: '#fff',
                    paddingTop: 16,
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Button
                                block
                                icon={<EditOutlined />}
                                onClick={() => onEdit(selectedRoleId)}
                            >
                                编辑
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                block
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(selectedRoleId)}
                            >
                                删除
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default CharacterDetailSidebar;
