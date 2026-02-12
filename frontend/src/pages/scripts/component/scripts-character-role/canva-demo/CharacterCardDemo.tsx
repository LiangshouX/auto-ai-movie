import { useCallback, useEffect, useState } from 'react'
import { Editor, Tldraw, TLShapeId } from 'tldraw'
import 'tldraw/tldraw.css'
import { CharacterCardShapeUtil, CHARACTER_CARD_SHAPE_TYPE } from './CharacterCardShape.tsx'
import { Button, Layout, Space, Typography, message } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography
const { Header, Content } = Layout

// 示例角色数据
const SAMPLE_ROLES = [
    {
        id: 'role-1',
        name: '张三',
        age: 25,
        gender: 'male' as const,
        roleInStory: '主角，勇敢的冒险者',
        personalityTags: ['勇敢', '正直', '冲动'],
        skills: ['剑术', '领导力'],
        characterSetting: '出生于边境小镇，父母早逝',
    },
    {
        id: 'role-2',
        name: '李四',
        age: 30,
        gender: 'male' as const,
        roleInStory: '反派，野心勃勃的贵族',
        personalityTags: ['狡猾', '野心家', '冷酷'],
        skills: ['政治手腕', '剑术'],
        characterSetting: '贵族出身，渴望权力',
    },
    {
        id: 'role-3',
        name: '王五',
        age: 22,
        gender: 'female' as const,
        roleInStory: '女主角，神秘的魔法师',
        personalityTags: ['聪明', '神秘', '善良'],
        skills: ['魔法', '治疗'],
        characterSetting: '来自古老的魔法家族',
    },
]

const CharacterCardDemo = () => {
    const navigate = useNavigate()
    const [editor, setEditor] = useState<Editor | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

    // 自定义形状工具
    const shapeUtils = [CharacterCardShapeUtil]

    // 初始化画布：创建示例角色卡片
    const initializeCanvas = useCallback((editor: Editor) => {
        // 清除现有形状
        const existingShapes = editor.getCurrentPageShapes()
        if (existingShapes.length > 0) {
            editor.deleteShapes(existingShapes.map(s => s.id))
        }

        // 创建角色卡片形状
        const shapes = SAMPLE_ROLES.map((role, index) => ({
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
                roleInStory: role.roleInStory,
                personalityTags: role.personalityTags,
                skills: role.skills,
                characterSetting: role.characterSetting,
                isSelected: false,
            },
        }))

        editor.createShapes(shapes)
        message.success('已创建示例角色卡片')
    }, [])

    // 处理编辑器挂载
    const handleMount = useCallback((editor: Editor) => {
        setEditor(editor)
        initializeCanvas(editor)
    }, [initializeCanvas])

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
                    // message.info(`选中角色: ${shape.props.name}`)
                }
            } else {
                setSelectedRoleId(null)
            }
        }

        const unsubscribe = editor.addListener('change', handleSelectionChange)
        return () => (unsubscribe as any)()
    }, [editor])



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

    // 删除选中角色
    const handleDeleteSelected = useCallback(() => {
        if (!editor || !selectedRoleId) return

        const shapeId = `shape:${selectedRoleId}` as TLShapeId
        editor.deleteShapes([shapeId])
        setSelectedRoleId(null)
        message.success('已删除选中角色')
    }, [editor, selectedRoleId])

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
                borderBottom: '1px solid #e0e0e0',
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
                    />
                </div>

                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff', borderRadius: '8px' }}>
                    <Title level={4}>使用说明</Title>
                    <ul>
                        <li>
                            <strong>点击角色卡片</strong>：选中卡片，选中后会出现蓝色边框和四个连接点
                        </li>
                        <li>
                            <strong>箭头连接</strong>：点击右上角"箭头连接工具"按钮，然后从一个卡片的连接点拖动到另一个卡片的连接点
                        </li>
                        <li>
                            <strong>调整大小</strong>：选中卡片后，拖动角落的控制点可以调整卡片大小
                        </li>
                        <li>
                            <strong>移动卡片</strong>：拖动卡片可以移动位置
                        </li>
                        <li>
                            <strong>添加/删除卡片</strong>：使用顶部按钮添加新卡片或删除选中卡片
                        </li>
                    </ul>
                    
                    {selectedRoleId && (
                        <div style={{ marginTop: '16px' }}>
                            <Title level={5}>当前选中角色</Title>
                            <p>角色ID: {selectedRoleId}</p>
                            <p>角色名称: {SAMPLE_ROLES.find(r => r.id === selectedRoleId)?.name || '未知'}</p>
                        </div>
                    )}
                </div>
            </Content>
        </Layout>
    )
}

export default CharacterCardDemo