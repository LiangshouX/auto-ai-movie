import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Editor, Tldraw, TLShape, TLShapeId, useEditor} from 'tldraw';
import 'tldraw/tldraw.css';
import './role-canvas.css';
import {CharacterRelationship, CharacterRole} from '@/api/types/character-role-types.ts';
import {Form, Input, message, Modal, Select, Spin} from 'antd';
import {LoadingOutlined, PlusOutlined, RobotOutlined} from '@ant-design/icons';
import {CHARACTER_ROLE_SHAPE_TYPE, CharacterRoleUtil} from "./TLCharacterRoleShape.tsx";
import {RELATIONSHIP_ARROW_SHAPE_TYPE, RelationshipArrowUtil} from "./TLRelationshipArrowShape.tsx";

const {Option} = Select;

// 自定义角色卡片形状常量
const ROLE_CARD_WIDTH = 180;
const ROLE_CARD_HEIGHT = 220;

interface EnhancedRoleCanvasProps {
    roles: CharacterRole[];
    onRoleClick: (roleId: string) => void;
    onCreateRole: (position: { x: number; y: number }) => void;
    onAIRoleDesign?: () => Promise<void>;
    isLoading?: boolean;
    onRelationshipAdd?: (sourceId: string, targetId: string, relationship: Omit<CharacterRelationship, 'relatedCharacterName'>) => void;
    onRelationshipRemove?: (sourceId: string, targetId: string) => void;
}

declare module 'tldraw' {
    export interface TLGlobalShapePropsMap {
        [CHARACTER_ROLE_SHAPE_TYPE]: {
            w: number,
            h: number,
            roleId: string;
            name: string;
            age?: number;
            gender?: string;
            roleInStory: string;
            isSelected: boolean;
            connectionPoints: {
                top: { x: number; y: number };
                bottom: { x: number; y: number };
                left: { x: number; y: number };
                right: { x: number; y: number };
            };
        }
    }
}
declare module 'tldraw' {
    export interface TLGlobalShapePropsMap {
        [RELATIONSHIP_ARROW_SHAPE_TYPE]: {
            sourceRoleId: string;
            targetRoleId: string;
            relationshipType: string;
            description: string;
            sourcePoint: { x: number; y: number };
            targetPoint: { x: number; y: number };
        }
    }
}

// 内部组件，用于在Tldraw上下文中使用useEditor
/*@ts-ignore*/
const RoleCanvasInner: React.FC<{
    roles: CharacterRole[];
    onRoleClick: (roleId: string) => void;
    editorRef: React.MutableRefObject<Editor | null>;
    onRelationshipAdd?: (sourceId: string, targetId: string, relationship: Omit<CharacterRelationship, 'relatedCharacterName'>) => void;
    onRelationshipRemove?: (sourceId: string, targetId: string) => void;
}> = ({roles, onRoleClick, editorRef, onRelationshipAdd}) => {
    const editor = useEditor();
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [showRelationshipModal, setShowRelationshipModal] = useState(false);
    const [relationshipForm] = Form.useForm();
    const [sourceRoleId, setSourceRoleId] = useState<string>('');
    const [targetRoleId, setTargetRoleId] = useState<string>('');

    useEffect(() => {
        editorRef.current = editor;
    }, [editor, editorRef]);

    // 同步角色数据到画布
    useEffect(() => {
        if (!editor) return;

        // 清除旧的角色卡片
        const existingCards = editor.getCurrentPageShapes().filter(
            (shape: TLShape) => shape.type === CHARACTER_ROLE_SHAPE_TYPE
        );
        if (existingCards.length > 0) {
            editor.deleteShapes(existingCards.map(s => s.id));
        }

        // 创建新的角色卡片
        const newShapes: any[] = roles.map((role, index) => ({
            id: `shape:role-${role.id}` as TLShapeId,
            type: CHARACTER_ROLE_SHAPE_TYPE,
            x: (index % 4) * (ROLE_CARD_WIDTH + 50) + 100,
            y: Math.floor(index / 4) * (ROLE_CARD_HEIGHT + 70) + 100,
            props: {
                roleId: role.id,
                name: role.name,
                age: role.age,
                gender: role.gender,
                roleInStory: role.roleInStory,
                isSelected: selectedRoleId === role.id,
                connectionPoints: {
                    top: {x: ROLE_CARD_WIDTH / 2, y: 0},
                    bottom: {x: ROLE_CARD_WIDTH / 2, y: ROLE_CARD_HEIGHT},
                    left: {x: 0, y: ROLE_CARD_HEIGHT / 2},
                    right: {x: ROLE_CARD_WIDTH, y: ROLE_CARD_HEIGHT / 2},
                }
            }
        }));

        if (newShapes.length > 0) {
            editor.createShapes(newShapes);
        }

        // 创建角色关系连接线
        createRelationshipArrows(editor, roles);

    }, [roles, editor, selectedRoleId]);

    // 创建角色关系箭头
    const createRelationshipArrows = useCallback((editor: Editor, roles: CharacterRole[]) => {
        // 清除旧的关系箭头
        const existingArrows = editor.getCurrentPageShapes().filter(
            (shape: TLShape) => shape.type === RELATIONSHIP_ARROW_SHAPE_TYPE
        );
        if (existingArrows.length > 0) {
            editor.deleteShapes(existingArrows.map(s => s.id));
        }

        // 为每个角色的关系创建箭头
        const arrowShapes: any[] = [];

        roles.forEach(role => {
            if (role.characterRelationships && role.characterRelationships.length > 0) {
                role.characterRelationships.forEach((rel, relIndex) => {
                    // 检查目标角色是否存在
                    const targetRole = roles.find(r => r.id === rel.relatedCharacterId);
                    if (!targetRole) return;

                    // 获取两个角色卡片的位置
                    const sourceShape = editor.getShape(`shape:role-${role.id}` as TLShapeId);
                    const targetShape = editor.getShape(`shape:role-${rel.relatedCharacterId}` as TLShapeId);

                    if (sourceShape && targetShape) {
                        const sourceBounds = editor.getShapePageBounds(sourceShape.id);
                        const targetBounds = editor.getShapePageBounds(targetShape.id);

                        if (sourceBounds && targetBounds) {
                            // 计算连接点（使用中心点）
                            const sourcePoint = {
                                x: sourceBounds.x + sourceBounds.width / 2,
                                y: sourceBounds.y + sourceBounds.height / 2
                            };

                            const targetPoint = {
                                x: targetBounds.x + targetBounds.width / 2,
                                y: targetBounds.y + targetBounds.height / 2
                            };

                            arrowShapes.push({
                                id: `shape:arrow-${role.id}-${rel.relatedCharacterId}-${relIndex}` as TLShapeId,
                                type: RELATIONSHIP_ARROW_SHAPE_TYPE,
                                props: {
                                    sourceRoleId: role.id,
                                    targetRoleId: rel.relatedCharacterId,
                                    relationshipType: rel.relationshipType,
                                    description: rel.description,
                                    sourcePoint,
                                    targetPoint
                                }
                            });
                        }
                    }
                });
            }
        });

        if (arrowShapes.length > 0) {
            editor.createShapes(arrowShapes);
        }
    }, []);

    // 处理画布点击事件
    useEffect(() => {
        if (!editor) return;

        const handleClick = () => {
            const selectedShapes = editor.getSelectedShapes();
            if (selectedShapes.length === 1) {
                const selectedShape = selectedShapes[0];

                // 检查是否为我们的角色卡片
                if (selectedShape.type === CHARACTER_ROLE_SHAPE_TYPE) {
                    const roleId = (selectedShape.props as any)?.roleId;
                    if (roleId) {
                        setSelectedRoleId(roleId);
                        onRoleClick(roleId);
                    }
                }
            } else if (selectedShapes.length === 0) {
                setSelectedRoleId(null);
            }
        };

        // 监听选择变化
        const handleChange = () => {
            setTimeout(handleClick, 0);
        };

        const unsubscribe = editor.addListener?.('change', handleChange);

        return () => {
            try {
                if (unsubscribe && typeof unsubscribe === 'function') {
                    (unsubscribe as Function)();
                }
            } catch (e) {
                console.debug('Failed to unsubscribe from editor events');
            }
        };
    }, [editor, onRoleClick]);

    // 处理关系添加
    /*@ts-ignore*/
    const handleAddRelationship = (sourceId: string, targetId: string) => {
        setSourceRoleId(sourceId);
        setTargetRoleId(targetId);
        setShowRelationshipModal(true);
    };

    // 处理关系表单提交
    const handleRelationshipSubmit = async () => {
        try {
            const values = await relationshipForm.validateFields();

            const relationshipData: Omit<CharacterRelationship, 'relatedCharacterName'> = {
                relatedCharacterId: targetRoleId,
                relationshipType: values.relationshipType,
                description: values.description
            };

            if (onRelationshipAdd) {
                onRelationshipAdd(sourceRoleId, targetRoleId, relationshipData);
            }

            message.success('关系添加成功');
            setShowRelationshipModal(false);
            relationshipForm.resetFields();
        } catch (error) {
            console.error('关系表单验证失败:', error);
        }
    };

    return (
        <>
            {/* 关系添加模态框 */}
            <Modal
                title="添加角色关系"
                open={showRelationshipModal}
                onOk={handleRelationshipSubmit}
                onCancel={() => {
                    setShowRelationshipModal(false);
                    relationshipForm.resetFields();
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={relationshipForm} layout="vertical">
                    <Form.Item
                        name="relationshipType"
                        label="关系类型"
                        rules={[{required: true, message: '请选择关系类型'}]}
                    >
                        <Select placeholder="请选择关系类型">
                            <Option value="friend">朋友</Option>
                            <Option value="enemy">敌人</Option>
                            <Option value="lover">恋人</Option>
                            <Option value="family">家人</Option>
                            <Option value="colleague">同事</Option>
                            <Option value="acquaintance">熟人</Option>
                            <Option value="rival">对手</Option>
                            <Option value="mentor">导师</Option>
                            <Option value="protege">学生</Option>
                            <Option value="other">其他</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="关系描述"
                        rules={[{required: true, message: '请输入关系描述'}]}
                    >
                        <Input.TextArea
                            placeholder="请描述这两个角色之间的具体关系..."
                            rows={3}
                            maxLength={200}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const EnhancedRoleCanvas: React.FC<EnhancedRoleCanvasProps> = ({
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
                    <PlusOutlined/> 新建角色
                </button>
                <button
                    className="btn-secondary"
                    onClick={handleAIRoleDesign}
                    disabled={!onAIRoleDesign || isLoading || isAILoading}
                >
                    {isAILoading ? (
                        <>
                            <Spin indicator={<LoadingOutlined spin/>} size="small"/>
                            AI创建中...
                        </>
                    ) : (
                        <>
                            <RobotOutlined/> AI设计角色
                        </>
                    )}
                </button>
            </div>

            {/* 加载状态覆盖层 */}
            {(isLoading || isAILoading) && (
                <div className="canvas-loading-overlay">
                    <div className="loading-content">
                        <Spin size="large"/>
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
                    shapeUtils={[CharacterRoleUtil, RelationshipArrowUtil]}
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
                        const toolsToDisable = ['eraser', 'laser', 'frame', 'note'];
                        toolsToDisable.forEach(tool => {
                            try {
                                (editorInstance as any).setCurrentToolDisabled?.(tool, true);
                            } catch (e) {
                                // 工具不存在时忽略
                            }
                        });
                    }}
                >
                    {/*<RoleCanvasInner */}
                    {/*    roles={roles} */}
                    {/*    onRoleClick={onRoleClick} */}
                    {/*    editorRef={editorRef}*/}
                    {/*    onRelationshipAdd={onRelationshipAdd}*/}
                    {/*    onRelationshipRemove={onRelationshipRemove}*/}
                    {/*/>*/}
                </Tldraw>
            </div>
        </div>
    );
};

export default EnhancedRoleCanvas;