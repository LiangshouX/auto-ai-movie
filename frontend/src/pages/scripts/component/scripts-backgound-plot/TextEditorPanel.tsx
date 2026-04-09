import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Editor, Toolbar} from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import {IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const plainTextToHtml = (text: string) => {
    const normalized = text.replace(/\r\n/g, '\n')
    const blocks = normalized.split(/\n{2,}/)
    const htmlBlocks = blocks.map((block) => {
        const content = escapeHtml(block).replace(/\n/g, '<br/>')
        return `<p>${content || '<br/>'}</p>`
    })
    return htmlBlocks.join('')
}

const normalizeIncomingValueToHtml = (value: string) => {
    if (!value) return '<p><br></p>'
    const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value)
    return looksLikeHtml ? value : plainTextToHtml(value)
}

interface TextEditorPanelProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const TextEditorPanel: React.FC<TextEditorPanelProps> = (
    {
        value,
        onChange,
        placeholder = '请输入内容...',
    }
) => {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)

    // 编辑器内容
    const [html, setHtml] = useState(value)
    const lastEmittedValueRef = useRef<string | null>(null)
    const scopeAttrValue = useMemo(() => `text-editor-panel-${Math.random().toString(36).slice(2)}`, [])

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = useMemo(() => ({
        excludeKeys: [
            'headerSelect',
            'blockquote',
            'insertLink',
            'group-video',
            'codeBlock',
            'bulletedList',
            'numberedList',
            'todo',
            'insertImage',
        ],
    }), [])

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = useMemo(() => ({
        placeholder: placeholder,
    }), [placeholder])

    useEffect(() => {
        if (value === lastEmittedValueRef.current) return
        setHtml(normalizeIncomingValueToHtml(value))
    }, [value])

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])


    return (
        <>
            <div
                data-wangeditor-scope={scopeAttrValue}
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md, 8px)',
                    zIndex: 100,
                    height: '100%',
                    maxHeight: '100%',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                <style>{`
                    [data-wangeditor-scope="${scopeAttrValue}"] {
                        --w-e-textarea-bg-color: var(--color-bg-container);
                        --w-e-textarea-color: var(--color-text-primary);
                        --w-e-toolbar-bg-color: var(--color-bg-elevated);
                        --w-e-toolbar-color: var(--color-text-primary);
                        --w-e-toolbar-active-bg-color: var(--color-border-soft);
                        --w-e-toolbar-active-color: var(--color-primary);
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container {
                        height: 100%;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        background-color: var(--color-bg-container);
                        color: var(--color-text-primary);
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container .w-e-scroll{
                        flex: 1;
                        height: 100%;
                        min-height: 0;
                        overflow-y: auto;
                        overscroll-behavior: contain;
                        -webkit-overflow-scrolling: touch;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container [data-slate-editor]{
                        font-family: 'Outfit', "SimSun", "宋体", serif;
                        font-size: 18px;
                        line-height: 1.8;
                        box-sizing: border-box;
                        color: var(--color-text-primary);
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container [data-slate-editor] p{
                        text-indent: 2em;
                        margin-bottom: 1em;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-toolbar {
                        background-color: var(--color-bg-elevated);
                        border-bottom: 1px solid var(--color-border) !important;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-bar-item button {
                        color: var(--color-text-secondary);
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-bar-item button:hover {
                        color: var(--color-primary);
                        background-color: var(--color-border-soft);
                    }
                `}</style>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{borderBottom: '1px solid var(--color-border)'}}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={(editor) => {
                        const nextText = editor.getText()
                        lastEmittedValueRef.current = nextText
                        onChange(nextText)
                        setHtml(editor.getHtml())
                    }}
                    mode="default"
                    style={{flex: 1, overflow: 'hidden', minHeight: 0}}
                />
            </div>
        </>
    );
};

// export default TextEditorPanel;
