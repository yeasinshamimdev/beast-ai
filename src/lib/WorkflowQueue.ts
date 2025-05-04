import { AiNodeData } from '@/types/workflow';
import { Node, Edge } from 'reactflow'; 

type QueueResult = {
  nodeId: string;
  data: any;
  timestamp: number;
};

type QueueState = {
  isRunning: boolean;
  results: Record<string, QueueResult>;
  currentNode: string | null;
  queue: string[];
  error: string | null;
};

class WorkflowQueue {
  private nodes: Node<AiNodeData>[];
  private edges: Edge[];
  private state: QueueState;
  private nodeExecutors: Record<string, (node: Node<AiNodeData>, input?: any) => Promise<any>>;
  private onStateChange?: (state: QueueState) => void;

  constructor(nodes: Node<AiNodeData>[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.state = {
      isRunning: false,
      results: {},
      currentNode: null,
      queue: [],
      error: null
    };

    // Register executors for different node types
    this.nodeExecutors = {
      'wait': this.executeWaitNode.bind(this),
      'preview': this.executePreviewNode.bind(this),
      'button': this.executeButtonNode.bind(this),
      'text': this.executeAPINode.bind(this),
      // Add other node type executors as needed
    };
  }

  // Set a callback function to be called when state changes
  public setStateChangeCallback(callback: (state: QueueState) => void) {
    this.onStateChange = callback;
  }

  // Get current state
  public getState(): QueueState {
    return { ...this.state };
  }

  // Start the queue execution from a trigger node or specified node
  public async start(startNodeId?: string): Promise<void> {
    if (this.state.isRunning) {
      console.warn('Queue is already running');
      return;
    }

    // Reset state
    this.state = {
      isRunning: true,
      results: {},
      currentNode: null,
      queue: [],
      error: null
    };
    this.updateState();

    // Find starting node
    let startNode: Node<AiNodeData> | undefined;
    
    if (startNodeId) {
      startNode = this.nodes.find(node => node.id === startNodeId);
    } else {
      // Find trigger node
      startNode = this.nodes.find(node => node.data.isTrigger);
    }

    if (!startNode) {
      this.state.error = 'No trigger node found';
      this.state.isRunning = false;
      this.updateState();
      return;
    }

    // Start execution from the identified node
    await this.executeNode(startNode.id);
  }

  // Trigger execution from a button node
  public async triggerButton(buttonNodeId: string): Promise<void> {
    const buttonNode = this.nodes.find(node => node.id === buttonNodeId);
    
    if (!buttonNode || buttonNode.data.config.output_type !== 'button') {
      console.error('Invalid button node');
      return;
    }

    // Find the next nodes after this button
    const nextNodeIds = this.getNextNodes(buttonNodeId);
    
    if (nextNodeIds.length === 0) {
      console.warn('No next nodes found after button');
      return;
    }
    
    // Add next nodes to queue and start execution
    this.state.isRunning = true;
    this.state.queue = nextNodeIds;
    this.updateState();
    
    await this.processQueue();
  }

  // Stop the queue
  public stop(): void {
    this.state.isRunning = false;
    this.state.queue = [];
    this.updateState();
  }

  // Process the next item in the queue
  private async processQueue(): Promise<void> {
    if (!this.state.isRunning || this.state.queue.length === 0) {
      this.state.isRunning = false;
      this.updateState();
      return;
    }

    const nextNodeId = this.state.queue.shift()!;
    await this.executeNode(nextNodeId);
  }

  // Execute a specific node
  private async executeNode(nodeId: string): Promise<void> {
    const node = this.nodes.find(n => n.id === nodeId);
    
    if (!node) {
      console.error(`Node ${nodeId} not found`);
      this.state.error = `Node ${nodeId} not found`;
      this.state.isRunning = false;
      this.updateState();
      return;
    }

    this.state.currentNode = nodeId;
    this.updateState();

    try {
      // Get input from previous nodes if needed
      const inputs = this.getPreviousNodeResults(nodeId);
      
      // Find the correct executor for this node type
      const nodeType = node.data.config.output_type;
      const executor = this.nodeExecutors[nodeType as any];
      
      if (!executor) {
        throw new Error(`No executor found for node type: ${nodeType}`);
      }

      // Execute the node
      const result = await executor(node, inputs);
      
      // Store the result
      this.state.results[nodeId] = {
        nodeId,
        data: result,
        timestamp: Date.now()
      };

      // If this is a button node, wait for user interaction
      if (nodeType === 'button') {
        // Button nodes pause execution until triggered
        this.state.isRunning = false;
        this.updateState();
        return;
      }

      // Find the next nodes to execute
      const nextNodeIds = this.getNextNodes(nodeId);
      this.state.queue.push(...nextNodeIds);
      
      // Continue processing the queue
      await this.processQueue();
    } catch (error) {
      console.error(`Error executing node ${nodeId}:`, error);
      this.state.error = `Error executing node ${nodeId}: ${error instanceof Error ? error.message : String(error)}`;
      this.state.isRunning = false;
      this.updateState();
    }
  }

  // Get results from nodes that feed into this node
  private getPreviousNodeResults(nodeId: string): any {
    const inputEdges = this.edges.filter(edge => edge.target === nodeId);
    
    if (inputEdges.length === 0) {
      return null;
    }

    // Return results from all input nodes
    return inputEdges.map(edge => {
      const sourceId = edge.source;
      return this.state.results[sourceId]?.data;
    }).filter(result => result !== undefined);
  }

  // Find nodes that come after the current node
  private getNextNodes(nodeId: string): string[] {
    const outgoingEdges = this.edges.filter(edge => edge.source === nodeId);
    return outgoingEdges.map(edge => edge.target);
  }

  // Update the state and notify listeners
  private updateState(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  // Executor for wait nodes
  private async executeWaitNode(node: Node<AiNodeData>): Promise<any> {
    const waitTime = node.data.config.parameters?.time?.default || 500;
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ waited: waitTime });
      }, waitTime);
    });
  }

  // Executor for preview nodes
  private async executePreviewNode(node: Node<AiNodeData>, inputs: any[]): Promise<any> {
    // Extract source node and key from parameters
    const sourceNodeId = node.data.config.parameters?.source?.value;
    const outputKey = node.data.config.parameters?.key?.value;
    
    // If no specific source is provided, use the first input
    let previewData: any;
    
    if (sourceNodeId && this.state.results[sourceNodeId]) {
      previewData = this.state.results[sourceNodeId].data;
    } else if (inputs && inputs.length > 0) {
      previewData = inputs[0];
    } else {
      previewData = null;
    }
    
    // Extract specific key if provided
    if (previewData && outputKey && typeof previewData === 'object') {
      previewData = previewData[outputKey] ?? null;
    }
    
    return { preview: previewData };
  }

  // Executor for button nodes
  private async executeButtonNode(node: Node<AiNodeData>): Promise<any> {
    // Button nodes are special as they wait for user interaction
    // Just return the button configuration
    return {
      buttonId: node.id,
      label: node.data.config.parameters?.label || node.data.label,
      purpose: node.data.config.parameters?.purpose || "Generate"
    };
  }

  // Executor for API nodes (like GPT)
  private async executeAPINode(node: Node<AiNodeData>): Promise<any> {
    const config = node.data.config;
    
    // Check if this is a node with API endpoint
    if (!config.parameters?.endpoint) {
      return { message: "No API endpoint specified" };
    }
    
    try {
      // Prepare API request
      const apiKey = config.parameters.api_key || "";
      const endpoint = config.parameters.endpoint;
      const model = Array.isArray(config.parameters.model) 
        ? config.parameters.model[0] 
        : config.parameters.model;
      
      // Construct request body based on node type
      let requestBody: any = {};
      
      // Handle different API providers
      if ('provider' in config && config.provider === "OpenAI") {
        requestBody = {
          model: model || "gpt-3.5-turbo",
          messages: [
            { 
              role: "user", 
              content: config.parameters.prompt || "Hello, how can I assist you today?" 
            }
          ],
        //   max_tokens: config.parameters.max_tokens?.default || 1000,
        //   temperature: config.parameters.temperature?.default || 0.7
        };
      }
      // Add other providers as needed
      
      // Make API call
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API call error:", error);
      throw new Error(`API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default WorkflowQueue;