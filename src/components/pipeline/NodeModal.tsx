import { modelData } from "@/constants/fakeData";
import {  Model } from "@/types/aiModels";
import React, { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: Model) => void;
}

 

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
        className={`fixed top-[77px] right-0 h-full w-2/3 md:w-[400px] dark:bg-black dark:text-white bg-white text-black border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50  `}
      >
        <div className="">
          <h3 className="text-xl font-semibold border-b border-gray-200 p-4">
            Select Models and Actions
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
            {modelData.models.map((model, idx: number) => (
              <div onClick={()=> onSelect(model as unknown as Model)} key={idx} className="flex items-center gap-4 p-2 border border-gray-200 shadow rounded-md cursor-pointer">
                <img
                  src={model.logo}
                  alt={`${model.name} logo`}
                  className="w-8 h-8 object-contain border border-gray-200 rounded-full"
                />
                <div>
                  <h4 className="text-md font-semibold">{model.name}</h4>
                  <p className="text-xs text-gray-500">{model.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeModal;
