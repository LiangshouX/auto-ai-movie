import React from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import { BackwardOutlined, HomeOutlined } from '@ant-design/icons';

const {Header} = Layout;
const {Text} = Typography;

interface EditorHeaderProps {
    title: string;
    projectTitle: string;
    onBackClick: () => void;
    onHomeClick: () => void;
    onSaveClick: () => void;
    onCancelClick: () => void;
    onExportClick: () => void;
    showNavButtons?: boolean;
    mode?: 'page' | 'sub';
    stickyTop?: number;
}

const EditorHeader: React.FC<EditorHeaderProps> = (
    {
        title,
        projectTitle,
        onBackClick,
        onHomeClick,
        onSaveClick,
        onCancelClick,
        onExportClick,
        showNavButtons = true,
        mode = 'page',
        stickyTop = 64
    }
) => {
    const headerStyle: React.CSSProperties = mode === 'sub'
        ? {
            backgroundColor: 'var(--color-header-bg)',
            padding: '0 24px',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 150,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 40,
            position: 'sticky',
            top: stickyTop,
            borderBottom: '1px solid var(--color-border)'
        }
        : {
            backgroundColor: 'var(--color-header-bg)',
            padding: '0 24px',
            boxShadow: 'var(--shadow-sm)',
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
            borderBottom: '1px solid var(--color-border)'
        };

    return (
        <Header
            className="editor-header"
            style={headerStyle}
        >
            {showNavButtons ? (
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
            ) : (
                <div style={{ width: 1 }} />
            )}

            <div style={{textAlign: 'center', flex: 1}}>
                {/*<Title level={3} style={{margin: 0}}>{}</Title>*/}
                <Text type="secondary" style={{display: 'block'}}>
                  {title}-正在编辑：【{projectTitle || '未命名项目'}】
                </Text>
            </div>

            <Space size="small">
                {/*<ThemeSwitch/>*/}
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
                >
                    保存
                </Button>
            </Space>
        </Header>
    );
};

export default EditorHeader;
