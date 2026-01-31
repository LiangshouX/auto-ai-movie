import React, {useRef, useEffect, useState} from 'react';
import {Tldraw, useEditor, Editor, TLShape, TLShapeId} from 'tldraw';
import 'tldraw/tldraw.css';
import './role-canvas.css';
import {CharacterRole} from '../../../../api/types/character-role-types.ts';
import {message, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

// 自定义角色卡片形状常量
const ROLE_CARD_WIDTH = 180;
const ROLE_CARD_HEIGHT = 220;

interface EnhancedRoleCanvasProps {
    roles: CharacterRole[];
    onRoleClick: (roleId: string) => void;
    onCreateRole: (position: { x: number; y: number }) => void;
    onAIRoleDesign?: () => Promise<void>;
    isLoading?: boolean;
}

// 内部组件，用于在Tldraw上下文中使用useEditor
// 这个组件不渲染任何UI，只负责逻辑
const RoleCanvasInner: React.FC<{ 
    roles: CharacterRole[]; 
    onRoleClick: (roleId: string) => void; 
    editorRef: React.MutableRefObject<Editor | null>;
}> = ({ roles, onRoleClick, editorRef }) => {
    const editor = useEditor();
    
    useEffect(() => {
        editorRef.current = editor;
    }, [editor, editorRef]);

    // 同步角色数据到画布
    useEffect(() => {
        if (!editor) return;

        // 清除旧的角色卡片
        const existingCards = editor.getCurrentPageShapes().filter(
            (shape: TLShape) => shape.type === 'geo' &&
                              (shape as any).id?.startsWith('shape:role-card-')
        );
        if (existingCards.length > 0) {
            editor.deleteShapes(existingCards.map(s => s.id));
        }

        // 创建新的角色卡片（使用内置几何形状）
        const newShapes: any[] = roles.map((role, index) => ({
            id: `shape:role-card-${role.id}` as TLShapeId,
            type: 'geo' as const,
            x: (index % 4) * (ROLE_CARD_WIDTH + 50) + 100,
            y: Math.floor(index / 4) * (ROLE_CARD_HEIGHT + 70) + 100,
            props: {
                geo: 'rectangle',
                w: ROLE_CARD_WIDTH,
                h: ROLE_CARD_HEIGHT,
                fill: 'solid',
                color: 'blue',
                labelColor: 'black',
                // textSize: 'm',
                // text: `${role.name}\n${role.roleInStory || '暂无描述'}`,
                // meta: {
                //     roleType: 'character',
                //     roleId: role.id,
                //     roleName: role.name,
                //     roleDescription: role.roleInStory || '暂无描述'
                // }
            }
        }));

        if (newShapes.length > 0) {
            editor.createShapes(newShapes);
        }

        // 创建角色关系连接线
        createRelationshipArrows(editor, roles);

    }, [roles, editor]);

    // 创建角色关系箭头
    const createRelationshipArrows = (editor: Editor, roles: CharacterRole[]) => {
        // 清除旧的关系箭头
        const existingArrows = editor.getCurrentPageShapes().filter(
            (shape: TLShape) => shape.type === 'arrow'
        );
        if (existingArrows.length > 0) {
            editor.deleteShapes(existingArrows.map(s => s.id));
        }

        // 为每个角色的关系创建箭头
        roles.forEach(role => {
            if (role.relationships && role.relationships.length > 0) {
                role.relationships.forEach((rel, relIndex) => {
                    // TODO：添加相关逻辑
                    // const sourceShapeId = `role-card-${role.id}`;
                    // const targetShapeId = `role-card-${rel.relatedCharacterId}`;

                    // 检查目标角色是否存在
                    const targetExists = roles.some(r => r.id === rel.relatedCharacterId);
                    if (!targetExists) return;

                    // 创建箭头连接
                    try {
                        // 使用any类型来绕过严格的类型检查
                        const arrowShape: any = {
                            id: `shape:arrow-${role.id}-${rel.relatedCharacterId}-${relIndex}` as TLShapeId,
                            type: 'arrow' as const,
                            props: {
                                start: {
                                    x: 1,
                                    y: 1,
                                    // type: 'binding',
                                    // boundShapeId: sourceShapeId,
                                    // normalizedAnchor: { x: 1, y: 0.5 }
                                },
                                end: {
                                    x: 10,
                                    y: 10,
                                    // type: 'binding',
                                    // boundShapeId: targetShapeId,
                                    // normalizedAnchor: { x: 0, y: 0.5 }
                                }
                            }
                        };

                        editor.createShapes([arrowShape]);
                    } catch (error) {
                        console.warn('Failed to create arrow:', error);
                    }
                });
            }
        });
    };

    // 处理画布点击事件
    useEffect(() => {
        if (!editor) return;

        const handleClick = () => {
            const selectedShapes = editor.getSelectedShapes();
            if (selectedShapes.length === 1) {
                const selectedShape = selectedShapes[0];
                // console.log(`selectedShape: \n\n${selectedShape.type}`)
                // 检查是否为我们的角色卡片（通过ID前缀识别）
                if (selectedShape.type === 'geo' &&
                    (selectedShape as any).id?.startsWith('shape:role-card-')) {
                    const roleId = (selectedShape.props as any)?.meta?.roleId;
                    if (roleId) {
                        onRoleClick(roleId);
                    }
                }
            }
        };

        // 监听选择变化 - 使用change事件
        const handleChange = () => {
            // 延迟执行以确保选择状态已更新
            setTimeout(handleClick, 0);
        };

        const unsubscribe = editor.addListener?.('change', handleChange);

        return () => {
            // 安全地处理取消订阅，忽略类型问题
            try {
                if (unsubscribe && typeof unsubscribe === 'function') {
                    (unsubscribe as Function)();
                }
            } catch (e) {
                // 忽略取消订阅时的错误
                console.debug('Failed to unsubscribe from editor events');
            }
        };
    }, [editor, onRoleClick]);

    return null;
};

const RoleCanvas: React.FC<EnhancedRoleCanvasProps> = ({
                                                           roles,
                                                           onRoleClick,
                                                           onCreateRole,
                                                           onAIRoleDesign,
                                                           isLoading = false
                                                       }) => {
    const editorRef = useRef<Editor | null>(null);
    const [isAILoading, setIsAILoading] = useState(false);

    // 处理新建角色
    const handleCreateRole = () => {
        if (!editorRef.current) return;

        const viewport = editorRef.current.getViewportPageBounds();
        const center = {
            x: viewport.midX - ROLE_CARD_WIDTH / 2,
            y: viewport.midY - ROLE_CARD_HEIGHT / 2
        };

        onCreateRole(center);
    };

    // 处理AI角色设计
    const handleAIRoleDesign = async () => {
        if (!onAIRoleDesign) return;

        try {
            setIsAILoading(true);
            await onAIRoleDesign();
        } catch (error) {
            console.error('AI角色设计失败:', error);
            message.error('AI角色设计失败，请稍后重试');
        } finally {
            setIsAILoading(false);
        }
    };

    return (
        <div className="role-canvas-container">
            {/* 顶部操作栏 */}
            <div className="canvas-toolbar">
                <button
                    className="btn-primary"
                    onClick={handleCreateRole}
                    disabled={isLoading || isAILoading}
                >
                    ➕ 新建角色
                </button>
                <button
                    className="btn-secondary"
                    onClick={handleAIRoleDesign}
                    disabled={!onAIRoleDesign || isLoading || isAILoading}
                >
                    {isAILoading ? (
                        <>
                            <Spin indicator={<LoadingOutlined spin />} size="small" />
                            AI创建中...
                        </>
                    ) : (
                        '🤖 AI设计角色'
                    )}
                </button>
            </div>

            {/* 加载状态覆盖层 */}
            {(isLoading || isAILoading) && (
                <div className="canvas-loading-overlay">
                    <div className="loading-content">
                        <Spin size="large" />
                        <div className="loading-text">
                            {isAILoading ? 'AI正在创建角色...' : '加载中...'}
                        </div>
                    </div>
                </div>
            )}

            {/* tldraw 画布 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: (isLoading || isAILoading) ? 0.6 : 1,
                    pointerEvents: (isLoading || isAILoading) ? 'none' : 'auto'
                }}
            >
                <Tldraw
                    persistenceKey="role-design-canvas"
                    inferDarkMode
                    components={{
                        Toolbar: null,
                        StylePanel: null,
                        PageMenu: null,
                        ZoomMenu: null,
                        MainMenu: null,
                        Minimap: null,
                        MenuPanel: null,
                        ContextMenu: null,
                        HelperButtons: null,
                    }}
                    onMount={(editorInstance: Editor) => {
                        editorRef.current = editorInstance;
                        editorInstance.setCurrentTool('select');

                        // 禁用不需要的工具
                        const toolsToDisable = ['draw', 'eraser', 'laser', 'frame', 'note'];
                        toolsToDisable.forEach(tool => {
                            try {
                                (editorInstance as any).setCurrentToolDisabled?.(tool, true);
                            } catch (e) {
                                // 工具不存在时忽略
                            }
                        });
                    }}
                >
                    <RoleCanvasInner 
                        roles={roles} 
                        onRoleClick={onRoleClick} 
                        editorRef={editorRef} 
                    />
                </Tldraw>
            </div>
        </div>
    );
};

export default RoleCanvas;