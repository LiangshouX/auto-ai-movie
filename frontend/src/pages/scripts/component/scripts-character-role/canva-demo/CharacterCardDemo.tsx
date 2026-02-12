import { useCallback, useEffect, useState } from 'react'
import { Editor, Tldraw, TLShapeId } from 'tldraw'
import 'tldraw/tldraw.css'
import { CharacterCardShapeUtil, CHARACTER_CARD_SHAPE_TYPE } from './CharacterCardShape.tsx'
import { Button, Layout, Space, Typography, message } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { characterRoleApi } from '@/api/service/character-role.ts'
import { CharacterRole } from '@/api/types/character-role-types.ts'
import CharacterDetailDrawer from '../CharacterDetailDrawer.tsx'

const { Title } = Typography
const { Header, Content } = Layout

// 组件Props接口
interface CharacterCardDemoProps {
  projectId?: string;
}

const CharacterCardDemo = ({ projectId }: CharacterCardDemoProps) => {
    const navigate = useNavigate()
    const [editor, setEditor] = useState<Editor | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
    const [roles, setRoles] = useState<CharacterRole[]>([])

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<CharacterRole | null>(null)
    const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view')

    // 自定义形状工具
    const shapeUtils = [CharacterCardShapeUtil]

    // 计算实际使用的projectId
    const actualProjectId = projectId || '07ca8285a4bfa47abd869415cf9fe404'

    // 加载角色数据
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await characterRoleApi.getAllCharacters({ projectId: actualProjectId })
                if (response.success && response.data) {
                    setRoles(response.data as CharacterRole[])
                } else {
                    message.error(response.message || '加载角色数据失败')
                }
            } catch (error) {
                console.error('加载角色数据失败:', error)
                message.error('加载角色数据失败')
            }
        }
        loadRoles()
    }, [actualProjectId])

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
                isSelected: false,
            },
        }))

        editor.createShapes(shapes)
        message.success('已加载角色列表').then(() => {})
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
            } catch (e) {
                // 工具不存在时忽略
            }
        });
    }, [initializeCanvas])

    // 当roles变化时，如果编辑器存在，重新初始化画布
    useEffect(() => {
        if (editor && roles.length > 0) {
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
                    // setDrawerOpen(true)
                    // message.info(`选中角色: ${shape.props.name}`)
                }
            } else {
                setSelectedRoleId(null)
                setSelectedRole(null)
                setDrawerOpen(false)
            }
        }
        editor.addListener('change', handleSelectionChange);
    }, [editor, roles])



    // 添加新角色卡片
    const handleAddRole = useCallback(() => {
        if (!editor) return

        const newRole = {
            id: `role-${Date.now()}`,
            name: '新角色',
            age: undefined,
            gender: undefined,
            roleInStory: '暂无描述',
            personalityTags: [],
            skills: [],
            characterSetting: '',
        }

        const shape = {
            id: `shape:${newRole.id}` as TLShapeId,
            type: CHARACTER_CARD_SHAPE_TYPE,
            x: 100,
            y: 100,
            props: {
                w: 180,
                h: 220,
                roleId: newRole.id,
                name: newRole.name,
                age: newRole.age,
                gender: newRole.gender,
                roleInStory: newRole.roleInStory,
                personalityTags: newRole.personalityTags,
                skills: newRole.skills,
                characterSetting: newRole.characterSetting,
                isSelected: false,
            },
        }

        editor.createShapes([shape])
        message.success('已添加新角色卡片')
    }, [editor])

    // 编辑选中角色
    const handleEditeSelected = useCallback(() => {
        if (!editor || !selectedRoleId) return

        // const shapeId = `shape:${selectedRoleId}` as TLShapeId
        // editor.getEditingShape([shapeId])
        setDrawerOpen( true)
        setSelectedRoleId(null)
        message.success('已删除选中角色')
    }, [editor, selectedRoleId])

    // 删除选中角色
    const handleDeleteSelected = useCallback(() => {
        if (!editor || !selectedRoleId) return

        const shapeId = `shape:${selectedRoleId}` as TLShapeId
        editor.deleteShapes([shapeId])
        setSelectedRoleId(null)
        message.success('已删除选中角色')
    }, [editor, selectedRoleId])


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
        // 可以重新加载数据以确保一致性
        // 这里选择信任本地更新
    }, [selectedRoleId])

    // 测试箭头连接：选择箭头工具后可以连接卡片的手柄
    const enableArrowTool = useCallback(() => {
        if (!editor) return
        editor.setCurrentTool('arrow')
        message.info('已切换到箭头工具，可以连接卡片上的蓝色连接点')
    }, [editor])

    return (
        <Layout style={{ padding: '24px 0', height: '100vh' }}>
            <Header style={{
                backgroundColor: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px #f0f0f0',
                zIndex: 100,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                justifyContent: 'space-between',
                height: 64,
                top: 0,
                left: 0,
                right: 0,
                borderBottom: 'none',
            }}>
                <Space size="large">
                    <Button onClick={() => navigate('/')} type="text" size="large">
                        <HomeOutlined /> 首页
                    </Button>
                    <Title level={2} style={{ margin: 0, color: 'rgba(0, 0, 0, 0.88)' }}>
                        人物角色卡片画布Demo
                    </Title>
                </Space>
                <Space>
                    <Button onClick={handleAddRole} type="primary">
                        添加角色卡片
                    </Button>
                    <Button onClick={enableArrowTool} type="default">
                        箭头连接工具
                    </Button>
                    <Button
                        onClick={handleEditeSelected}
                        type="default"
                        danger
                        disabled={!selectedRoleId}
                    >
                        编辑选中角色
                    </Button>
                    <Button 
                        onClick={handleDeleteSelected} 
                        type="default" 
                        danger
                        disabled={!selectedRoleId}
                    >
                        删除选中角色
                    </Button>
                </Space>
            </Header>

            <Content style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#f9f9f9',
                minHeight: 'calc(100vh - 64px)',
                minWidth: 'max(1500px, calc(100vw - 200px))',
            }}>
                <div style={{
                    position: 'relative',
                    inset: 0,
                    flex: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                }}>
                    <Tldraw
                        shapeUtils={shapeUtils}
                        onMount={handleMount}
                        components={{
                            // Toolbar: null,
                            StylePanel: null,
                            // PageMenu: null,
                            ZoomMenu: null,
                            MainMenu: null,
                            Minimap: null,
                            // MenuPanel: null,
                            // ContextMenu: null,
                            // HelperButtons: null,
                        }}
                    />
                </div>
            </Content>

            {/* 角色详情抽屉 */}
            <CharacterDetailDrawer
                character={selectedRole}
                characters={roles}
                open={drawerOpen}
                mode={drawerMode}
                projectId={actualProjectId}
                onClose={() => setDrawerOpen(false)}
                onSuccess={handleCharacterSuccess}
            />
        </Layout>
    )
}

export default CharacterCardDemo