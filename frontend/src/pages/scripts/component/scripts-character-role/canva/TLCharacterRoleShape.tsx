import {
    Geometry2d,
    HTMLContainer,
    RecordProps,
    Rectangle2d,
    resizeBox,
    ShapeUtil,
    T,
    TLResizeInfo,
    TLShape,
    TLShapePartial,
} from 'tldraw'
import 'tldraw/tldraw.css'
import React from "react";

// Goal: 自定义角色卡片形状

// 常量
export const CHARACTER_ROLE_SHAPE_TYPE = 'role-shape'
const CARD_WIDTH = 180
const CARD_HEIGHT = 220

// [1] 扩展 TLGlobalShapePropsMap ，将Shape属性添加到全局类型
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

// [2] 定义形状类型
type ICharacterRoleShape = TLShape<typeof CHARACTER_ROLE_SHAPE_TYPE>


// 需要渲染的角色卡片组件
const RoleCardComponent: React.FC<{
    shape: ICharacterRoleShape;
    isSelected: boolean;
    onRoleClick: (roleId: string) => void;
}> = ({shape, isSelected, onRoleClick}) => {


    // 计算连接点位置
    // const connectionPoints = useMemo(() => ({
    //     top: {x: CARD_WIDTH / 2, y: 0},
    //     bottom: {x: CARD_WIDTH / 2, y: CARD_HEIGHT},
    //     left: {x: 0, y: CARD_HEIGHT / 2},
    //     right: {x: CARD_WIDTH, y: CARD_HEIGHT / 2}
    // }), [CARD_WIDTH, CARD_HEIGHT]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRoleClick(shape.props.roleId);
    };

    // 获取性别显示图标
    const getGenderIcon = (gender?: string) => {
        switch (gender) {
            case 'male':
                return '♂';
            case 'female':
                return '♀';
            default:
                return '⚥';
        }
    };

    // 获取年龄显示
    const getAgeDisplay = (age?: number) => {
        return age ? `${age}岁` : '年龄未知';
    };

    return (
        <HTMLContainer
            className={`role-card-container ${shape.props.isSelected ? 'selected' : ''}`}
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                cursor: 'pointer',
                userSelect: 'none',
            }}
        >
            <div
                className="role-card"
                onClick={handleClick}
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
                }}
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
                        {shape.props.name}
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
                        <span>{getGenderIcon(shape.props.gender)}</span>
                        <span>{getAgeDisplay(shape.props.age)}</span>
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
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center',
                    }}
                >
                    {shape.props.roleInStory || '暂无描述'}
                </div>

                {/* 连接点 - 四个方向 */}
                <div className="connection-points">
                    {/* 上连接点 */}
                    <div
                        className="connection-point top"
                        data-position="top"
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
                            opacity: isSelected ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* 下连接点 */}
                    <div
                        className="connection-point bottom"
                        data-position="bottom"
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
                            opacity: isSelected ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* 左连接点 */}
                    <div
                        className="connection-point left"
                        data-position="left"
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
                            opacity: isSelected ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* 右连接点 */}
                    <div
                        className="connection-point right"
                        data-position="right"
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
                            opacity: isSelected ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            </div>

        </HTMLContainer>
    )
};


// [3] 编写形状的 Util，
export class CharacterRoleUtil extends ShapeUtil<ICharacterRoleShape> {

    // [a] Editor 中，shape 的属性和类型
    static override type = CHARACTER_ROLE_SHAPE_TYPE;
    static override props: RecordProps<ICharacterRoleShape> = {
        w: T.number,
        h: T.number,
        roleId: T.string,
        name: T.string,
        age: T.number,
        gender: T.string,
        roleInStory: T.string,
        isSelected: T.boolean,
        connectionPoints: T.object({
            top: T.object({x: T.number, y: T.number}),
            bottom: T.object({x: T.number, y: T.number}),
            left: T.object({x: T.number, y: T.number}),
            right: T.object({x: T.number, y: T.number}),
        }),
    }

    // [b] 返回一个方法，返回默认shape的默认属性
    getDefaultProps(): ICharacterRoleShape["props"] {
        return {
            w: CARD_WIDTH,
            h: CARD_HEIGHT,
            roleId: "",
            name: "新角色",
            age: undefined,
            gender: undefined,
            roleInStory: "暂无",
            isSelected: false,
            connectionPoints: {
                top: {x: 90, y: 0},
                bottom: {x: 90, y: 220},
                left: {x: 0, y: 110},
                right: {x: 180, y: 110},
            },
        };
    }

    // [c] 下面的方法无需定义，只需知道他们的存在即可
    // override canEdit() {
    //     return false
    // }
    //
    // override canResize() {
    //     return true
    // }
    //
    // override isAspectRatioLocked() {
    //     return false
    // }

    // [d] 获取 shape 对应的几何图形
    getGeometry(shape: ICharacterRoleShape): Geometry2d {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        });
    }

    // [e] 调整几何形状的大小
    override onResize(shape: ICharacterRoleShape, info: TLResizeInfo<ICharacterRoleShape>): Omit<TLShapePartial<ICharacterRoleShape>, "id" | "type"> | void | undefined {
        return resizeBox(shape, info);
    }

    // [f] 定义组件的渲染方式
    handleRoleClick = (roleId: string) => {
        console.log(`人物 ${roleId} 被点击了`)
    }

    component(shape: ICharacterRoleShape) {
        return (
            <RoleCardComponent
                shape={shape}
                isSelected={shape.props.isSelected}
                onRoleClick={this.handleRoleClick}
            />
        )
    }


    // [g] 定义指示器
    indicator(shape: ICharacterRoleShape): any {
        return (
            <rect
                width={shape.props.w}
                height={shape.props.h}
                rx={12}
                ry={12}
            />
        );
    }
}

// [4] Next： 使用自定义的 Shape 渲染 Tldraw 组件














