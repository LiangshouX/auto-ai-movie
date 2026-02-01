import React, {useEffect, useState} from 'react';
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

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: ['headerSelect', 'blockquote', "insertLink", "group-video", "codeBlock"],
    }

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: placeholder,
    }

    useEffect(() => {
        setTimeout(() => {
            setHtml(html)
        }, 1000)
    }, [])

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
            <div style={{border: '1px solid #ccc', zIndex: 100}}>
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
                    onChange={(editor) => onChange(editor.getText())}
                    mode="default"
                    style={{height: '500px', overflowY: 'hidden'}}
                />
            </div>
        </>
    );
};

// export default TextEditorPanel;