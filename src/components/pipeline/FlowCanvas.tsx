import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node, 
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import NodeModal from "./NodeModal";
import { CustomAiNode } from "./CustomNodes";

import "reactflow/dist/style.css";
import { AiNodeData } from "@/types/workflow";
import { loadWorkflow, saveWorkflow } from "@/utils/workflowUtils";
import { AiModelConfig } from "@/types/aiModels";
import Save from "@/assets/icons/Save";
import { LuChevronLeft, LuCircleFadingPlus } from "react-icons/lu";
import NodeContextMenu from "./NodeContextMenu";
import { useParams } from "react-router";
import Panel from "./Panel";

const nodeTypes = { aiNode: CustomAiNode };

const FlowCanvas = () => {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<AiNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [parentNode, setParentNode] = useState<Node<AiNodeData> | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);
  const [title, setTitle] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const saved = loadWorkflow(id);
      if (saved) {
        setNodes(saved.nodes as any);
        setEdges(saved.edges);
        setTitle(saved.title || "Untitled workflow");
      }
    }
  }, [id]);

  const onNodeContextMenu = (
    event: React.MouseEvent,
    node: Node<AiNodeData>
  ) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const handleAddNode = (config: AiModelConfig) => {
    const newNodeId = uuidv4();

    const isFirstNode = nodes.length === 0;

    const newNode: Node<AiNodeData> = {
      id: newNodeId,
      type: "aiNode",
      position: {
        x: parentNode ? parentNode.position.x + 250 : 100,
        y: parentNode ? parentNode.position.y + 100 : 100,
      },
      data: {
        label: config.name,
        config: {
          ...config,
          isTrigger: isFirstNode,
        },
      },
    };

    setNodes((nds) => [...nds, newNode] as any);
    setParentNode(newNode);

    if (parentNode) {
      const newEdge: Edge = {
        id: uuidv4(),
        source: parentNode.id,
        target: newNodeId,
        animated: true,
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    setIsModalOpen(false);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const existing = edges.find((e) => e.source === params.source);
      if (!existing) {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds));
      }
    },
    [edges, setEdges]
  );

  const saveCurrentWorkflow = () => {
    if (id) {
      const existing = loadWorkflow(id);
      const now = new Date().toLocaleString();

      const workflowData = {
        nodes: nodes as any,
        edges,
        title,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        isActive: existing?.isActive || false,
      };

      // console.log(workflowData);
      saveWorkflow(id, workflowData);
      alert("Workflow saved!");
      window.history.back();
    }
  };

  // When a node is clicked
  const handleNodeSelect = (node: Node<AiNodeData>) => {
    setSelectedNodeId(node?.id);
    setIsPanelOpen(true);
  };

  return (
    <div className="w-full h-[90vh] relative">
      <div className="absolute top-4 left-0 z-10 flex items-center px-4 gap-2.5">
        <div
          onClick={() => window.history.back()}
          className={
            "hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          }
        >
          <LuChevronLeft size={20} />
        </div>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Untitled workflow"
          defaultValue={title}
          className={
            "hover:bg-gray-50 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer focus:outline-none"
          }
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
        className="w-fit mx-auto flex items-center justify-center gap-4"
      >
        <button
          onClick={() => {
            setParentNode(null);
            setIsModalOpen(true);
          }}
          className={
            "hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          }
        >
          <LuCircleFadingPlus size={20} />
        </button>
        <button
          onClick={saveCurrentWorkflow}
          className={
            "hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          }
        >
          <Save size={20} />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        onNodeClick={(_, node) => handleNodeSelect(node)}
        fitView
        connectionLineStyle={{ stroke: "#000", strokeWidth: 2 }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddNode}
      />

      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => deleteNode(contextMenu.nodeId)}
          onClose={() => setContextMenu(null)}
        />
      )}

      <Panel
        isOpen={isPanelOpen}
        selectedNodeId={selectedNodeId as string}
        setNodes={setNodes as any}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default FlowCanvas;
