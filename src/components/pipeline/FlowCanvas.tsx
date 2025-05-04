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
  NodeMouseHandler,
  useEdgesState,
  useNodesState,
  XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import Toast from "../common/Toast";
import { CustomAiNode } from "./CustomNodes";
import NodeContextMenu from "./NodeContextMenu";
import NodeModal from "./NodeModal";
import Panel from "./Panel";

// Define node types
const nodeTypes = { aiNode: CustomAiNode };

// Node positioning utilities
const calculateNodePosition = (
  parentNode: Node<AiNodeData> | null,
  nodes: Node<AiNodeData>[],
  edges: Edge[]
): XYPosition => {
  // Default position for the first node
  if (nodes.length === 0) {
    return { x: 100, y: 100 };
  }

  if (parentNode) {
    // Find all nodes connected to the parent
    const connectedNodes = edges
      .filter((edge) => edge.source === parentNode.id)
      .map((edge) => nodes.find((node) => node.id === edge.target))
      .filter(Boolean) as Node<AiNodeData>[];

    // Get the rightmost position of connected nodes
    const rightmostX = connectedNodes.reduce(
      (maxX, node) => Math.max(maxX, node.position.x),
      parentNode.position.x
    );

    // Position new node to the right of the rightmost connected node
    return {
      x: rightmostX + 200, // Fixed horizontal spacing
      y: parentNode.position.y, // Align vertically with parent
    };
  } else {
    // If no parent but nodes exist, place below last node
    const lastNode = nodes[nodes.length - 1]; // Fixed: use nodes.length - 1 to get the last element
    return {
      x: lastNode.position.x,
      y: lastNode.position.y + 150,
    };
  }
};

const FlowCanvas: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workflows, setWorkflows } = useWorkflowModelStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<AiNodeData>>(
    []
  ) as unknown as [
    Node<AiNodeData>[],
    React.Dispatch<React.SetStateAction<Node<AiNodeData>[]>>,
    (changes: any) => void
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  console.log(nodes);

  // Load workflow when component mounts
  useEffect(() => {
    if (id) {
      try {
        const saved = workflows?.find((flow) => flow?.id === id);
        if (saved) {
          // Use type assertion to handle the TypeScript issue
          setNodes(saved.nodes as any);
          setEdges(saved.edges);
          setTitle(saved.title || "Untitled workflow");
        }
      } catch (error) {
        console.error("Error loading workflow:", error);
        setToast({
          message: "Failed to load workflow",
          type: "error",
        });
      }
    }
  }, [id, setNodes, setEdges]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Save workflow with Ctrl+S or Command+S
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveCurrentWorkflow();
      }

      // Delete selected node with Delete key
      if (event.key === "Delete" && selectedNode) {
        deleteNode(selectedNode.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode]);

  // Handle node context menu
  const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  // Delete node and its connections
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      // Close panel if the deleted node was selected
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
        setIsPanelOpen(false);
      }

      setToast({
        message: "Node deleted",
        type: "info",
      });
    },
    [setNodes, setEdges, selectedNode]
  );

  // Add a new node to the workflow
  const handleAddNode = useCallback(
    (model: Model | ActionNode) => {
      const newNodeId = uuidv4();
      const isFirstNode = nodes?.length === 0;

      // Calculate position using the utility function
      const newPosition = calculateNodePosition(parentNode, nodes, edges);

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
        setEdges((eds) => addEdge(newEdge, eds));
      }

      setIsModalOpen(false);
      setToast({
        message: "Node added",
        type: "success",
      });
    },
    [nodes, edges, parentNode, setNodes, setEdges]
  );

  // Connect nodes
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Prevent multiple outgoing connections from the same source
      const existing = edges.find(
        (e) => e.source === params.source && e.target === params.target
      );

      if (!existing) {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds));
        setToast({
          message: "Nodes connected",
          type: "success",
        });
      } else {
        setToast({
          message: "Node already has a connection",
          type: "info",
        });
      }
    },
    [edges, setEdges]
  );

  // Save the current workflow
  const saveCurrentWorkflow = useCallback(() => {
    if (!id) {
      setToast({
        message: "No workflow ID found",
        type: "error",
      });
      return;
    }

    try {
      const existing = workflows?.find((flow) => flow?.id === id);
      const now = new Date().toLocaleString();

      const workflowData = {
        id: id,
        nodes,
        edges,
        title,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        isActive: existing?.isActive || false,
      };
      setWorkflows(workflowData);
      setToast({
        message: "Workflow saved successfully",
        type: "success",
      });
      window.history.back();
    } catch (error) {
      console.error("Error saving workflow:", error);
      setToast({
        message: "Failed to save workflow",
        type: "error",
      });
    }
  }, [id, nodes, edges, title]);

  // Handle node selection
  const handleNodeSelect = useCallback((node: Node<AiNodeData>) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  return (
    <div className="w-full h-[90vh] relative">
      {/* Header with title and back button */}
      <div className="absolute top-4 left-0 z-10 flex items-center px-4 gap-2.5">
        <div
          onClick={() => window.history.back()}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          title="Go back"
        >
          <LuChevronLeft size={20} />
        </div>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Untitled workflow"
          value={title}
          className="hover:bg-gray-50 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer focus:outline-none"
          aria-label="Workflow title"
        />
      </div>

      {/* Action buttons */}
      <div className="w-fit mx-auto flex items-center justify-center gap-4 absolute bottom-10 md:bottom-8 left-0 right-0 z-10">
        <button
          onClick={() => {
            // setParentNode(null);
            setIsModalOpen(true);
          }}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          title="Add new node (Ctrl+N)"
        >
          <LuCircleFadingPlus size={20} />
        </button>
        <button
          onClick={saveCurrentWorkflow}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer"
          title="Save workflow (Ctrl+S)"
        >
          <Save size={20} />
        </button>
      </div>

      {/* Main ReactFlow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
        onNodeClick={(_, node) => handleNodeSelect(node as Node<AiNodeData>)}
        fitViewOptions={{ padding: 0.4 }}
        fitView
        connectionLineStyle={{ stroke: "#000", strokeWidth: 2 }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Modals and overlays */}
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

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FlowCanvas;
