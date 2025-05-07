import { AiNodeData } from "@/types/workflow";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Node } from "reactflow"; // Ensure this import matches your library or type definition
import PanelContent from "./PanelContent";
import { Model } from "@/types/aiModels";
import Save from "@/assets/icons/Save";
import { BiTrash } from "react-icons/bi";

interface PanelProps {
  isOpen: boolean;
  handleDelete: (nodeId: string) => void;
  onClose: () => void;
  selectedNode: Node<AiNodeData> | null;
}

const Panel: React.FC<PanelProps> = ({
  isOpen,
  selectedNode,
  handleDelete,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // useEffect for closing the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (panelRef.current && !panelRef.current.contains(target)) {
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

  return (
    <>
      {/* 🔹 Overlay */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-20 z-40  mx-auto bg-transparent bg-opacity-30 transition-opacity h-full w-full md:w-[calc(100vw-420px)]" />
      )}

      {/* 🔹 Panel */}
      <div
        ref={panelRef}
        className={clsx(
          "fixed top-0 h-[calc(100vh)] w-[300px] md:w-[400px] bg-white border-t border-l border-gray-200 shadow-lg px-4 pt-4 z-50 transition-all duration-300 ease-in-out",
          {
            "right-0": isOpen,
            "-right-[420px]": !isOpen,
          }
        )}
      >
        <h2 className="text-lg font-bold mb-4">Node Settings</h2>

        {selectedNode && (
          <PanelContent
            model={selectedNode?.data?.config as Model}
            type={selectedNode?.type as string}
          />
        )}

        <div className="flex items-center gap-2">
          <button className="bg-black flex items-center justify-center gap-2 text-white px-4 py-2 rounded hover:bg-gray-800 transition w-full cursor-pointer">
            <Save size={20} />{" "}
            <span className="font-medium">Save settings</span>
          </button>
          <button
            onClick={() => handleDelete(selectedNode?.id as string)}
            className="bg-red-500 flex items-center justify-center gap-2 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full cursor-pointer"
          >
            <BiTrash size={20} />{" "}
            <span className="font-medium">Delete Node</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Panel;
