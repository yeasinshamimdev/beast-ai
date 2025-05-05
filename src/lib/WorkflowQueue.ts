import { useWorkflowQueueStore } from "@/store/useWorkflowQueueStore";
import { NodeType } from "@/types/queue";
import { AiNodeData } from "@/types/workflow";
import { Edge, Node } from "reactflow";

// This is a custom workflow queue class that manages the execution of nodes in a workflow.
// It handles the registration of node executors, execution of nodes, and the management of the workflow state.
// The class is designed to be flexible and allows for the addition of custom node types and their corresponding execution logic.
// The WorkflowQueue class is initialized with a set of nodes and edges, and it provides methods to start, stop, pause, and resume the workflow execution.
// It also includes methods to register custom executors for specific node types, allowing users to define their own execution logic.
// The class uses Zustand for state management, allowing for a reactive and efficient way to manage the workflow state.
// The WorkflowQueue class is designed to be extensible, allowing users to add new node types and their corresponding execution logic easily.

type NodeExecutor = (node: Node<AiNodeData>, input?: any) => Promise<any>;

class WorkflowQueue {
  private nodes: Node<AiNodeData>[];
  private edges: Edge[];
  private store = useWorkflowQueueStore;
  private nodeExecutors: Map<NodeType, NodeExecutor>;
  private executionStartTime: number = 0;

  constructor(nodes: Node<AiNodeData>[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeExecutors = new Map();

    // Register default executors
    this.registerExecutor("wait", this.executeWaitNode.bind(this));
    this.registerExecutor("preview", this.executePreviewNode.bind(this));
    this.registerExecutor("button", this.executeButtonNode.bind(this));
    this.registerExecutor("text", this.executeAPINode.bind(this));
    this.registerExecutor("api", this.executeAPINode.bind(this));
  }

  // --- Public API ---
  // Register custom executor for a node type
  // This allows users to define their own execution logic for specific node types
  // The executor function should return a Promise
  public registerExecutor(type: NodeType, executor: NodeExecutor): void {
    this.nodeExecutors.set(type, executor);
  }

  /* Start the workflow execution
   The start method initializes the workflow state and begins executing nodes
   It can optionally take a startNodeId to specify which node to start from
   If no startNodeId is provided, it will look for a trigger node to start the execution
   The start method also handles the case where the workflow is already running
   If the workflow is already running, it will log a warning and return
   If a startNodeId is provided, it will check if the node exists
   If the node does not exist, it will log an error and return
   If a trigger node is found, it will start executing from that node
   The start method also resets the workflow state before starting the execution
   It sets the isRunning state to true and clears any previous results */

  public async start(startNodeId?: string): Promise<void> {
    if (this.store.getState().workflowState.isRunning) {
      console.warn("Queue is already running");
      return;
    }

    this.executionStartTime = Date.now();
    this.store.getState().resetState();

    const startNode = startNodeId
      ? this.nodes.find((node) => node.id === startNodeId)
      : this.nodes.find((node) => node.data.isTrigger);

    if (!startNode) {
      this.store.getState().updateState({
        error: startNodeId
          ? `Node ${startNodeId} not found`
          : "No trigger node found",
      });
      return;
    }

    this.store.getState().updateState({ isRunning: true });
    await this.executeNode(startNode.id);
  }

  public async triggerButton(buttonNodeId: string): Promise<void> {
    const nextNodeIds = this.getNextNodes(buttonNodeId);
    if (nextNodeIds.length === 0) return;

    this.store.getState().updateState({
      isRunning: true,
      queue: nextNodeIds,
    });

    await this.processQueue();
  }

  // --- Pause/Resume API ---
  public pause(): void {
    if (!this.store.getState().workflowState.isRunning) {
      console.warn("Cannot pause - workflow not running");
      return;
    }
    this.store.getState().updateState({ isPaused: true });
  }

  public async resume(): Promise<void> {
    if (!this.store.getState().workflowState.isPaused) {
      console.warn("Cannot resume - workflow not paused");
      return;
    }
    this.store.getState().updateState({ isPaused: false });
    await this.processQueue(); // Continue execution
  }

  // --- Modified stop method ---
  public stop(): void {
    const executionTime = Date.now() - this.executionStartTime;
    this.store.getState().updateState({
      isRunning: false,
      isPaused: false, // Reset pause state on stop
      queue: [],
      executionTime,
    });
  }
  // --- Core Execution Logic ---
  private async processQueue(): Promise<void> {
    const { workflowState } = this.store.getState();

    // Check for pause state
    while (workflowState.isPaused) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }

    if (!workflowState.isRunning || workflowState.queue.length === 0) {
      this.stop();
      return;
    }

    const nextNodeId = workflowState.queue[0];
    await this.executeNode(nextNodeId);

    if (this.store.getState().workflowState.queue.length > 0) {
      await this.processQueue();
    }
  }

  private async executeNode(nodeId: string): Promise<void> {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) {
      this.store.getState().updateState({
        error: `Node ${nodeId} not found`,
        isRunning: false,
      });
      return;
    }

    this.store.getState().updateState({ currentNode: nodeId });

    try {
      const nodeType = node.data.config.output_type as NodeType;
      const executor = this.nodeExecutors.get(nodeType);

      if (!executor) {
        throw new Error(`No executor registered for type: ${nodeType}`);
      }

      // Execute with parallel input gathering
      const inputs = await Promise.all(this.getInputsForNode(nodeId));

      const result = await executor(node, inputs);
      this.store.getState().updateState({
        results: {
          ...this.store.getState().workflowState.results,
          [nodeId]: {
            nodeId,
            data: result,
            timestamp: Date.now(),
          },
        },
        queue: this.store.getState().workflowState.queue.slice(1), // Dequeue
      });

      // Process next nodes (if not a button)
      if (nodeType !== "button") {
        const nextNodeIds = this.getNextNodes(nodeId);
        this.store.getState().updateState({
          queue: [...this.store.getState().workflowState.queue, ...nextNodeIds],
        });
      }
    } catch (error) {
      this.store.getState().updateState({
        error: `Node ${nodeId} failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        isRunning: false,
      });
    }
  }

  // --- Helper Methods ---
  private getInputsForNode(nodeId: string): any[] {
    return this.edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => {
        const result = this.store.getState().workflowState.results[edge.source];
        return result ? result.data : null;
      });
  }

  private getNextNodes(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  // --- Node Executors (Default Implementations) ---
  private async executeWaitNode(node: Node<AiNodeData>): Promise<any> {
    const waitTime = node.data.config.parameters?.time ?? 1000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return { waited: waitTime };
  }

  private async executePreviewNode(
    node: Node<AiNodeData>,
    inputs: any[]
  ): Promise<any> {
    const data = {
      preview: inputs[0] ?? null,
      key: node.data.config.parameters?.key ?? null,
      source: node.data.config.parameters?.source ?? null,
      id: node.id,
    };
    return data ?? null;
  }

  private async executeButtonNode(node: Node<AiNodeData>): Promise<any> {
    return {
      buttonId: node.id,
      label: node.data.label,
      requiresUserInteraction: true,
    };
  }

  private async executeAPINode(
    node: Node<AiNodeData>,
    inputs: any[]
  ): Promise<any> {
    const config = node.data.config;
    try {
      const response = await fetch(
        `https://beast-ai-api-production.up.railway.app/v1/api/ai/models/${config.id}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parameters: {
              ...config.parameters,
              // Include inputs from previous nodes
              input: inputs.length > 0 ? inputs[0] : undefined,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error(`Failed to execute node ${node.id}`);
    }
  }
}

export default WorkflowQueue;
