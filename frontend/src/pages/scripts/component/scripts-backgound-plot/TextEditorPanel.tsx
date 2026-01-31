import React from 'react';
import {Card, Typography, Input, Space} from 'antd';

const {Title, Text} = Typography;
const {TextArea} = Input;

interface TextEditorPanelProps {
    title: string;
    subtitle: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showSaveButton?: boolean;
    onSave?: () => void;
}

export const TextEditorPanel: React.FC<TextEditorPanelProps> = (
    {
        title,
        subtitle,
        value,
        onChange,
        placeholder = '请输入内容...',
        showSaveButton = false,
        onSave
    }
) => {
    return (
        <Card
            title={
                <div>
                    <Title level={4} style={{margin: 0}}>{title}</Title>
                    <Text type="secondary">{subtitle}</Text>
                </div>
            }
            extra={showSaveButton && onSave && (
                <Space>
                    <button
                        onClick={onSave}
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 12px',
                            cursor: 'pointer'
                        }}
                    >
                        保存
                    </button>
                </Space>
            )}
            style={{height: '100%'}}
        >
            <TextArea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={1}
                style={{
                    minHeight: 'calc(100vh - 128px)',
                    fontSize: '16px',
                    lineHeight: '1.25',
                    fontFamily: '"Microsoft YaHei", "SimSun", "KaiTi", sans-serif',
                    resize: 'vertical'
                }}
                autoSize={{minRows: 25, maxRows: 25}}
                aria-label={`${title}编辑区域`}
            />
        </Card>
    );
};

// export default TextEditorPanel;