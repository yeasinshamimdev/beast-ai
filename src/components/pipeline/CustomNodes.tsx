import { Handle, Position, NodeProps } from "reactflow";
import { AiNodeData } from "@/types/workflow";
import clsx from "clsx";
import { typeStyles } from "@/constants/typeStyle";

export const CustomAiNode = ({ data }: NodeProps<AiNodeData>) => {
  const { config } = data;
  const category = Array.isArray(config?.output_type)
    ? config?.output_type[0]
    : config?.output_type || "system";
  const styles =
    typeStyles[category as keyof typeof typeStyles] || typeStyles["system"];

  const isFirstNode = data?.isTrigger;

  return (
    <div
      className={clsx(
        "rounded-md px-4 py-3 shadow-md min-w-[100px] max-w-[160px] border border-gray-300 cursor-pointer hover:shadow-lg transition",
        styles.boxBg
      )}
    >
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
