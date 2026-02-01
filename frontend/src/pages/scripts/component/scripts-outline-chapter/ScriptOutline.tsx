import React from 'react';
import {Button, Card, Flex, Space, Tree, Typography} from 'antd';
import {
    FundProjectionScreenOutlined,
    InfoCircleOutlined,
    NodeIndexOutlined,
    PlusOutlined,
    ReloadOutlined,
    RobotOutlined
} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";

const {Paragraph} = Typography;

interface ScriptOutlineProps {
    projectTitle: string;
}

// 定义树节点的数据类型
interface TreeNode {
    title: string;
    key: string;
    icon?: React.ReactNode;
    nodeDescription?: string;
    children?: TreeNode[];
}

const ScriptOutline: React.FC<ScriptOutlineProps> = ({projectTitle}) => {
    // 大纲结构数据
    const treeData: TreeNode[] = [
        {
            title: projectTitle || '剧本大纲',
            key: 'root',
            children: [
                {
                    title: '引 (Introduction)',
                    key: 'intro',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事的开端，介绍背景和人物'
                },
                {
                    title: '起 (Rising Action)',
                    key: 'rise',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事发展的开端，冲突初现'
                },
                {
                    title: '承 (Development)',
                    key: 'development',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事继续发展，冲突加深'
                },
                {
                    title: '转 (Climax)',
                    key: 'turn',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事高潮，转折点'
                },
                {
                    title: '合 (Conclusion)',
                    key: 'conclusion',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事结局，矛盾解决'
                },
                {
                    title: '引 (Introduction)',
                    key: 'intro',
                    icon: <NodeIndexOutlined/>,
                    nodeDescription: '故事的开端，介绍背景和人物'
                },
            ]
        }
    ];

    return (
        <Flex vertical style={{
            height: '100%',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minHeight: 'calc(100vh - 10px)',
            maxHeight: 'calc(100vh - 10px)',
            minWidth: 'max(1200px, calc(100vw - 340px))'
        }}>
            {/* 画布头部 */}
            <Flex justify="space-between" align="center" style={{
                marginBottom: 0, position: 'sticky', top: 0, zIndex: 1, background: '#fff',
            }}>
                <Title level={3} style={{margin: 0}}>
                    <Space>
                        <FundProjectionScreenOutlined/>
                        <span>剧本设计</span>
                    </Space>
                </Title>
                <Space>
                    <Button
                        // type="primary"
                        size="large"
                        icon={<ReloadOutlined/>}
                        onClick={() => {
                        }}
                    >
                        刷新
                    </Button>

                    <Button
                        // type="primary"
                        size="large"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                        }}
                    >
                        新建剧本
                    </Button>

                    <Button
                        // type="primary"
                        size="large"
                        icon={<RobotOutlined/>}
                        loading={false}
                        onClick={() => {
                        }}
                    >
                        AI设计
                    </Button>
                </Space>
            </Flex>
            <Card>
                <Flex style={{gap: '24px', minHeight: 400}}>
                    <Flex flex={2} vertical>
                        <Tree
                            defaultExpandAll
                            showLine
                            showIcon
                            treeData={treeData}
                            titleRender={(nodeData) => (
                                <div style={{
                                    padding: '8px 12px',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa',
                                    minWidth: 200
                                }}>
                                    <div style={{fontWeight: 'bold'}}>{nodeData.title}</div>
                                    {nodeData.nodeDescription && (
                                        <div style={{fontSize: '12px', color: '#666', marginTop: 4}}>
                                            {nodeData.nodeDescription}
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </Flex>

                    <Flex flex={1} vertical>
                        <Card
                            title={
                                <Space>
                                    <InfoCircleOutlined/>
                                    <span>说明</span>
                                </Space>
                            }
                            size="small"
                        >
                            <Paragraph>
                                <ul>
                                    <li>根节点为剧本项目名称</li>
                                    <li>一级子节点为经典叙事结构：引 -&gt; 起 -&gt; 承 -&gt; 转 -&gt; 合</li>
                                    <li>每个节点可点击进行编辑</li>
                                    <li>后续将完善拖拽、连线等交互功能</li>
                                </ul>
                            </Paragraph>
                        </Card>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    );
};

export default ScriptOutline;