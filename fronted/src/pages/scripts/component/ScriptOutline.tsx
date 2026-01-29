import React from 'react';

interface ScriptOutlineProps {
  projectTitle: string;
}

const ScriptOutline: React.FC<ScriptOutlineProps> = ({ projectTitle }) => {
  // 大纲结构数据
  const outlineStructure = [
    {
      id: 'root',
      title: projectTitle || '剧本大纲',
      children: [
        { id: 'intro', title: '引', type: 'intro' },
        { id: 'rise', title: '起', type: 'rise' },
        { id: 'development', title: '承', type: 'development' },
        { id: 'turn', title: '转', type: 'turn' },
        { id: 'conclusion', title: '合', type: 'conclusion' }
      ]
    }
  ];

  const renderNode = (node: any, level: number = 0) => (
    <div key={node.id} className={`outline-node level-${level}`}>
      <div className="node-content">
        <h4>{node.title}</h4>
        <p className="node-description">点击编辑内容</p>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child: any) => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="script-outline-container">
      <div className="outline-header">
        <h3>剧本大纲</h3>
        <p>以思维导图形式呈现剧本结构</p>
      </div>
      
      <div className="outline-canvas">
        <div className="outline-root">
          {outlineStructure.map(node => renderNode(node))}
        </div>
      </div>
      
      <div className="outline-instructions">
        <p>说明：</p>
        <ul>
          <li>根节点为剧本项目名称</li>
          <li>一级子节点为经典叙事结构：引 -&gt; 起 -&gt; 承 -&gt; 转 -&gt; 合</li>
          <li>每个节点可点击进行编辑</li>
          <li>后续将完善拖拽、连线等交互功能</li>
        </ul>
      </div>
    </div>
  );
};

export default ScriptOutline;