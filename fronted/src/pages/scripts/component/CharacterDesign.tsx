import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  List, 
  Tag, 
  Divider, 
  Empty, 
  Spin, 
  Descriptions,
  Badge,
  Flex
} from 'antd';
import { RobotOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { CharacterRole } from '../../../api/types/character-role-types';
import { characterRoleApi } from '../../../api/service/character-role';
import { ScriptProject } from '../../../api/types/project-types';

const { Title, Text } = Typography;

interface CharacterDesignProps {
  project: ScriptProject | null;
}

const CharacterDesign: React.FC<CharacterDesignProps> = ({ project }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [characters, setCharacters] = useState<CharacterRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterRole | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);

  // 获取项目的所有角色
  const fetchCharacters = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const response = await characterRoleApi.getAllCharacters(projectId);
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

  // 角色卡片组件
  const CharacterCard = ({ character }: { character: CharacterRole }) => (
    <Card 
      hoverable
      style={{ height: '100%' }}
      onClick={() => setSelectedCharacter(character)}
      styles={{
        body: {
          padding: '16px'
        }
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: 64, 
          height: 64, 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 12px' 
        }}>
          <UserOutlined style={{ fontSize: 24, color: '#666' }} />
        </div>
        <Title level={5} style={{ margin: '8px 0' }}>{character.name}</Title>
        <div style={{ marginBottom: 8 }}>
          <Tag color="blue">{character.age ? `${character.age}岁` : '年龄未知'}</Tag>
        </div>
        <Text type="secondary" style={{ display: 'block' }}>
          {character.roleInStory}
        </Text>
        <div style={{ marginTop: 8 }}>
          <Badge 
            count={`${character.relationships?.length ?? 0}个关系`} 
            overflowCount={99}
          />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Flex vertical style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Title level={3}>角色设计</Title>
          <Text type="secondary">正在加载角色数据...</Text>
        </Flex>
        <Flex align="center" justify="center" style={{ padding: 40 }}>
          <Spin size="large" tip="加载中..." />
        </Flex>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex vertical style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Title level={3}>角色设计</Title>
          <Text type="secondary">角色数据加载失败</Text>
        </Flex>
        <Card>
          <Empty 
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Flex justify="center" style={{ marginTop: 16 }}>
            <Button onClick={fetchCharacters} type="primary">重试</Button>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ width: '100%' }}>
      {/* 画布头部 */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>角色设计</Title>
        <Space>
          <Button 
            type="primary"
            icon={<RobotOutlined />}
            loading={isAIGenerating}
            onClick={handleAIDesign}
          >
            {isAIGenerating ? 'AI创建角色中...' : 'AI设计'}
          </Button>
        </Space>
      </Flex>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={selectedCharacter ? 16 : 24}>
          <Card style={{ minHeight: 400 }}>
            {characters.length > 0 ? (
              <Row gutter={[24, 24]}>
                {characters.map(character => (
                  <Col xs={24} sm={12} md={8} lg={6} key={character.id}>
                    <CharacterCard key={character.id} character={character} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Flex align="center" justify="center" style={{ height: 300 }}>
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无角色，请点击‘AI设计’按钮创建角色"
                />
              </Flex>
            )}
          </Card>
        </Col>

        {/* 右侧详情面板 */}
        {selectedCharacter && (
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Flex justify="space-between" align="center">
                  <span>角色详情: {selectedCharacter.name}</span>
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => setSelectedCharacter(null)}
                  />
                </Flex>
              }
              style={{ height: 'fit-content' }}
            >
              <Descriptions 
                bordered 
                column={1}
                size="small"
              >
                <Descriptions.Item label="姓名">
                  {selectedCharacter.name}
                </Descriptions.Item>
                <Descriptions.Item label="年龄">
                  {selectedCharacter.age ? `${selectedCharacter.age}岁` : '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="性别">
                  {selectedCharacter.gender || '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="角色定位">
                  {selectedCharacter.roleInStory}
                </Descriptions.Item>
                <Descriptions.Item label="性格标签">
                  {Array.isArray(selectedCharacter.personalityTags) ? 
                    selectedCharacter.personalityTags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    )) : 
                    selectedCharacter.personalityTags || '无'}
                </Descriptions.Item>
                <Descriptions.Item label="技能">
                  {Array.isArray(selectedCharacter.skills) ? 
                    selectedCharacter.skills.map(skill => (
                      <Tag key={skill} color="green">{skill}</Tag>
                    )) : 
                    selectedCharacter.skills || '无'}
                </Descriptions.Item>
                <Descriptions.Item label="背景设定" span={2}>
                  {selectedCharacter.characterSetting || '无'}
                </Descriptions.Item>
              </Descriptions>

              <Divider>角色关系</Divider>
              {(selectedCharacter.relationships?.length ?? 0) === 0 ? (
                <Text type="secondary">暂无关系</Text>
              ) : (
                <List
                  dataSource={selectedCharacter.relationships}
                  renderItem={(rel: any, index: number) => {
                    const key = rel.id || `${selectedCharacter.id}-rel-${index}`;
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
            </Card>
          </Col>
        )}
      </Row>
    </Flex>
  );
};

export default CharacterDesign;