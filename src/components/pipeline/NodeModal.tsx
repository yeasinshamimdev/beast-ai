import React, { useEffect, useRef } from "react";
import { AiModelConfig } from "@/types/aiModels";
import { FaSearch } from "react-icons/fa";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (config: AiModelConfig) => void;
}

const dummyAiModels: AiModelConfig[] = [
  { name: "OpenAI GPT-4", type: "text", params: ["prompt", "temperature"] },
  { name: "DALL·E", type: "image", params: ["prompt"] },
  { name: "ElevenLabs", type: "voice", params: ["text", "voiceType"] },
  { name: "Stable Diffusion", type: "image", params: ["prompt", "style"] },
  { name: "Whisper", type: "audio", params: ["audioFile"] },
  { name: "Claude AI", type: "text", params: ["prompt", "context"] },
  { name: "Pika Labs", type: "video", params: ["prompt", "duration"] },
];

const NodeModal: React.FC<NodeModalProps> = ({ isOpen, onClose, onSelect }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with fade transition */}
      <div
        className={`fixed inset-0 z-40 bg-transparent bg-opacity-30 transition-opacity duration-300 ease-in-out `}
      ></div>

      {/* Drawer with slide transition */}
      <div
        ref={drawerRef}
        className={`fixed top-20 right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50  `}
      >
        <div className="">
          <h3 className="text-xl font-semibold border-b border-gray-200 p-4">
            Select AI Model
          </h3>
          <div className="p-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2.5 w-full max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search nodes..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          </div>
          <div className="space-y-2 px-4">
            {dummyAiModels.map((model, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(model)}
                className="w-full text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer"
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeModal;
