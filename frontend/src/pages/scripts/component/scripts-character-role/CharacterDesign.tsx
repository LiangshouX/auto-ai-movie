import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Badge, Button, Card, Col, Empty, Flex, Row, Space, Spin, Tag, Typography} from 'antd';
import {PlusOutlined, ReloadOutlined, RobotOutlined, UserOutlined} from '@ant-design/icons';
import {CharacterRole} from '@/api/types/character-role-types.ts';
import {characterRoleApi} from '@/api/service/character-role.ts';
import {ScriptProject} from '@/api/types/project-types.ts';
import CharacterDetailDrawer from "./CharacterDetailDrawer.tsx";

const {Title, Text} = Typography;

interface CharacterDesignProps {
    project: ScriptProject | null;
}

const CharacterDesign: React.FC<CharacterDesignProps> = ({project}) => {
    const {projectId} = useParams<{ projectId: string }>();
    const [characters, setCharacters] = useState<CharacterRole[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterRole | null>(null);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');

    // 获取项目的所有角色
    const fetchCharacters = useCallback(async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            const response = await characterRoleApi.getAllCharacters({projectId});
            if (response.success && response.data) {
                // 确保response.data是一个数组
                const charactersData = Array.isArray(response.data) ? response.data : [];
                setCharacters(charactersData as CharacterRole[]);
            } else {
                setCharacters([]); // 即使API调用失败也设置为空数组
            }
            setError(null);
        } catch (err: any) {
            setError(err.message || '获取角色列表失败');
            console.error('Error fetching characters:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    // 初始化
    useEffect(() => {
        if (project?.id) {
            fetchCharacters();
        }
    }, [project, fetchCharacters]);

    // AI设计角色（模拟）
    const handleAIDesign = async () => {
        if (!projectId) return;

        setIsAIGenerating(true);
        // 模拟AI生成过程
        setTimeout(() => {
            setIsAIGenerating(false);
            fetchCharacters();
        }, 2000);
    };

    // 处理角色更新成功
    const handleCharacterUpdate = (updatedCharacter: CharacterRole) => {
        // 更新本地角色列表
        setCharacters(prev =>
            prev.map(char =>
                char.id === updatedCharacter.id ? updatedCharacter : char
            )
        );

        // 更新当前选中的角色
        setSelectedCharacter(updatedCharacter);

        setDrawerOpen(false)

        // 重新获取角色列表以确保数据同步
        fetchCharacters();
    };

    // 角色卡片组件 - 重构为使用Ant Design Avatar组件
    const CharacterCard = ({character}: { character: CharacterRole }) => (
        <Card
            hoverable
            style={{height: '100%'}}
            onClick={() => {
                setSelectedCharacter(character);
                setDrawerMode('edit')
                setDrawerOpen(true);
            }}
            styles={{
                body: {
                    padding: '16px'
                }
            }}
        >
            <Flex vertical align="center">
                <Avatar
                    size={64}
                    icon={<UserOutlined/>}
                    style={{
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        marginBottom: 12
                    }}
                />
                <Title level={5} style={{margin: '8px 0'}}>{character.name}</Title>
                <div style={{marginBottom: 8}}>
                    <Tag color="blue">{character.age ? `${character.age}岁` : '年龄未知'}</Tag>
                </div>
                <Text type="secondary" style={{display: 'block'}}>
                    {character.roleInStory}
                </Text>
                <div style={{marginTop: 8}}>
                    <Badge
                        count={`${character.characterRelationships?.length ?? 0}个关系`}
                        overflowCount={99}
                    />
                </div>
            </Flex>
        </Card>
    );

    if (loading) {
        return (
            <Flex vertical style={{width: '100%'}}>
                <Flex justify="space-between" align="center" style={{marginBottom: 24}}>
                    <Title level={3}>角色设计</Title>
                    <Text type="secondary">正在加载角色数据...</Text>
                </Flex>
                <Flex align="center" justify="center" style={{padding: 40}}>
                    <Spin size="large" tip="加载中..."/>
                </Flex>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex vertical style={{width: '100%'}}>
                <Flex justify="space-between" align="center" style={{marginBottom: 24}}>
                    <Title level={3}>角色设计</Title>
                    <Text type="secondary">角色数据加载失败</Text>
                </Flex>
                <Card>
                    <Empty
                        description={error}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Flex justify="center" style={{marginTop: 16}}>
                        <Button onClick={fetchCharacters} type="primary">重试</Button>
                    </Flex>
                </Card>
            </Flex>
        );
    }

    return (
        <Flex vertical style={{
            minHeight: 'calc(100vh - 64px)',
            minWidth: 'max(1200px, calc(100vw - 340px))'
        }}>
            {/* 画布头部 */}
            <Flex justify="space-between" align="center" style={{
                marginBottom: 0, position: 'sticky', top: 0, zIndex: 1, background: '#fff',
            }}>
                <Title level={3} style={{margin: 0}}>角色设计</Title>
                <Space>
                    <Button
                        // type="primary"
                        size="large"
                        icon={<ReloadOutlined/>}
                        onClick={fetchCharacters}
                    >
                        刷新
                    </Button>

                    <Button
                        // type="primary"
                        size="large"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setDrawerOpen(true)
                            setDrawerMode('create')
                        }}
                    >
                        新建角色
                    </Button>

                    <Button
                        // type="primary"
                        size="large"
                        icon={<RobotOutlined/>}
                        loading={isAIGenerating}
                        onClick={handleAIDesign}
                    >
                        {isAIGenerating ? 'AI创建角色中...' : 'AI设计'}
                    </Button>
                </Space>
            </Flex>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                    <Card style={{minHeight: 400}}>
                        {characters.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {characters.map(character => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={character.id}>
                                        <CharacterCard key={character.id} character={character}/>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Flex align="center" justify="center" style={{height: 300}}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="暂无角色，请点击‘AI设计’按钮创建角色"
                                />
                            </Flex>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* 角色详情抽屉 */}
            <CharacterDetailDrawer
                character={selectedCharacter}
                characters={characters}
                open={drawerOpen}
                mode={drawerMode}
                projectId={projectId}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedCharacter(null);
                }}
                onSuccess={handleCharacterUpdate}
            />
        </Flex>
    );
};

export default CharacterDesign;