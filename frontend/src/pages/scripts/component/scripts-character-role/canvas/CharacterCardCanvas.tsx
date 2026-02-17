import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Editor, Tldraw, TLShapeId} from 'tldraw'
import 'tldraw/tldraw.css'
import {CHARACTER_CARD_SHAPE_TYPE, CharacterCardShapeUtil} from './CharacterCardShape.tsx'
import {Button, Empty, Flex, message, Popconfirm, Space, Spin, Typography} from 'antd'
import {characterRoleApi} from '@/api/service/character-role.ts'
import {CharacterRole} from '@/api/types/character-role-types.ts'
import CharacterDetailDrawer from '../CharacterDetailDrawer.tsx'
import {ScriptProject} from '@/api/types/project-types.ts'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, RobotOutlined } from '@ant-design/icons';

const {Title} = Typography

// 组件Props接口
interface CharacterCardDemoProps {
  projectId?: string | null;
  project?: ScriptProject | null;
}

const CharacterCardCanvas = ({projectId, project}: CharacterCardDemoProps) => {
    const {projectId: projectIdFromParams} = useParams<{ projectId: string }>()
    // const navigate = useNavigate()
    const [editor, setEditor] = useState<Editor | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
    const [roles, setRoles] = useState<CharacterRole[]>([])

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<CharacterRole | null>(null)
    const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('view')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false)
    const aiTimerRef = useRef<number | null>(null)

    // 自定义形状工具
    const shapeUtils = [CharacterCardShapeUtil]

    // 计算实际使用的projectId
    const actualProjectId = useMemo(() => {
        return projectId || projectIdFromParams || project?.id || null
    }, [projectId, projectIdFromParams, project?.id])

    const fetchRoles = useCallback(async () => {
        if (!actualProjectId) return

        try {
            setLoading(true)
            setError(null)
            const response = await characterRoleApi.getAllCharacters({projectId: actualProjectId})
            if (response.success && response.data) {
                const data = Array.isArray(response.data) ? response.data : []
                setRoles(data as CharacterRole[])
            } else {
                setRoles([])
                message.error(response.message || '加载角色数据失败')
            }
        } catch (err: any) {
            setRoles([])
            setError(err.message || '加载角色数据失败')
            message.error(err.message || '加载角色数据失败')
        } finally {
            setLoading(false)
        }
    }, [actualProjectId])

    useEffect(() => {
        if (!actualProjectId) {
            setRoles([])
            setLoading(false)
            setError('项目ID不存在')
            return
        }
        fetchRoles()
    }, [actualProjectId, fetchRoles])

    // 监听卡片悬浮按钮事件
    useEffect(() => {
        const handleCardView = (e: CustomEvent) => {
            const { roleId } = e.detail
            const role = roles.find(r => r.id === roleId)
            if (role) {
                setSelectedRoleId(roleId)
                setSelectedRole(role)
                setDrawerMode('view')
                setDrawerOpen(true)
            }
        }
        const handleCardEdit = (e: CustomEvent) => {
            const { roleId } = e.detail
            const role = roles.find(r => r.id === roleId)
            if (role) {
                setSelectedRoleId(roleId)
                setSelectedRole(role)
                setDrawerMode('edit')
                setDrawerOpen(true)
            }
        }
        // @ts-ignore
        window.addEventListener('character-card-view', handleCardView)
        // @ts-ignore
        window.addEventListener('character-card-edit', handleCardEdit)
        return () => {
            // @ts-ignore
            window.removeEventListener('character-card-view', handleCardView)
            // @ts-ignore
            window.removeEventListener('character-card-edit', handleCardEdit)
        }
    }, [roles])

    // 初始化画布：创建示例角色卡片
    const initializeCanvas = useCallback((editor: Editor) => {
        // 清除现有形状
        const existingShapes = editor.getCurrentPageShapes()
        if (existingShapes.length > 0) {
            editor.deleteShapes(existingShapes.map(s => s.id))
        }

        // 创建角色卡片形状
        const shapes = roles.map((role, index) => ({
            id: `shape:${role.id}` as TLShapeId,
            type: CHARACTER_CARD_SHAPE_TYPE,
            x: (index % 3) * 250 + 100,
            y: Math.floor(index / 3) * 300 + 100,
            props: {
                w: 180,
                h: 220,
                roleId: role.id,
                name: role.name,
                age: role.age,
                gender: role.gender,
                height: undefined,
                weight: undefined,
                roleInStory: role.roleInStory,
                personalityTags: role.personalityTags,
                skills: role.skills,
                characterSetting: role.characterSetting,
                relationships: (role.characterRelationships || []).map(rel => ({
                    relationshipType: rel.relationshipType,
                    relatedCharacterName: rel.relatedCharacterName,
                })),
                isSelected: false,
            },
        }))

        if (shapes.length > 0) {
            editor.createShapes(shapes)
        }
    }, [roles])

    // 处理编辑器挂载
    const handleMount = useCallback((editor: Editor) => {
        setEditor(editor)
        initializeCanvas(editor)
        // 禁用不需要的工具
        const toolsToDisable = ['Eraser-E', 'laser', 'frame', 'note'];
        toolsToDisable.forEach(tool => {
            try {
                (editor as any).removeTool?.(tool, true);
            } catch {
                // 工具不存在时忽略
            }
        });
    }, [initializeCanvas])

    // 当roles变化时，如果编辑器存在，重新初始化画布
    useEffect(() => {
        if (editor) {
            initializeCanvas(editor)
        }
    }, [roles, editor, initializeCanvas])

    // 监听形状选择事件
    useEffect(() => {
        if (!editor) return

        const handleSelectionChange = () => {
            const selectedShapes = editor.getSelectedShapes()
            if (selectedShapes.length === 1) {
                const shape = selectedShapes[0]
                if (shape.type === CHARACTER_CARD_SHAPE_TYPE) {
                    const roleId = shape.props.roleId
                    setSelectedRoleId(roleId)
                    const role = roles.find(r => r.id === roleId)
                    setSelectedRole(role || null)
                    const allCardShapes = editor.getCurrentPageShapes().filter(s => s.type === CHARACTER_CARD_SHAPE_TYPE)
                    editor.updateShapes(
                        allCardShapes.map(s => ({
                            id: s.id,
                            type: s.type,
                            props: { ...(s as any).props, isSelected: (s as any).props.roleId === roleId },
                        })) as any
                    )
                }
            } else {
                setSelectedRoleId(null)
                setSelectedRole(null)
                const allCardShapes = editor.getCurrentPageShapes().filter(s => s.type === CHARACTER_CARD_SHAPE_TYPE)
                editor.updateShapes(
                    allCardShapes.map(s => ({
                        id: s.id,
                        type: s.type,
                        props: { ...(s as any).props, isSelected: false },
                    })) as any
                )
            }
        }
        editor.addListener('change', handleSelectionChange);
    }, [editor, roles])

    useEffect(() => {
        return () => {
            if (aiTimerRef.current) {
                window.clearTimeout(aiTimerRef.current)
            }
        }
    }, [])

    // 编辑选中角色
    const handleEditeSelected = useCallback(() => {
        if (!selectedRoleId) return
        const role = roles.find(r => r.id === selectedRoleId)
        if (!role) {
            message.warning('未找到选中角色')
            return
        }
        setSelectedRole(role)
        setDrawerMode('edit')
        setDrawerOpen(true)
    }, [roles, selectedRoleId])

    // 删除选中角色
    const handleDeleteSelected = useCallback(async () => {
        if (!selectedRoleId) return
        try {
            const response = await characterRoleApi.deleteCharacter({id: selectedRoleId})
            if (response.success) {
                message.success('角色删除成功')
                setRoles(prev => prev.filter(r => r.id !== selectedRoleId))
                setSelectedRoleId(null)
                setSelectedRole(null)
            } else {
                message.error(response.message || '删除失败')
            }
        } catch (err: any) {
            message.error(err.message || '删除失败')
        }
    }, [selectedRoleId])


    // 处理角色创建/更新/删除成功
    const handleCharacterSuccess = useCallback((character: CharacterRole, action: 'create' | 'update' | 'delete') => {
        if (action === 'delete') {
            // 从roles中移除已删除的角色
            setRoles(prev => prev.filter(r => r.id !== character.id))
            // 如果删除的是当前选中的角色，清除选中状态
            if (selectedRoleId === character.id) {
                setSelectedRoleId(null)
                setSelectedRole(null)
                setDrawerOpen(false)
            }
        } else if (action === 'update') {
            // 更新角色列表中的角色
            setRoles(prev => prev.map(r => r.id === character.id ? character : r))
            // 如果更新的是当前选中的角色，更新selectedRole
            if (selectedRoleId === character.id) {
                setSelectedRole(character)
            }
        } else if (action === 'create') {
            // 将新角色添加到列表
            setRoles(prev => [...prev, character])
        }
        fetchRoles().then(() => {})
    }, [fetchRoles, selectedRoleId])

    // 测试箭头连接：选择箭头工具后可以连接卡片的手柄
    const enableArrowTool = useCallback(() => {
        if (!editor) return
        editor.setCurrentTool('arrow')
        message.info('已切换到箭头工具，可以连接卡片上的蓝色连接点')
    }, [editor])

    const handleCreateCharacter = useCallback(() => {
        setSelectedRole(null)
        setDrawerMode('create')
        setDrawerOpen(true)
    }, [])

    const handleAIDesign = useCallback(() => {
        if (!actualProjectId) return
        setIsAIGenerating(true)
        aiTimerRef.current = window.setTimeout(() => {
            setIsAIGenerating(false)
            fetchRoles().then(() => {})
        }, 2000)
    }, [actualProjectId, fetchRoles])

    return (
        <>
            <Flex vertical style={{
                minHeight: 'calc(100vh - 64px)',
                minWidth: 'max(1200px, calc(100vw - 340px))'
            }}>
                <Flex vertical style={{position: 'sticky', top: 0, zIndex: 1, background: '#fff'}}>
                    <Flex justify="space-between" align="center" style={{marginBottom: 0}}>
                        <Title level={3} style={{margin: 0}}>角色设计</Title>
                        <Space>
                            <Button
                                size="large"
                                icon={<ReloadOutlined/>}
                                onClick={fetchRoles}
                                disabled={!actualProjectId}
                            >
                                刷新
                            </Button>

                            <Button onClick={enableArrowTool} type="default">
                                箭头连接工具
                            </Button>
                            <Button
                              onClick={handleEditeSelected}
                              type="default"
                              icon={<EditOutlined/>}
                              disabled={!selectedRoleId}
                            >
                                编辑选中角色
                            </Button>
                            <Popconfirm
                              title="确定要删除选中角色吗？"
                              description="删除后无法恢复"
                              onConfirm={handleDeleteSelected}
                              okText="确定"
                              cancelText="取消"
                              disabled={!selectedRoleId}
                            >
                                <Button
                                  type="default"
                                  danger
                                  icon={<DeleteOutlined/>}
                                  disabled={!selectedRoleId}
                                >
                                    删除选中角色
                                </Button>
                            </Popconfirm>
                            <Button
                                size="large"
                                icon={<PlusOutlined/>}
                                onClick={handleCreateCharacter}
                                disabled={!actualProjectId}
                            >
                                新建角色
                            </Button>

                            <Button
                                size="large"
                                icon={<RobotOutlined/>}
                                loading={isAIGenerating}
                                onClick={handleAIDesign}
                                disabled={!actualProjectId}
                            >
                                {isAIGenerating ? 'AI创建角色中...' : 'AI设计'}
                            </Button>
                        </Space>
                    </Flex>
                </Flex>

                {loading ? (
                    <Flex vertical style={{width: '100%'}}>
                        <Flex align="center" justify="center" style={{padding: 40}}>
                            <Spin size="large" tip="加载中..."/>
                        </Flex>
                    </Flex>
                ) : error ? (
                    <Flex vertical style={{width: '100%'}}>
                        <Empty
                            description={error}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Flex>
                ) : (
                    <>
                        <div
                            style={{
                                position: 'relative',
                                inset: 0,
                                flex: 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                margin: '0 12px 12px',
                                minHeight: 480,
                            }}
                        >
                            <Tldraw
                                shapeUtils={shapeUtils}
                                onMount={handleMount}
                                components={{
                                    StylePanel: null,
                                    ZoomMenu: null,
                                    MainMenu: null,
                                    Minimap: null,
                                }}
                            />
                        </div>
                        {roles.length === 0 && (
                            <Flex align="center" justify="center" style={{height: 300}}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="暂无角色，请点击‘AI设计’按钮创建角色"
                                />
                            </Flex>
                        )}
                    </>
                )}
            </Flex>
            <CharacterDetailDrawer
                character={selectedRole}
                characters={roles}
                open={drawerOpen}
                mode={drawerMode}
                projectId={actualProjectId || undefined}
                onClose={() => setDrawerOpen(false)}
                onSuccess={handleCharacterSuccess}
            />
        </>
    )
}

export default CharacterCardCanvas
