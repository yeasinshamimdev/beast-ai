import { useEffect, useRef } from "react";
import { Node } from "reactflow"; // Ensure this import matches your library or type definition
import clsx from "clsx";
import { AiNodeData } from "@/types/workflow";

interface PanelProps {
  isOpen: boolean;
  setNodes: React.Dispatch<React.SetStateAction<Array<Node<AiNodeData>>>>;
  onClose: () => void;
  selectedNodeId: string;
}

const Panel: React.FC<PanelProps> = ({
  isOpen,
  selectedNodeId,
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
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
    onClose();
  };

  return (
    <>
      {/* 🔹 Overlay */}
      {isOpen && (
        <div className="fixed inset-20 z-40  mx-auto bg-transparent bg-opacity-30 transition-opacity h-full w-[calc(100vw-420px)]" />
      )}

      {/* 🔹 Panel */}
      <div
        ref={panelRef}
        className={clsx(
          "fixed top-20 h-[calc(100vh-80px)] w-[300px] bg-white shadow-lg p-4 z-50 transition-all duration-300 ease-in-out",
          {
            "right-0": isOpen,
            "-right-[320px]": !isOpen,
          }
        )}
      >
        <h2 className="text-lg font-bold mb-4">Node Settings</h2>

        <div className="">
  <p className="text-sm font-medium mb-2">Prompt</p>
  <textarea
    placeholder="Enter your prompt here..."
    className="w-full h-44 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
  />
</div>


        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mt-20 cursor-pointer"
        >
          Delete Node
        </button>
      </div>
    </>
  );
};

export default Panel;
