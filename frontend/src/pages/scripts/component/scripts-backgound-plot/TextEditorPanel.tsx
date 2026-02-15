import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Editor, Toolbar} from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import {IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";


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
        setHtml(value)
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
                    border: '1px solid #ccc',
                    zIndex: 100,
                    height: '100%',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <style>{`
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container {
                        height: 100%;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container .w-e-scroll{
                        flex: 1;
                        min-height: 0;
                        overflow-y: auto;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container [data-slate-editor]{
                        font-family: "SimSun", "宋体", serif;
                        font-size: 22px;
                        box-sizing: border-box;
                    }
                    [data-wangeditor-scope="${scopeAttrValue}"] .w-e-text-container [data-slate-editor] p{
                        text-indent: 2em;
                    }
                `}</style>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{borderBottom: '1px solid #ccc'}}
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
