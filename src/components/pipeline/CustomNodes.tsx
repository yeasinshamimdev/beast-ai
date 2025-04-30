import { Handle, Position, NodeProps } from "reactflow";
import { AiNodeData } from "@/types/workflow";
import clsx from "clsx";
import {
  FaRobot,
  FaImage,
  FaMicrophone,
  FaCog,
  FaFont,
  FaMusic,
  FaVideo,
} from "react-icons/fa";
import { JSX } from "react";

const typeStyles: Record<
  | "text"
  | "image"
  | "voice"
  | "audio"
  | "video"
  | "system"
  | "input"
  | "output"
  | "config",
  { boxBg: string; bg: string; text: string; icon: JSX.Element }
> = {
  text: {
    boxBg: "bg-violet-50",
    bg: "bg-violet-200",
    text: "text-violet-800",
    icon: <FaFont />,
  },
  image: {
    boxBg: "bg-green-50",
    bg: "bg-green-200",
    text: "text-green-800",
    icon: <FaImage />,
  },
  voice: {
    boxBg: "bg-pink-50",
    bg: "bg-pink-200",
    text: "text-pink-800",
    icon: <FaMicrophone />,
  },
  audio: {
    boxBg: "bg-red-50",
    bg: "bg-red-200",
    text: "text-red-800",
    icon: <FaMusic />,
  },
  video: {
    boxBg: "bg-blue-50",
    bg: "bg-blue-200",
    text: "text-blue-800",
    icon: <FaVideo />,
  },
  system: {
    boxBg: "bg-purple-50",
    bg: "bg-purple-200",
    text: "text-purple-800",
    icon: <FaCog />,
  },
  input: {
    boxBg: "bg-blue-50",
    bg: "bg-blue-200",
    text: "text-blue-800",
    icon: <FaMicrophone />,
  },
  output: {
    boxBg: "bg-green-50",
    bg: "bg-green-200",
    text: "text-green-800",
    icon: <FaImage />,
  },
  config: {
    boxBg: "bg-sky-50",
    bg: "bg-sky-200",
    text: "text-sky-800",
    icon: <FaRobot />,
  },
};

export const CustomAiNode = ({ data }: NodeProps<AiNodeData>) => {
  const { config } = data; 
  const category = Array.isArray(config?.output_type)
    ? config?.output_type[0]
    : config?.output_type || "system";
    const styles = typeStyles[category as keyof typeof typeStyles] || typeStyles["system"];

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
        <div className={clsx("text-xs font-bold uppercase", styles.text)}>
          {category}
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
