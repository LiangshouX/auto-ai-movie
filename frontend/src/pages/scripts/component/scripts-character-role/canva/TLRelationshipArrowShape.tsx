import {Geometry2d, RecordProps, ShapeUtil, SVGContainer, T, TLShape} from 'tldraw'
import 'tldraw/tldraw.css'
import React, {useMemo} from "react";

// Goal: 自定义关系箭头形状

// 常量
export const RELATIONSHIP_ARROW_SHAPE_TYPE = 'relationship-arrow'
const DEFAULT_ARROW_LENGTH = 100

// [1] 扩展 TLGlobalShapePropsMap ，将Shape属性添加到全局类型
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

// [2] 定义形状类型
type IRelationshipArrowShape = TLShape<typeof RELATIONSHIP_ARROW_SHAPE_TYPE>

// 关系类型映射
const RELATIONSHIP_COLORS: Record<string, string> = {
    friend: '#10b981',      // 绿色 - 朋友
    enemy: '#ef4444',       // 红色 - 敌人
    lover: '#ec4899',       // 粉色 - 恋人
    family: '#8b5cf6',      // 紫色 - 家人
    colleague: '#3b82f6',   // 蓝色 - 同事
    acquaintance: '#6b7280', // 灰色 - 熟人
    rival: '#f97316',       // 橙色 - 对手
    mentor: '#06b6d4',      // 青色 - 导师
    protege: '#8b5cf6',     // 紫色 - 学生
    other: '#94a3b8',       // 浅灰色 - 其他
};

const RELATIONSHIP_LABELS: Record<string, string> = {
    friend: '朋友',
    enemy: '敌人',
    lover: '恋人',
    family: '家人',
    colleague: '同事',
    acquaintance: '熟人',
    rival: '对手',
    mentor: '导师',
    protege: '学生',
    other: '其他',
};

// 箭头头部组件
const ArrowHead: React.FC<{ x: number; y: number; angle: number; color: string }> = ({ 
    x, 
    y, 
    angle,
    color 
}) => {
    const headLength = 12;
    const headAngle = 0.5;
    
    const points = [
        [0, 0],
        [-headLength * Math.cos(headAngle), -headLength * Math.sin(headAngle)],
        [-headLength * Math.cos(-headAngle), -headLength * Math.sin(-headAngle)]
    ];

    const transform = `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`;

    return (
        <polygon
            points={points.map(p => p.join(',')).join(' ')}
            fill={color}
            stroke="none"
            transform={transform}
        />
    );
};

// 需要渲染的关系箭头组件
const RelationshipArrowComponent: React.FC<{
    shape: IRelationshipArrowShape;
}> = ({ shape }) => {
    const { sourcePoint, targetPoint, relationshipType } = shape.props;
    
    // 计算箭头角度
    const angle = useMemo(() => {
        return Math.atan2(targetPoint.y - sourcePoint.y, targetPoint.x - sourcePoint.x);
    }, [sourcePoint, targetPoint]);

    // 获取颜色
    const color = RELATIONSHIP_COLORS[relationshipType] || RELATIONSHIP_COLORS.other;
    const label = RELATIONSHIP_LABELS[relationshipType] || '关系';

    // 计算控制点用于贝塞尔曲线
    const midX = (sourcePoint.x + targetPoint.x) / 2;
    const midY = (sourcePoint.y + targetPoint.y) / 2;
    
    // 垂直偏移量，使线条更美观
    const offset = 30;
    const controlPoint = {
        x: midX + offset * Math.cos(angle + Math.PI/2),
        y: midY + offset * Math.sin(angle + Math.PI/2)
    };

    // 计算箭头起点和终点（避开角色卡片）
    const cardPadding = 20;
    const arrowStart = {
        x: sourcePoint.x + cardPadding * Math.cos(angle),
        y: sourcePoint.y + cardPadding * Math.sin(angle)
    };
    
    const arrowEnd = {
        x: targetPoint.x - cardPadding * Math.cos(angle),
        y: targetPoint.y - cardPadding * Math.sin(angle)
    };

    return (
        <SVGContainer>
            {/* 贝塞尔曲线箭头 */}
            <path
                d={`M ${arrowStart.x} ${arrowStart.y} Q ${controlPoint.x} ${controlPoint.y} ${arrowEnd.x} ${arrowEnd.y}`}
                stroke={color}
                strokeWidth="3"
                fill="none"
                markerEnd="none"
                style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
            />
            
            {/* 箭头头部 */}
            <ArrowHead 
                x={arrowEnd.x} 
                y={arrowEnd.y} 
                angle={angle} 
                color={color} 
            />
            
            {/* 关系标签 */}
            <foreignObject
                x={midX - 40}
                y={midY - 15}
                width="80"
                height="30"
            >
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: `2px solid ${color}`,
                        borderRadius: '16px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: color,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {label}
                </div>
            </foreignObject>
        </SVGContainer>
    );
};

// [3] 编写形状的 Util，
export class RelationshipArrowUtil extends ShapeUtil<IRelationshipArrowShape> {

    // [a] Editor 中，shape 的属性和类型
    static override type = RELATIONSHIP_ARROW_SHAPE_TYPE;
    static override props: RecordProps<IRelationshipArrowShape> = {
        sourceRoleId: T.string,
        targetRoleId: T.string,
        relationshipType: T.string,
        description: T.string,
        sourcePoint: T.object({ x: T.number, y: T.number }),
        targetPoint: T.object({ x: T.number, y: T.number }),
    }

    // [b] 返回一个方法，返回默认shape的默认属性
    getDefaultProps(): IRelationshipArrowShape["props"] {
        return {
            sourceRoleId: "",
            targetRoleId: "",
            relationshipType: "other",
            description: "",
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: DEFAULT_ARROW_LENGTH, y: DEFAULT_ARROW_LENGTH },
        };
    }

    // [c] 下面的方法无需定义，只需知道他们的存在即可
    // override canEdit() {
    //     return false
    // }
    //
    // override canResize() {
    //     return false
    // }
    //
    // override isAspectRatioLocked() {
    //     return false
    // }

    // [d] 获取 shape 对应的几何图形
    getGeometry(shape: IRelationshipArrowShape): Geometry2d {
        const { sourcePoint, targetPoint } = shape.props;
        const minX = Math.min(sourcePoint.x, targetPoint.x);
        const minY = Math.min(sourcePoint.y, targetPoint.y);
        const maxX = Math.max(sourcePoint.x, targetPoint.x);
        const maxY = Math.max(sourcePoint.y, targetPoint.y);
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            type: 'rectangle',
        } as unknown as Geometry2d;
    }

    // [e] 调整几何形状的大小
// override onResize(shape: IRelationshipArrowShape, info: TLResizeInfo<IRelationshipArrowShape>): Omit<TLShapePartial<IRelationshipArrowShape>, "id" | "type"> | void | undefined {
//     return super.onResize(shape, info);
// }

    // [f] 定义组件的渲染方式
    component(shape: IRelationshipArrowShape) {
        return (
            <RelationshipArrowComponent
                shape={shape}
            />
        )
    }

    // [g] 定义指示器
    indicator(shape: IRelationshipArrowShape): any {
        const { sourcePoint, targetPoint } = shape.props;
        return (
            <line
                x1={sourcePoint.x}
                y1={sourcePoint.y}
                x2={targetPoint.x}
                y2={targetPoint.y}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
            />
        );
    }
}