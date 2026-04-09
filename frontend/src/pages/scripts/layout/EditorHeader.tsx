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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '0 16px',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 150,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 48,
            position: 'sticky',
            top: stickyTop,
            borderBottom: '1px solid var(--color-border)'
        }
        : {
            backgroundColor: 'var(--color-header-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '0 16px',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 100,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
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
                <Space size="small">
                    <Button
                        onClick={onBackClick}
                        icon=<BackwardOutlined/>
                        type="text"
                        size="small"
                    >
                        返回
                    </Button>
                    <Button
                        onClick={onHomeClick}
                        icon=<HomeOutlined/>
                        type="text"
                        size="small"
                    >
                        首页
                    </Button>
                </Space>
            ) : (
                <div style={{ width: 1 }} />
            )}

            <div style={{textAlign: 'center', flex: 1}}>
                <Text type="secondary" style={{display: 'block', fontSize: 13}}>
                  <span style={{color: 'var(--color-text-primary)', fontWeight: 600}}>{title}</span> <span style={{opacity: 0.5}}>|</span> {projectTitle || '未命名项目'}
                </Text>
            </div>

            <Space size="small">
                <Button
                    onClick={onExportClick}
                    type="text"
                    size="small"
                >
                    导出
                </Button>
                <Button
                    onClick={onCancelClick}
                    type="default"
                    size="small"
                >
                    取消
                </Button>
                <Button
                    onClick={onSaveClick}
                    type="primary"
                    size="small"
                >
                    保存
                </Button>
            </Space>
        </Header>
    );
};

export default EditorHeader;
