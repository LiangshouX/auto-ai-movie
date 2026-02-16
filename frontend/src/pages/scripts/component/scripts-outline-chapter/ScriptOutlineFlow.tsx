import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Node,
    Panel,
    ReactFlowProvider,
    Connection,
    EdgeChange,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    NodeTypes,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { StoryOutlineDTO } from '@/api/types/scripts-outline-types';
import SectionNode from './components/nodes/SectionNode';
import ChapterNode from './components/nodes/ChapterNode';
import EpisodeNode from './components/nodes/EpisodeNode';
import ContextMenu from './components/ContextMenu';
import { convertOutlineToFlowData } from './utils/outline-utils';
import { getLayoutedElements } from './utils/layout-utils';

// Node Types
const nodeTypes: NodeTypes = {
    section: SectionNode as any,
    chapter: ChapterNode as any,
    episode: EpisodeNode as any,
};

// Props
interface ScriptOutlineFlowProps {
    outline: StoryOutlineDTO | null;
    onNodeClick: (nodeType: 'section' | 'chapter' | 'episode', data: any) => void;
    onAddChild: (parentId: string, nodeType: 'section' | 'chapter' | 'episode') => void;
    onDeleteNode: (id: string, nodeType: 'section' | 'chapter' | 'episode') => void;
    onAddSection: () => void;
    onAddSibling: (id: string, nodeType: 'section' | 'chapter' | 'episode') => void;
    onCopyNode: (id: string, nodeType: 'section' | 'chapter' | 'episode') => void;
}

const ScriptOutlineFlow: React.FC<ScriptOutlineFlowProps> = ({
    outline,
    onNodeClick,
    onAddChild,
    onDeleteNode,
    onAddSection,
    onAddSibling,
    onCopyNode
}) => {
    const [nodes, setNodes] = useNodesState<Node>([]);
    const [edges, setEdges] = useEdgesState<Edge>([]);
    const [layoutDirection, setLayoutDirection] = useState('LR');
    const [menu, setMenu] = useState<{id: string; top: number; left: number; type: string} | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    // Transform Data to Flow Elements and Layout
    useEffect(() => {
        if (!outline) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const { nodes: initialNodes, edges: initialEdges } = convertOutlineToFlowData(outline);

        // Enhance nodes with callbacks
        const enhancedNodes = initialNodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onAddChild: (id: string) => {
                    if (node.type === 'section') onAddChild(id, 'chapter');
                    if (node.type === 'chapter') onAddChild(id, 'episode');
                },
                onEdit: (_id: string) => onNodeClick(node.type as any, node.data),
                onDelete: (id: string) => onDeleteNode(id, node.type as any),
            }
        }));

        const layouted = getLayoutedElements(enhancedNodes, initialEdges, layoutDirection);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

    }, [outline, layoutDirection, onNodeClick, onAddChild, onDeleteNode, setNodes, setEdges]);

    const onNodesChangeHandler = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );

    const onEdgesChangeHandler = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onLayout = useCallback((direction: string) => {
        setLayoutDirection(direction);
    }, []);

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            // Prevent native context menu
            event.preventDefault();

            if (!ref.current) return;

            // Calculate position relative to container
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY - pane.top,
                left: event.clientX - pane.left,
                type: node.type || '',
            });
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    const handleMenuAction = (action: string, id: string, type: string) => {
        switch(action) {
            case 'insert-after':
                 onAddSibling(id, type as any);
                 break;
            case 'insert-child':
                 if (type === 'section') onAddChild(id, 'chapter');
                 if (type === 'chapter') onAddChild(id, 'episode');
                 break;
            case 'delete':
                 onDeleteNode(id, type as any);
                 break;
            case 'copy':
                 onCopyNode(id, type as any);
                 break;
        }
        setMenu(null);
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={ref}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChangeHandler}
                onEdgesChange={onEdgesChangeHandler}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                attributionPosition="bottom-right"
                onNodeContextMenu={onNodeContextMenu}
                onPaneClick={onPaneClick}
            >
                <Controls />
                <MiniMap zoomable pannable nodeStrokeColor={(n) => {
                    if (n.type === 'section') return '#1890ff';
                    if (n.type === 'chapter') return '#52c41a';
                    if (n.type === 'episode') return '#fa8c16';
                    return '#eee';
                }} />
                <Background color="#aaa" gap={16} />
                <Panel position="top-left">
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={onAddSection}
                        >
                            新增卷
                        </Button>
                        <Button onClick={() => onLayout('LR')}>水平布局</Button>
                        <Button onClick={() => onLayout('TB')}>垂直布局</Button>
                    </Space>
                </Panel>
                {menu && <ContextMenu onClose={onPaneClick} {...menu} onAction={handleMenuAction} />}
            </ReactFlow>
        </div>
    );
};

export default function ScriptOutlineFlowWrapper(props: ScriptOutlineFlowProps) {
    return (
        <ReactFlowProvider>
            <ScriptOutlineFlow {...props} />
        </ReactFlowProvider>
    );
}
