import { Node } from "reactflow";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export interface AINodeConfig {
  id: string;
  logo: string;
  name: string;
  output_type: string;
  parameters: {
    api_key: string;
    endpoint: string;
    max_tokens: number;
    model: string;
    prompt: string;
    temperature: number;
  };
  provider: string;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface AINodeProcessedData {
  id: string;
  type: string;
  position: NodePosition;
  data: {
    label: string;
    config: AINodeConfig;
    isTrigger: boolean;
  };
}

// Define a type for your node
type AINode = Node<{
  label: string;
  config: AINodeConfig;
  isTrigger: boolean;
}>;

interface INodeModelStore {
  // Using a Map for O(1) lookups instead of array operations
  nodesMap: Map<string, AINode>;

  // Computed getter to return nodes as an array when needed
  getNodes: () => AINode[];

  // CRUD operations
  getNode: (id: string) => AINode | undefined;
  addNode: (node: AINode) => void;
  updateNode: (id: string, updates: Partial<AINode>) => void;
  deleteNode: (id: string) => void;
}

type NodeStorePersist = PersistOptions<INodeModelStore, { nodes: AINode[] }>;

// Custom storage handler with proper type safety
const nodeStorage: NodeStorePersist["storage"] = {
  getItem: (name) => {
    try {
      const item = localStorage.getItem(name);
      if (!item) return { nodes: [] };

      const parsed = JSON.parse(item);
      if (!parsed || !Array.isArray(parsed.nodes)) {
        console.warn("Invalid stored state for nodes");
        return { nodes: [] };
      }

      return parsed;
    } catch (error) {
      console.error("Error retrieving stored nodes:", error);
      return { nodes: [] };
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error("Error storing nodes:", error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error("Error removing stored nodes:", error);
    }
  },
};

export const useNodeModelsStore = create<INodeModelStore>()(
  persist(
    (set, get) => ({
      // Using a Map for O(1) operations
      nodesMap: new Map<string, AINode>(),

      // Convert Map to array when needed
      getNodes: () => Array.from(get().nodesMap.values()),

      // Get a specific node by ID - O(1) operation
      getNode: (id: string) => get().nodesMap.get(id),

      // Add a node to the Map - O(1) operation
      addNode: (node: AINode) => {
        set((state) => {
          // Create a new Map to ensure reactivity
          const newMap = new Map(state.nodesMap);
          newMap.set(node.id, node);
          return { nodesMap: newMap };
        });
      },

      // Update a node in the Map - O(1) operation
      updateNode: (id: string, updates: Partial<AINode>) => {
        set((state) => {
          const existingNode = state.nodesMap.get(id);
          if (!existingNode) return state; // No change if node doesn't exist

          // Create a new Map to ensure reactivity
          const newMap = new Map(state.nodesMap);

          // Create updated node
          const updatedNode = {
            ...existingNode,
            ...updates,
            data: {
              ...existingNode.data,
              ...(updates.data || {}),
            },
          };

          newMap.set(id, updatedNode);
          return { nodesMap: newMap };
        });
      },

      // Delete a node from the Map - O(1) operation
      deleteNode: (id: string) => {
        set((state) => {
          // Create a new Map to ensure reactivity
          const newMap = new Map(state.nodesMap);
          newMap.delete(id);
          return { nodesMap: newMap };
        });
      },
    }),
    {
      name: "nodes",
      storage: nodeStorage,

      // Convert Map to array for storage and back to Map when rehydrating
      partialize: (state) => ({
        nodes: Array.from(state.nodesMap.values()),
      }),

      // Convert stored array back to Map on rehydration
      onRehydrateStorage: () => (persistedState) => {
        const safeState = persistedState as unknown as { nodes: AINode[] };

        if (!safeState || !Array.isArray(safeState.nodes)) {
          console.warn(
            "Failed to rehydrate nodes state: invalid persisted state"
          );
          return;
        }

        const nodesMap = new Map<string, AINode>();
        safeState.nodes.forEach((node) => {
          if (node && node.id) {
            nodesMap.set(node.id, node);
          }
        });

        useNodeModelsStore.setState({ nodesMap });
        console.log("Successfully rehydrated nodes state");
      },
    }
  )
);

// React component usage example:
/*
import { useNodeModelsStore } from './path-to-this-file';

function NodeManager() {
  // Use the nodes array for rendering
  const nodes = useNodeModelsStore(state => state.getNodes());
  
  // Use O(1) operations for CRUD
  const addNode = useNodeModelsStore(state => state.addNode);
  const updateNode = useNodeModelsStore(state => state.updateNode);
  const deleteNode = useNodeModelsStore(state => state.deleteNode);
  const getNode = useNodeModelsStore(state => state.getNode);
  
  // Example of efficient lookup
  const handleUpdateNode = (id) => {
    const node = getNode(id);
    if (node) {
      updateNode(id, { 
        data: {
          ...node.data,
          label: "Updated Label"
        }
      });
    }
  };
  
  return (
    <div>
      {nodes.map(node => (
        <div key={node.id}>
          {node.data.label}
          <button onClick={() => handleUpdateNode(node.id)}>Update</button>
          <button onClick={() => deleteNode(node.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
*/
