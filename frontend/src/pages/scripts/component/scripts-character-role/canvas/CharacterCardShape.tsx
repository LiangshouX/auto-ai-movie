import {
    BaseBoxShapeUtil,
    HTMLContainer,
    IndexKey,
    RecordProps,
    T,
    TLHandle,
    TLShape,
} from 'tldraw'
import 'tldraw/tldraw.css'
import React, { useState } from 'react'

// 形状类型常量
export const CHARACTER_CARD_SHAPE_TYPE = 'character-card' as const

// 默认卡片尺寸
const DEFAULT_CARD_WIDTH = 180
const DEFAULT_CARD_HEIGHT = 220

// [1] 扩展 TLGlobalShapePropsMap，定义形状属性
declare module 'tldraw' {
    export interface TLGlobalShapePropsMap {
        [CHARACTER_CARD_SHAPE_TYPE]: {
            // 基础尺寸
            w: number
            h: number
            // 角色标识
            roleId: string
            // 基本信息
            name: string
            age?: number
            gender?: string
            height?: string
            weight?: string
            // 角色设定
            roleInStory: string
            personalityTags: string[]
            skills: string[]
            characterSetting: string
            relationships: { relationshipType: string; relatedCharacterName: string }[]
            // 显示状态
            isSelected: boolean
        }
    }
}

// [2] 定义形状类型
type ICharacterCardShape = TLShape<typeof CHARACTER_CARD_SHAPE_TYPE>

// [3] 角色卡片组件
interface RoleCardComponentProps {
    shape: ICharacterCardShape
    isSelected: boolean
}

const RoleCardComponent: React.FC<RoleCardComponentProps> = ({ shape, isSelected }) => {
    const [hover, setHover] = useState(false)
    const { props } = shape
    const { w, h, name, age, gender, roleInStory, personalityTags, relationships } = props

    // 获取性别显示图标
    const getGenderIcon = (gender?: string) => {
        switch (gender) {
            case 'male':
                return '♂'
            case 'female':
                return '♀'
            default:
                return '⚥'
        }
    }

    // 获取年龄显示
    const getAgeDisplay = (age?: number) => {
        return age ? `${age}岁` : '年龄未知'
    }

    const tagPalette = [
        { bg: '#dbeafe', text: '#1d4ed8' },
        { bg: '#dcfce7', text: '#166534' },
        { bg: '#ffedd5', text: '#9a3412' },
        { bg: '#f3e8ff', text: '#6b21a8' },
        { bg: '#ffe4e6', text: '#9f1239' },
        { bg: '#e0f2fe', text: '#075985' },
    ]

    const hasTags = Array.isArray(personalityTags) && personalityTags.length > 0
    const hasRelationships = Array.isArray(relationships) && relationships.length > 0
    const tagList = hasTags ? personalityTags.slice(0, 6) : []
    const relationshipList = hasRelationships ? relationships.slice(0, 3) : []
    const descriptionClamp = hasTags || hasRelationships ? 3 : 4

    return (
        <HTMLContainer
            style={{
                width: w,
                height: h,
                cursor: 'pointer',
                userSelect: 'none',
            }}
        >
            <div
                className="character-card"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: isSelected
                        ? '3px solid #2563eb'
                        : '2px solid #e2e8f0',
                    boxShadow: isSelected
                        ? '0 8px 24px rgba(37, 99, 235, 0.2)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseEnter={() => {setHover(true)}}
                onMouseLeave={() => setHover(false)}
            >
                {/* 角色名称 */}
                <div className="role-header">
                    <h3
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1e293b',
                            textAlign: 'center',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {name}
                    </h3>

                    {/* 性别和年龄信息 */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            fontSize: '14px',
                            color: '#64748b',
                        }}
                    >
                        <span>{getGenderIcon(gender)}</span>
                        <span>{getAgeDisplay(age)}</span>
                    </div>
                </div>

                {/* 角色在故事中的作用 */}
                <div
                    className="role-description"
                    style={{
                        flex: 1,
                        fontSize: '13px',
                        color: '#475569',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: descriptionClamp,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center',
                    }}
                >
                    {roleInStory || '暂无描述'}
                </div>

                {/* 性格标签 */}
                {hasTags && (
                    <div style={{ marginTop: 8 }}>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                                justifyContent: 'center',
                            }}
                        >
                            {tagList.map((tag, index) => {
                                const palette = tagPalette[index % tagPalette.length]
                                return (
                                    <span
                                        key={`${tag}-${index}`}
                                        style={{
                                            padding: '2px 8px',
                                            borderRadius: 8,
                                            backgroundColor: palette.bg,
                                            color: palette.text,
                                            fontSize: 12,
                                            lineHeight: '16px',
                                            fontWeight: 500,
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        title={tag}
                                    >
                                        {tag}
                                    </span>
                                )
                            })}
                            {personalityTags.length > tagList.length && (
                                <span
                                    style={{
                                        padding: '2px 8px',
                                        borderRadius: 8,
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        fontWeight: 500,
                                    }}
                                    title={personalityTags.join('、')}
                                >
                                    +{personalityTags.length - tagList.length}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 人物关系 */}
                {hasRelationships && (
                    <div style={{ marginTop: 8 }}>
                        <div
                            style={{
                                borderTop: '1px solid #e2e8f0',
                                paddingTop: 8,
                            }}
                        >
                            {relationshipList.map((rel, index) => (
                                <div
                                    key={`${rel.relationshipType}-${rel.relatedCharacterName}-${index}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 6,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: '#475569',
                                        paddingBottom: index === relationshipList.length - 1 ? 0 : 8,
                                        marginBottom: index === relationshipList.length - 1 ? 0 : 8,
                                        borderBottom: index === relationshipList.length - 1 ? 'none' : '1px dashed #e2e8f0',
                                    }}
                                    title={`${rel.relationshipType}: ${rel.relatedCharacterName}`}
                                >
                                    <span style={{ fontWeight: 700, color: '#334155' }}>
                                        {rel.relationshipType}:
                                    </span>
                                    <span
                                        style={{
                                            maxWidth: 120,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {rel.relatedCharacterName}
                                    </span>
                                </div>
                            ))}
                            {relationships.length > relationshipList.length && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: '#64748b',
                                    }}
                                    title={relationships.map(r => `${r.relationshipType}: ${r.relatedCharacterName}`).join('\n')}
                                >
                                    还有 {relationships.length - relationshipList.length} 条关系
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 悬浮操作按钮 */}
                {hover && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 8,
                            right: 8,
                            bottom: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            borderRadius: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            zIndex: 10,
                            padding: 8,
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)',
                        }}
                    >
                        <button
                            onClick={() => {
                                const event = new CustomEvent('character-card-view', { detail: { roleId: props.roleId } })
                                window.dispatchEvent(event)
                            }}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            查看
                        </button>
                        <button
                            onClick={() => {
                                const event = new CustomEvent('character-card-edit', { detail: { roleId: props.roleId } })
                                window.dispatchEvent(event)
                            }}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            编辑
                        </button>
                    </div>
                )}

                {/* 选中状态指示器 */}
                {isSelected && (
                    <div className="connection-points">
                        {/* 上连接点 */}
                        <div
                            className="connection-point top"
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#2563eb',
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 0 0 2px #2563eb',
                                pointerEvents: 'none',
                            }}
                        />
                        {/* 下连接点 */}
                        <div
                            className="connection-point bottom"
                            style={{
                                position: 'absolute',
                                bottom: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#2563eb',
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 0 0 2px #2563eb',
                                pointerEvents: 'none',
                            }}
                        />
                        {/* 左连接点 */}
                        <div
                            className="connection-point left"
                            style={{
                                position: 'absolute',
                                left: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#2563eb',
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 0 0 2px #2563eb',
                                pointerEvents: 'none',
                            }}
                        />
                        {/* 右连接点 */}
                        <div
                            className="connection-point right"
                            style={{
                                position: 'absolute',
                                right: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#2563eb',
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 0 0 2px #2563eb',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                )}
            </div>
        </HTMLContainer>
    )
}

// [4] 形状工具类
export class CharacterCardShapeUtil extends BaseBoxShapeUtil<ICharacterCardShape> {
    static override type = CHARACTER_CARD_SHAPE_TYPE

    static override props: RecordProps<ICharacterCardShape> = {
        w: T.number,
        h: T.number,
        roleId: T.string,
        name: T.string,
        age: T.number.optional(),
        gender: T.string.optional(),
        height: T.string.optional(),
        weight: T.string.optional(),
        roleInStory: T.string,
        personalityTags: T.arrayOf(T.string),
        skills: T.arrayOf(T.string),
        characterSetting: T.string,
        relationships: T.arrayOf(
            T.object({
                relationshipType: T.string,
                relatedCharacterName: T.string,
            })
        ),
        isSelected: T.boolean,
    }

    override isAspectRatioLocked(_shape: ICharacterCardShape) {
        return false
    }

    override canResize(_shape: ICharacterCardShape) {
        return true
    }

    override canEdit(_shape: ICharacterCardShape) {
        return false
    }

    // 默认属性
    getDefaultProps(): ICharacterCardShape['props'] {
        return {
            w: DEFAULT_CARD_WIDTH,
            h: DEFAULT_CARD_HEIGHT,
            roleId: '',
            name: '新角色',
            age: undefined,
            gender: undefined,
            height: undefined,
            weight: undefined,
            roleInStory: '暂无描述',
            personalityTags: [],
            skills: [],
            characterSetting: '',
            relationships: [],
            isSelected: false,
        }
    }

    // 几何图形（由BaseBoxShapeUtil提供，无需重写）
    // getGeometry(shape: ICharacterCardShape): Geometry2d {
    //     return new Rectangle2d({
    //         width: shape.props.w,
    //         height: shape.props.h,
    //         isFilled: true,
    //     })
    // }

    // 调整大小（由BaseBoxShapeUtil提供，无需重写）
    // override onResize(shape: ICharacterCardShape, info: TLResizeInfo<ICharacterCardShape>) {
    //     return resizeBox(shape, info)
    // }

    // 获取手柄 - 用于箭头连接
    override getHandles(shape: ICharacterCardShape): TLHandle[] {
        const { w, h } = shape.props
        const halfW = w / 2
        const halfH = h / 2

        return [
            {
                id: 'top',
                type: 'vertex',
                index: 'a0' as IndexKey,
                x: halfW,
                y: 0,
            },
            {
                id: 'bottom',
                type: 'vertex',
                index: 'a1' as IndexKey,
                x: halfW,
                y: h,
            },
            {
                id: 'left',
                type: 'vertex',
                index: 'a2' as IndexKey,
                x: 0,
                y: halfH,
            },
            {
                id: 'right',
                type: 'vertex',
                index: 'a3' as IndexKey,
                x: w,
                y: halfH,
            },
        ]
    }

    // 渲染组件
    component(shape: ICharacterCardShape) {
        return (
            <RoleCardComponent
                shape={shape}
                isSelected={shape.props.isSelected}
            />
        )
    }

    // 指示器（选中时的轮廓）
    indicator(shape: ICharacterCardShape) {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                rx={12}
                ry={12}
            />
        )
    }
}
