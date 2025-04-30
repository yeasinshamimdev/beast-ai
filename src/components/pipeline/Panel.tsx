import { AiNodeData } from "@/types/workflow";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Node } from "reactflow"; // Ensure this import matches your library or type definition
import PanelContent from "./PanelContent";
import { Model } from "@/types/aiModels";

interface PanelProps {
  isOpen: boolean;
  setNodes: React.Dispatch<React.SetStateAction<Array<Node<AiNodeData>>>>;
  onClose: () => void;
  selectedNode: Node<AiNodeData> | null;
}

const Panel: React.FC<PanelProps> = ({
  isOpen,
  selectedNode,
  setNodes,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  // Handle delete node
  const handleDelete = () => {
    if (!selectedNode) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNode?.id));
    onClose();
  };
  
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
          "fixed top-[76px] h-[calc(100vh-80px)] w-[300px] md:w-[400px] bg-white shadow-lg p-4 z-50 transition-all duration-300 ease-in-out",
          {
            "right-0": isOpen,
            "-right-[420px]": !isOpen,
          }
        )}
      >
        <h2 className="text-lg font-bold mb-4">Node Settings</h2>

       {selectedNode && <PanelContent model={selectedNode?.data?.config as Model}/>}

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full cursor-pointer"
        >
          Delete Node
        </button>
      </div>
    </>
  );
};

export default Panel;
