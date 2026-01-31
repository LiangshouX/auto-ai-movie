import {Button, Input, Layout, message, Modal, Space, Typography} from "antd";
import {HomeOutlined, PlusOutlined} from "@ant-design/icons";
// import { HomeOutlined, PlusOutlined, UserOutlined, TeamOutlined, EditOutlined, DeleteOutlined, RobotOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import RoleCanvas from "./component/scripts-character-role/canva/RoleCanvas.tsx";
import {
    addCharacter,
    deleteCharacter,
    findCharacterById,
    mockCharacters,
    updateCharacter
} from "./component/scripts-character-role/data/mockCharacters";
import {CharacterRelationship, CharacterRole, Gender} from "../../api/types/character-role-types";
import CharacterDetailSidebar from "./component/scripts-character-role/CharacterDetailSidebar.tsx";
import AddCharacterModal from "./component/scripts-character-role/AddCharacterModal.tsx";

const {Title} = Typography;
const {Search} = Input;
const {Header, Content} = Layout;

const CharacterManager = () => {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<CharacterRole[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [showRelationshipModal, setShowRelationshipModal] = useState(false);
    // const [relationshipForm] = Form.useForm();
    // const [sourceRoleId, setSourceRoleId] = useState<string>('');
    
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
            message.info(`选中角色: ${character.name}`);
        }
    };

    // 处理创建新角色
    const handleCreateRole = (position: { x: number; y: number }) => {
        setIsModalVisible(true);
        message.info(`将在位置 (${Math.round(position.x)}, ${Math.round(position.y)}) 创建新角色`);
    };

    // 处理AI角色设计
    const handleAIRoleDesign = async () => {
        try {
            message.loading({ content: 'AI正在分析剧本并设计角色...', duration: 0, key: 'ai-loading' });
            // 模拟AI处理时间
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 模拟AI生成的新角色
            const aiGeneratedRoles = [
                {
                    projectId: '07ca8285a4bfa47abd869415cf9fe404',
                    name: '神秘导师',
                    age: 45,
                    gender: Gender.MALE,
                    personalityTags: ['智慧', '神秘', '严肃'],
                    roleInStory: '主角的精神导师，掌握着关键的秘密',
                    skills: ['古老知识', '心灵感应', '预知能力'],
                    characterSetting: '总是穿着深色长袍，眼神深邃',
                    relationships: []
                },
                {
                    projectId: '07ca8285a4bfa47abd869415cf9fe404',
                    name: '叛逆少女',
                    age: 19,
                    gender: Gender.FEMALE,
                    personalityTags: ['反叛', '聪明', '独立'],
                    roleInStory: '表面是普通学生，实际上是地下组织成员',
                    skills: ['黑客技术', '格斗技巧', '社交工程'],
                    characterSetting: '喜欢穿皮夹克，总是戴着耳机',
                    relationships: []
                }
            ];
            
            // 添加AI生成的角色
            const newCharacters = aiGeneratedRoles.map(roleData => addCharacter(roleData));
            setCharacters(prev => [...prev, ...newCharacters]);
            
            message.success({ content: 'AI角色设计完成！新增2个角色', key: 'ai-loading' });
        } catch (error) {
            message.error({ content: 'AI角色设计失败', key: 'ai-loading' });
        }
    };

    // 处理角色创建成功回调
    const handleCharacterCreated = (newCharacter: CharacterRole) => {
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
            message.info(`编辑角色: ${character.name}`);
            // 这里可以打开编辑模态框，预填角色数据
        }
    };

    // 处理添加关系
    const handleAddRelationship = (sourceId: string, targetId: string, relationshipData: Omit<CharacterRelationship, 'relatedCharacterName'>) => {
        const updatedCharacters = characters.map(char => {
            if (char.id === sourceId) {
                // 添加关系到源角色
                const targetCharacter = findCharacterById(targetId);
                const newRelationship: CharacterRelationship = {
                    ...relationshipData,
                    relatedCharacterName: targetCharacter?.name || '未知角色'
                };
                
                return {
                    ...char,
                    relationships: [...char.relationships, newRelationship]
                };
            }
            return char;
        });
        
        setCharacters(updatedCharacters);
        updateCharacter(sourceId, updatedCharacters.find(c => c.id === sourceId)!);
        message.success('角色关系添加成功！');
    };

    // 处理删除关系
    const handleRemoveRelationship = (sourceId: string, targetId: string) => {
        const updatedCharacters = characters.map(char => {
            if (char.id === sourceId) {
                return {
                    ...char,
                    relationships: char.relationships.filter(rel => rel.relatedCharacterId !== targetId)
                };
            }
            return char;
        });
        
        setCharacters(updatedCharacters);
        updateCharacter(sourceId, updatedCharacters.find(c => c.id === sourceId)!);
        message.success('角色关系删除成功！');
    };

    // TODO
    // 获取性别显示文本
    // const getGenderDisplay = (gender: string) => {
    //     switch (gender) {
    //         case Gender.MALE: return '男';
    //         case Gender.FEMALE: return '女';
    //         case Gender.OTHER: return '其他';
    //         default: return '未知';
    //     }
    // };
    //
    // // 获取关系类型显示文本
    // const getRelationshipTypeDisplay = (relationshipType: string) => {
    //     switch (relationshipType) {
    //         case RelationshipType.FRIEND: return '朋友';
    //         case RelationshipType.ENEMY: return '敌人';
    //         case RelationshipType.LOVER: return '恋人';
    //         case RelationshipType.FAMILY: return '家人';
    //         case RelationshipType.COLLEAGUE: return '同事';
    //         case RelationshipType.ACQUAINTANCE: return '熟人';
    //         case RelationshipType.RIVAL: return '对手';
    //         case RelationshipType.MENTOR: return '导师';
    //         case RelationshipType.PROTEGE: return '学生';
    //         default: return '其他';
    //     }
    // };

    // 处理模态框取消
    const handleModalCancel = () => {
        setIsModalVisible(false);
        // createForm.resetFields();
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
                    onRelationshipAdd={handleAddRelationship}
                    onRelationshipRemove={handleRemoveRelationship}
                />
            </Content>
            
            {/* 创建角色模态框 */}
            <AddCharacterModal
                visible={isModalVisible}
                projectId="07ca8285a4bfa47abd869415cf9fe404"
                onCancel={handleModalCancel}
                onCreated={handleCharacterCreated}
            />

            {/* 角色详情侧边栏 */}
            <CharacterDetailSidebar
                selectedRoleId={selectedRoleId}
                onEdit={handleEditCharacter}
                onDelete={handleDeleteCharacter}
            />
        </Layout>
    );
}

export default CharacterManager;