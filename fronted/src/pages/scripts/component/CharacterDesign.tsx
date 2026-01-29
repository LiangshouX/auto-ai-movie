import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CharacterRole } from '../../../api/types/character-role-types';
import { characterRoleApi } from '../../../api/service/character-role';
import { ScriptProject } from '../../../api/types/project-types';

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
    <div 
      className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
      onClick={() => setSelectedCharacter(character)}
    >
      <h4>{character.name}</h4>
      <p><strong>年龄:</strong> {character.age || '未知'}</p>
      <p><strong>身份:</strong> {character.roleInStory}</p>
      <p><strong>关系:</strong> {character.relationships?.length ?? 0}个</p>
    </div>
  );

  if (loading) {
    return (
      <div className="character-design-container">
        <div className="canvas-header">
          <h3>角色设计</h3>
          <p>正在加载角色数据...</p>
        </div>
        <div className="loading-placeholder">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-design-container">
        <div className="canvas-header">
          <h3>角色设计</h3>
          <p>角色数据加载失败</p>
        </div>
        <div className="error-placeholder">
          <p>{error}</p>
          <button onClick={fetchCharacters}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="character-design-container">
      {/* 画布头部 */}
      <div className="canvas-header">
        <h3>角色设计</h3>
        <div className="canvas-actions">
          <button 
            className="btn btn-ai"
            onClick={handleAIDesign}
            disabled={isAIGenerating}
          >
            {isAIGenerating ? 'AI创建角色中...' : 'AI设计'}
          </button>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="canvas-area">
        <div className="characters-grid">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
        
        {characters.length === 0 && (
          <div className="empty-canvas">
            <p>暂无角色，请点击"AI设计"按钮创建角色，或手动添加角色。</p>
          </div>
        )}
      </div>

      {/* 右侧详情面板 */}
      {selectedCharacter && (
        <div className="character-detail-panel">
          <div className="detail-header">
            <h4>角色详情: {selectedCharacter.name}</h4>
            <button className="close-btn" onClick={() => setSelectedCharacter(null)}>×</button>
          </div>
          <div className="detail-content">
            <p><strong>年龄:</strong> {selectedCharacter.age || '未知'}</p>
            <p><strong>性别:</strong> {selectedCharacter.gender || '未知'}</p>
            <p><strong>性格标签:</strong> {Array.isArray(selectedCharacter.personalityTags) ? selectedCharacter.personalityTags.join(', ') : selectedCharacter.personalityTags || '无'}</p>
            <p><strong>角色定位:</strong> {selectedCharacter.roleInStory}</p>
            <p><strong>技能:</strong> {Array.isArray(selectedCharacter.skills) ? selectedCharacter.skills.join(', ') : selectedCharacter.skills || '无'}</p>
            <p><strong>背景设定:</strong> {selectedCharacter.characterSetting || '无'}</p>
            
            <div className="relationships-section">
              <h5>角色关系</h5>
              {(selectedCharacter.relationships?.length ?? 0) === 0 ? (
                <p>暂无关系</p>
              ) : (
                <ul>
                  {selectedCharacter.relationships?.map((rel: any, index: number) => {
                    const key = rel.id || `${selectedCharacter.id}-rel-${index}`;
                    return (
                      <li key={key}>
                        <span>{rel.relatedCharacterName}</span>
                        <span className="relationship-type">{rel.relationshipType}</span>
                        <span>{rel.description}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDesign;