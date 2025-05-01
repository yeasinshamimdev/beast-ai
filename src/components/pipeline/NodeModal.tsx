import { actionNodes } from "@/constants/actionNodes";
import { NodeIcons } from "@/constants/typeStyle";
import { useFetchModels } from "@/hooks/api/useFetchModels";
import { useModelStore } from "@/store/useModelStore";
import { Model } from "@/types/aiModels";
import { ActionNode } from "@/types/workflow";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { FaRegQuestionCircle, FaSearch, FaRedo } from "react-icons/fa";


interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: Model | ActionNode) => void;
}

const TABS = ["API", "Action"];


const NodeModal: React.FC<NodeModalProps> = ({ isOpen, onClose, onSelect }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("API");

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

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with fade transition */}
      <div className="fixed inset-0 z-40 bg-transparent bg-opacity-30 transition-opacity duration-300 ease-in-out"></div>

      {/* Drawer with slide transition */}
      <div
        ref={drawerRef}
        className="fixed top-[77px] right-0 h-full w-2/3 md:w-[400px] dark:bg-black dark:text-white bg-white text-black border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-semibold border-b border-gray-200 p-4">
            Select Models and Actions
          </h3>
          <div className="p-4">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2.5 w-full max-w-md">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search models..."
                className="w-full outline-none bg-transparent dark:text-white text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "flex-1 text-center py-2 font-medium text-sm cursor-pointer hover:bg-gray-100 transition-all ease-in-out duration-300  dark:hover:bg-gray-800",
                  activeTab === tab
                    ? "border-b-2 border-black text-black font-semibold dark:text-white dark:border-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "API" && (
              <ModelsComponent
                onSelect={onSelect}
                searchTerm={searchTerm}
                isModalOpen={isOpen}
              />
            )}
            {/* Replace with actual prop */}
            {activeTab === "Action" && <ActionComponent onSelect={onSelect} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeModal;

interface ModelsComponentProps {
  onSelect: (model: Model) => void;
  searchTerm: string;
  isModalOpen: boolean;
}

const ModelsComponent: React.FC<ModelsComponentProps> = ({
  onSelect,
  searchTerm,
  isModalOpen,
}) => {
  const { models } = useModelStore();
  const { isPending, isError, error, isFetching, refetch } = useFetchModels({
    isModalOpen,
  });

  // Filter models based on search term
  const filteredModels = models?.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.provider &&
        model.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLoading = isPending || isFetching;
  const isErrorState = isError || error;

  if (isErrorState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <FaRegQuestionCircle size={60} className="text-gray-400 mb-4" />
        <p className="text-gray-500 font-normal mb-4">
          {error?.message
            ? error.message
            : "Looks like we couldn't fetch the models"}
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          <FaRedo className="text-sm" />
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-3 items-center p-4">
        {Array(8)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="w-full h-12 rounded-lg shadow border border-gray-200 animate-pulse bg-gray-200 dark:bg-gray-700"
            ></div>
          ))}
      </div>
    );
  }

  if (!filteredModels || filteredModels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No models found matching "${searchTerm}"`
            : "No models available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 px-4 pb-4 overflow-y-auto">
      {filteredModels.map((model, idx: number) => (
        <div
          onClick={() => onSelect(model)}
          key={idx}
          className="flex items-center gap-4 p-3 border border-gray-200 shadow rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {model.logo ? (
            <img
              src={model.logo}
              alt={`${model.name} logo`}
              className="w-10 h-10 object-contain border border-gray-200 rounded-full"
              onError={(e) => {
                // Fallback to first letter of model name if image fails to load
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextSibling as HTMLElement)!.style.display =
                  "flex";
              }}
            />
          ) : null}
          <div
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg font-semibold"
            style={{ display: model.logo ? "none" : "flex" }}
          >
            {model.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-md font-semibold truncate">{model.name}</h4>
            {model.provider && (
              <p className="text-xs text-gray-500 truncate">{model.provider}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ActionComponentProps {
  onSelect: (model: ActionNode) => void;
}

const ActionComponent: React.FC<ActionComponentProps> = ({ onSelect }) => {
  return (
    <div className="space-y-2.5 px-4">
      {actionNodes?.map((model, idx: number) => (
        <div
          key={idx}
          onClick={() => onSelect(model)}
          className="flex items-center gap-3 p-3 border border-gray-200 shadow rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors max-h-16 min-h-full"
        >
          {NodeIcons[model?.output_type as keyof typeof NodeIcons] || null}
          <div>
            <h3 className="text-sm font-medium block">{model?.name}</h3>
            <p className="text-xs text-gray-500">{model?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
