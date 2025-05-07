import Save from "@/assets/icons/Save";
import { useWorkflowModelStore } from "@/store/useWorkflowsStorel";
import { Model } from "@/types/aiModels";
import { ActionNode, AiNodeData } from "@/types/workflow";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuCircleFadingPlus } from "react-icons/lu";
import { useParams } from "react-router";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeChange,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import Toast from "../common/Toast";
import { CustomAiNode } from "./CustomNodes";
import NodeModal from "./NodeModal";
import Panel from "./Panel";
import { FiZap } from "react-icons/fi";
import WorkflowQueue from "@/lib/WorkflowQueue";
import { useWorkflowQueueStore } from "@/store/useWorkflowQueueStore";
import { Spinner } from "../common/Spinner";
import { AINodeProcessedData, useNodeModelsStore } from "@/store/useNodeModels";
import {
  calculateNodePosition,
  checkNodeType,
  processParameters,
} from "@/lib/handlerHealper";

// Define node types
const nodeTypes = { aiNode: CustomAiNode };

const FlowCanvas: React.FC = () => {
  // React hooks
  const { id } = useParams<{ id: string }>();
  // React hooks end

  // Store hooks
  const { workflows, setWorkflows } = useWorkflowModelStore();
  const { workflowState } = useWorkflowQueueStore();
  const { isRunning, isPaused } = workflowState;
  const { nodesMap, addNode, deleteNode, updateNode, clearAllNodes } =
    useNodeModelsStore();
  // Store hooks end

  // Memoize the nodesMap to avoid unnecessary re-renders
  const zustandNodes = useMemo(() => Array.from(nodesMap.values()), [nodesMap]);

  // Local States
  const [nodes, setNodes] = useNodesState<AINodeProcessedData>(
    zustandNodes as any
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [parentNode, setParentNode] = useState<Node<AiNodeData> | null>(null);
  const [title, setTitle] = useState<string>("Untitled workflow");
  const [selectedNode, setSelectedNode] = useState<Node<AiNodeData> | null>(
    null
  );
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [workflowQueue, setWorkflowQueue] = useState<WorkflowQueue | null>(
    null
  );
  // Local States end

  // useEffect zone
  // Workflow instance
  // Initialize queue when nodes/edges change
  useEffect(() => {
    const queue = new WorkflowQueue(nodes as any, edges);
    setWorkflowQueue(queue);
    return () => queue.stop();
  }, [nodes, edges]);

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
  // useEffect zone end

  // Handler zone
  // Handle workflow generation
  const handleGenerate = async () => {
    if (!workflowQueue) return;

    try {
      // Find trigger node or first node
      const startNode = nodes.find((n) => n.data.data?.isTrigger) || nodes[0];
      if (!startNode) return;

      await workflowQueue.start(startNode.id);
    } catch (err) {
      console.error("Execution failed:", err);
    }
  };

  // Handle node changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // First apply changes to ReactFlow state
      setNodes((nds) => applyNodeChanges(changes, nds));

      // Then sync back to Zustand
      changes.forEach((change) => {
        if (change.type === "remove") {
          deleteNode(change.id);
        } else if (change.type === "position" && !change.dragging) {
          // Use updateNode instead of updateNodes for single node updates
          updateNode(change.id, {
            position: change.position,
          });
        }
      });
    },
    [setNodes, deleteNode, updateNode]
  );

  // Add a new node to the workflow
  const handleAddNode = useCallback(
    (model: Model | ActionNode) => {
      try {
        const newNodeId = uuidv4();
        const isFirstNode = nodes?.length === 0;
        const isActionNode = checkNodeType(model);

        // Process model parameters
        const processedModel = {
          ...model,
          parameters: processParameters(model?.parameters as any),
        };

        // Create new node
        const newNode = {
          id: newNodeId,
          type: isActionNode ? "actionNode" : "aiNode",
          position: calculateNodePosition(parentNode) || { x: 110, y: 110 },
          data: {
            label: model.name,
            config: processedModel,
            isTrigger: isFirstNode,
          },
        };

        addNode(newNode as AINodeProcessedData);
        setNodes((nds) => nds.concat(newNode as any));
        setParentNode(newNode);

        // Create edge if there's a parent node
        if (parentNode) {
          const newEdge: Edge = {
            id: uuidv4(),
            source: parentNode.id,
            target: newNodeId,
            animated: true,
          };
          setEdges((eds) => addEdge(newEdge, eds));
        }

        // Update UI state
        setIsModalOpen(false);
        setToast({
          message: "Node added successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error adding node:", error);
        setToast({
          message: `Failed to add node: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          type: "error",
        });
      }
    },
    [nodes, parentNode, edges, setEdges]
  );

  // Delete node and its connections
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      deleteNode(nodeId);

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
    [setNodes, setEdges, selectedNode?.id]
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
      setWorkflows(workflowData as any);
      setToast({
        message: "Workflow saved successfully",
        type: "success",
      });
      setNodes([]);
      setEdges([]);
      clearAllNodes();
      setTitle("Untitled workflow");
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
          className="hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 focus:outline-none"
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

        <button
          onClick={handleGenerate}
          disabled={isRunning && !isPaused}
          className="hover:bg-gray-200 border border-gray-200 shadow transition-all ease-in-out duration-300 rounded-lg p-2 cursor-pointer flex items-center justify-center gap-1"
        >
          {isRunning && !isPaused ? <Spinner size="sm" /> : <FiZap />}
          {isRunning && !isPaused ? "" : "Generate"}
        </button>

        {/* {isRunning && (
          <>
            {isPaused ? (
              <button
                onClick={() => workflowQueue?.resume()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={() => workflowQueue?.pause()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Pause
              </button>
            )}
            <button
              onClick={() => workflowQueue?.stop()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Stop
            </button>
          </>
        )} */}
      </div>

      {/* Main ReactFlow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
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

      <Panel
        isOpen={isPanelOpen}
        selectedNode={selectedNode}
        handleDelete={handleDeleteNode}
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
