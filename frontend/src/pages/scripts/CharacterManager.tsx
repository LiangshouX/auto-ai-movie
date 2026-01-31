import { Button, Input, Layout, Space, Typography, Modal, message, Card, Row, Col, Tag } from "antd";
import { HomeOutlined, PlusOutlined, UserOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RoleCanvas from "./component/scripts-character-role/RoleCanvas";
import { mockCharacters, addCharacter, findCharacterById, deleteCharacter } from "./component/scripts-character-role/data/mockCharacters";
import { CharacterRole, Gender, RelationshipType } from "../../api/types/character-role-types";

const {Title} = Typography;
const {Search} = Input;
const {Header, Content} = Layout;

const CharacterManager = () => {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<CharacterRole[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // 初始化数据
    useEffect(() => {
        // 模拟异步加载数据
        setIsLoading(true);
        setTimeout(() => {
            setCharacters(mockCharacters);
            setIsLoading(false);
        }, 500);
    }, []);

    // 处理角色点击
    const handleRoleClick = (roleId: string) => {
        setSelectedRoleId(roleId);
        const character = findCharacterById(roleId);
        if (character) {
            // 这里可以打开角色详情弹窗或跳转到详情页面
            message.info(`点击了角色: ${character.name}`);
        }
    };

    // 处理创建新角色
    const handleCreateRole = (position: { x: number; y: number }) => {
        // 这里可以打开创建角色的模态框
        setIsModalVisible(true);
        message.success(`将在位置 (${position.x}, ${position.y}) 创建新角色`);
    };

    // 处理AI角色设计
    const handleAIRoleDesign = async () => {
        try {
            message.loading('AI正在设计角色...', 2);
            // 模拟AI处理时间
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('AI角色设计完成！');
        } catch (error) {
            message.error('AI角色设计失败');
        }
    };

    // 处理模态框确认
    const handleModalOk = () => {
        // 这里应该处理创建角色的逻辑
        const newCharacter = addCharacter({
            projectId: '07ca8285a4bfa47abd869415cf9fe404',
            name: '新角色',
            age: 20,
            gender: Gender.UNKNOWN,
            personalityTags: [],
            roleInStory: '新创建的角色',
            skills: [],
            characterSetting: '待完善',
            relationships: []
        });
        
        setCharacters([...characters, newCharacter]);
        setIsModalVisible(false);
        message.success('角色创建成功！');
    };

    // 处理角色删除
    const handleDeleteCharacter = (roleId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个角色吗？此操作不可撤销。',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const success = deleteCharacter(roleId);
                if (success) {
                    setCharacters(characters.filter(char => char.id !== roleId));
                    message.success('角色删除成功！');
                    if (selectedRoleId === roleId) {
                        setSelectedRoleId(null);
                    }
                } else {
                    message.error('角色删除失败！');
                }
            }
        });
    };

    // 处理角色编辑
    const handleEditCharacter = (roleId: string) => {
        const character = findCharacterById(roleId);
        if (character) {
            // 这里可以打开编辑模态框
            message.info(`编辑角色: ${character.name}`);
        }
    };

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

    // 处理模态框取消
    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{height: '100vh'}}>
            <Header style={{
                backgroundColor: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px #f0f0f0',
                zIndex: 100,
                width: '100%',
                minWidth: 'max(1200px, calc(100vw - 200px))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 64,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Space size="large">
                    <Button onClick={() => navigate('/')} type="text" size="large">
                        <HomeOutlined/> 首页
                    </Button>
                    <Title level={2} style={{margin: 0, color: 'rgba(0, 0, 0, 0.88)'}}>
                        角色管理
                    </Title>
                </Space>

                <Space>
                    <Search
                        placeholder="搜索角色..."
                        style={{width: 300, marginRight: 16}}
                        allowClear
                    />
                    <Button
                        type="default"
                        size="large"
                        onClick={() => {
                            // 刷新逻辑
                            setIsLoading(true);
                            setTimeout(() => {
                                setCharacters([...mockCharacters]);
                                setIsLoading(false);
                                message.success('刷新成功');
                            }, 500);
                        }}
                    >
                        刷新
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        新建角色
                    </Button>
                </Space>
            </Header>
            
            <Content style={{
                marginTop: 64,
                height: 'calc(100vh - 64px)',
                position: 'relative'
            }}>
                <RoleCanvas
                    roles={characters}
                    onRoleClick={handleRoleClick}
                    onCreateRole={handleCreateRole}
                    onAIRoleDesign={handleAIRoleDesign}
                    isLoading={isLoading}
                />
            </Content>
            
            {/* 创建角色模态框 */}
            <Modal
                title="创建新角色"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="创建"
                cancelText="取消"
            >
                <p>这里可以添加创建角色的表单</p>
                <p>当前为演示版本，点击确定将创建一个默认角色。</p>
            </Modal>

            {/* 角色详情侧边栏 */}
            {selectedRoleId && (
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
                        {(() => {
                            const character = findCharacterById(selectedRoleId);
                            if (!character) return null;
                            
                            return (
                                <>
                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ margin: '0 0 16px 0', color: '#1f1f1f' }}>
                                            {character.name}
                                        </h3>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                            <Tag icon={<UserOutlined />} color="blue">
                                                {getGenderDisplay(character.gender || '')}
                                            </Tag>
                                            {character.age && (
                                                <Tag color="green">{character.age}岁</Tag>
                                            )}
                                        </div>
                                        <p style={{ color: '#666', fontSize: 14 }}>
                                            <strong>在故事中的定位：</strong>
                                            <br />
                                            {character.roleInStory}
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: '#434343' }}>性格标签</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {character.personalityTags.map((tag, index) => (
                                                <Tag key={index} color="purple">{tag}</Tag>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: '#434343' }}>技能</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {character.skills.map((skill, index) => (
                                                <Tag key={index} color="cyan">{skill}</Tag>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: '#434343' }}>角色设定</h4>
                                        <p style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>
                                            {character.characterSetting || '暂无设定'}
                                        </p>
                                    </div>

                                    {character.relationships.length > 0 && (
                                        <div>
                                            <h4 style={{ margin: '0 0 12px 0', color: '#434343' }}>
                                                <TeamOutlined /> 人际关系
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                {character.relationships.map((rel, index) => (
                                                    <Card size="small" key={index}>
                                                        <div>
                                                            <strong>{rel.relatedCharacterName}</strong>
                                                            <Tag color="orange" style={{ marginLeft: 8 }}>
                                                                {getRelationshipTypeDisplay(rel.relationshipType)}
                                                            </Tag>
                                                            <p style={{ margin: '8px 0 0 0', fontSize: 13, color: '#666' }}>
                                                                {rel.description}
                                                            </p>
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
                                                    onClick={() => handleEditCharacter(selectedRoleId)}
                                                >
                                                    编辑
                                                </Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button 
                                                    block 
                                                    danger 
                                                    icon={<DeleteOutlined />} 
                                                    onClick={() => handleDeleteCharacter(selectedRoleId)}
                                                >
                                                    删除
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default CharacterManager;
