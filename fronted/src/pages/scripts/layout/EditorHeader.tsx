import React from 'react';
import {Button, Layout, Space, Typography} from 'antd';
import {BackwardOutlined, HomeOutlined} from "@ant-design/icons";

const {Header} = Layout;
const {Title, Text} = Typography;

interface EditorHeaderProps {
    title: string;
    projectTitle: string;
    onBackClick: () => void;
    onHomeClick: () => void;
    onSaveClick: () => void;
    onCancelClick: () => void;
    onExportClick: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
                                                       title,
                                                       projectTitle,
                                                       onBackClick,
                                                       onHomeClick,
                                                       onSaveClick,
                                                       onCancelClick,
                                                       onExportClick
                                                   }) => {
    return (
        <Header
            className="editor-header"
            style={{
                backgroundColor: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px #f0f0f0',
                zIndex: 100,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 64,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                borderBottom: '1px solid #e0e0e0'
            }}
        >
            <Space size="middle">
                <Button
                    onClick={onBackClick}
                    icon=<BackwardOutlined/>
                    type="default"
                >
                    返回
                </Button>
                <Button
                    onClick={onHomeClick}
                    icon=<HomeOutlined/>
                    type="default"
                >
                    首页
                </Button>
            </Space>

            <div style={{textAlign: 'center', flex: 1}}>
                <Title level={3} style={{margin: 0}}>{title}</Title>
                <Text type="secondary" style={{display: 'block'}}>
                    正在编辑：{projectTitle || '未命名项目'}
                </Text>
            </div>

            <Space size="small">
                <Button
                    onClick={onExportClick}
                    type="default"
                >
                    导出剧本
                </Button>
                <Button
                    onClick={onCancelClick}
                    type="default"
                >
                    取消
                </Button>
                <Button
                    onClick={onSaveClick}
                    type="primary"
                    style={{backgroundColor: '#1890ff'}}
                >
                    保存
                </Button>
            </Space>
        </Header>
    );
};

export default EditorHeader;