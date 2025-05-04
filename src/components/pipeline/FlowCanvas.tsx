import Save from "@/assets/icons/Save";
import { useWorkflowModelStore } from "@/store/useNodeModel";
import { Model } from "@/types/aiModels";
import { ActionNode, AiNodeData } from "@/types/workflow";
import React, { useCallback, useEffect, useState } from "react";
import { LuChevronLeft, LuCircleFadingPlus } from "react-icons/lu";
import { useParams } from "react-router";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { CustomAiNode } from "./CustomNodes";
import NodeContextMenu from "./NodeContextMenu";
import NodeModal from "./NodeModal";
import Panel from "./Panel";

const nodeTypes = { aiNode: CustomAiNode };

const FlowCanvas = () => {
  const { id } = useParams<{ id: string }>();
  const { workflows, setWorkflows } = useWorkflowModelStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<AiNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentNode, setParentNode] = useState<Node<AiNodeData> | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);
  const [title, setTitle] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<Node<AiNodeData> | null>(
    null
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const saved = workflows?.find((flow) => flow?.id === id);
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
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  // const handleAddNode = (model: Model) => {
  //   const newNodeId = uuidv4();
  //   const isFirstNode = nodes.length === 0;

  //   const newNode: Node<AiNodeData> = {
  //     id: newNodeId,
  //     type: "aiNode",
  //     position: {
  //       x: parentNode ? parentNode.position.x + 250 : 100,
  //       y: parentNode ? parentNode.position.y + 100 : 100,
  //     },
  //     data: {
  //       label: model.name,
  //       config: model,
  //       isTrigger: isFirstNode,
  //     },
  //   };

  //   setNodes((nds) => [...nds, newNode] as any);
  //   setParentNode(newNode);

  //   if (parentNode) {
  //     const newEdge: Edge = {
  //       id: uuidv4(),
  //       source: parentNode.id,
  //       target: newNodeId,
  //       animated: true,
  //     };
  //     setEdges((eds) => [...eds, newEdge]);
  //   }

  //   setIsModalOpen(false);
  // };

  const handleAddNode = (model: Model | ActionNode) => {
    const newNodeId = uuidv4();
    const isFirstNode = nodes.length === 0;

    // Calculate position based on parent node or last node
    let newPosition = { x: 100, y: 100 }; // Default position

    if (parentNode) {
      // Find all nodes connected to the parent to determine rightmost position
      const connectedNodes = edges
        .filter((edge) => edge.source === parentNode.id)
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter(Boolean) as unknown as Node<AiNodeData>[];

      // Get the rightmost position of connected nodes
      const rightmostX = connectedNodes.reduce(
        (maxX, node) => Math.max(maxX, node.position.x),
        parentNode.position.x
      );

      // Position new node to the right of the rightmost connected node
      newPosition = {
        x: rightmostX + 300, // Fixed horizontal spacing
        y: parentNode.position.y, // Align vertically with parent
      };
    } else if (nodes.length > 0) {
      // If no parent but nodes exist, place below last node
      const lastNode = nodes[nodes.length - 1];
      newPosition = {
        x: lastNode.position.x,
        y: lastNode.position.y + 150,
      };
    }

    const newNode: Node<AiNodeData> = {
      id: newNodeId,
      type: "aiNode",
      position: newPosition,
      data: {
        label: model.name,
        config: model,
        isTrigger: isFirstNode,
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
      const existing = workflows?.find((flow) => flow?.id === id);
      const now = new Date().toLocaleString();

      const workflowData = {
        id: id,
        nodes: nodes as any,
        edges,
        title,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        isActive: existing?.isActive || false,
      };

      setWorkflows(workflowData);
      alert("Workflow saved!");
      window.history.back();
    }
  };

  const handleNodeSelect = (node: Node<AiNodeData>) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };

  return (
    <div className="w-full h-[90vh] relative">
      <div className="absolute top-4 left-0 z-10 flex items-center px-4 gap-2.5">
        <div
          onClick={() => window.history.back()}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
        >
          <LuChevronLeft size={20} />
        </div>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Untitled workflow"
          defaultValue={title}
          className="hover:bg-gray-50 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer focus:outline-none"
        />
      </div>

      <div className="w-fit mx-auto flex items-center justify-center gap-4 absolute bottom-10 md:bottom-8 left-0 right-0 z-10">
        <button
          onClick={() => {
            setParentNode(null);
            setIsModalOpen(true);
          }}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
        >
          <LuCircleFadingPlus size={20} />
        </button>
        <button
          onClick={saveCurrentWorkflow}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
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
        fitViewOptions={{ padding: 0.1 }}
        fitView={false}
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
        selectedNode={selectedNode}
        setNodes={setNodes as any}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default FlowCanvas;
