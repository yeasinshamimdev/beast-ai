import { Handle, Position, NodeProps } from "reactflow";
import { AiNodeData } from "@/types/workflow";
import clsx from "clsx";
import { typeStyles } from "@/constants/typeStyle";
import { useWorkflowQueueStore } from "@/store/useWorkflowQueueStore";
import { Spinner } from "../common/Spinner";

export const CustomAiNode = ({ data, id }: NodeProps<AiNodeData>) => {
  const { config } = data;
  const category = Array.isArray(config?.output_type)
    ? config?.output_type[0]
    : config?.output_type || "system";
  const styles =
    typeStyles[category as keyof typeof typeStyles] || typeStyles["system"];

  const isFirstNode = data?.isTrigger;

  const { workflowState } = useWorkflowQueueStore();
  const isExecuting =
    id === workflowState.currentNode && workflowState.isRunning;

  return (
    <div
      className={clsx(
        "rounded-md px-4 py-3 shadow-md min-w-[100px] max-w-[160px] border-2 relative z-10",
        isExecuting ? styles?.border : "border-gray-200",
        styles.boxBg
      )}
    >
      {/* Execution indicator */}
      {isExecuting && (
        <div className="absolute flex items-center justify-center top-0 left-0 bg-white z-30 opacity-50 w-full h-full">
          {workflowState?.isPaused ? (
            <span className="text-yellow-500">⏸</span>
          ) : (
            <Spinner size="md" />
          )}
        </div>
      )}

      {/* Only show input handle if not trigger */}
      {!isFirstNode && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-600"
        />
      )}

      {/* Content */}
      <div className="flex items-center gap-2 mb-1">
        <div className={clsx("p-1 rounded-full", styles.bg)}>
          <div className={clsx("text-md", styles.text)}>{styles.icon}</div>
        </div>
        <div
          className={clsx(
            "text-xs font-bold uppercase whitespace-nowrap",
            styles.text
          )}
        >
          {category?.replace(/_/g, " ")}
        </div>
      </div>

      <div className="text-sm font-semibold text-gray-800">
        {data.label || "Unnamed Node"}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-600"
      />
    </div>
  );
};
