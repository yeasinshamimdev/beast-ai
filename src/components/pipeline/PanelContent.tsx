// import React from "react";
import clsx from "clsx";
import { Model } from "@/types/aiModels";
import { ActionNode } from "@/types/workflow";
import { NodeIcons } from "@/constants/typeStyle";
import { useModelStore } from "@/store/useModelStore";
import { useFetchSingleModel } from "@/hooks/api/useFetchModels";
import { Spinner } from "../common/Spinner";

const formatLabel = (key: unknown): string => {
  if (typeof key !== "string") return String(key);
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const isEditableField = (key: string) =>
  ["prompt", "text", "model", "api_key", "label"].includes(key);

interface PanelContentProps {
  model: Model | ActionNode;
  type: string;
}

const PanelContent: React.FC<PanelContentProps> = ({ model, type }) => {

  // Check if the model is an action node or AI node
  const isAINode = type === "aiNode";

  // Fetch the model details
  const { isError, error, isPending, isFetching } = useFetchSingleModel({
    modelId: model?.id as string,
    isAINode,
  });

  // Get the model data from the store
  // This will be undefined if the model is not found
  const { singleModel } = useModelStore();

  // If the model is not found, use the model passed as a prop
  const parameters = singleModel?.parameters || {};

  // Error state
  if (isError || error) {
    return <p>{error?.message || "Failed to load the model"}</p>;
  }


  // Loading state
  if (isPending || isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="md" />
      </div>
    );
  }

  // Render the model parameters
  const renderParameterInput = (key: string, value: any) => {
    const safeKey = typeof key === "string" ? key : String(key);
    const label = formatLabel(safeKey);
    const name = `${model.name}_${safeKey}`;

    // Handle array parameters
    if (Array.isArray(value)) {
      // Special case for voice_ids array of objects
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null
      ) {
        return (
          <div key={safeKey} className="flex flex-col">
            <label className="text-xs font-medium mb-1">{label}</label>
            <select
              name={name}
              className="border border-gray-200 rounded px-3 py-2 capitalize"
            >
              {value.map((option, idx) => (
                <option key={idx} value={option.voice_id || option.name}>
                  {option.name} - {option.description}
                </option>
              ))}
            </select>
          </div>
        );
      }

      // Regular array of strings/numbers
      return (
        <div key={safeKey} className="flex flex-col">
          <label className="text-xs font-medium mb-1">{label}</label>
          <select
            name={name}
            className="border border-gray-200 rounded px-3 py-2 capitalize"
          >
            {value.map((opt, idx) => (
              <option key={idx} value={opt} className="capitalize">
                {formatLabel(opt)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Handle numeric range parameters
    if (
      typeof value === "object" &&
      value !== null &&
      ("min" in value || "max" in value)
    ) {
      return (
        <div key={safeKey} className="flex flex-col">
          <label className="text-xs font-medium mb-1">{label}</label>
          <input
            name={name}
            type="number"
            defaultValue={value.default ?? value.min}
            min={value.min}
            max={value.max}
            className="border border-gray-200 rounded px-3 py-2 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Default: {value.default ?? "N/A"} | Min: {value.min} | Max:{" "}
            {value.max}
          </p>
        </div>
      );
    }

    // Special handling for prompt fields
    if (safeKey === "prompt") {
      return (
        <div key={safeKey} className="flex flex-col">
          <label className="text-xs font-medium mb-1">{label}</label>
          <textarea
            name={name}
            defaultValue={String(value)}
            placeholder="Enter your prompt here..."
            className="border border-gray-200 rounded px-3 py-2 min-h-[100px] focus:outline-none"
          />
        </div>
      );
    }

    // Default case for other parameters
    return (
      <div key={safeKey} className="flex flex-col">
        <label className="text-xs font-medium mb-1">{label}</label>
        <input
          name={name}
          defaultValue={String(value)}
          disabled={!isEditableField(safeKey)}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className={clsx(
            "border border-gray-200 rounded px-3 py-2 focus:outline-none",
            !isEditableField(safeKey) && "bg-gray-100 text-gray-500"
          )}
        />
      </div>
    );
  };

  return (
    <div className="overflow-y-scroll h-[85%] mb-5 hide-scrollbar">
      <div className="bg-white dark:bg-gray-900 space-y-4">
        <div className="flex items-center gap-2.5">
          {["button", "preview", "wait", "output_sender"].includes(
            typeof model?.output_type === "string" ? model.output_type : ""
          ) ? (
            <div className="border border-gray-200 rounded-full p-2 bg-gray-100">
              {" "}
              {NodeIcons[model?.output_type as keyof typeof NodeIcons] || null}
            </div>
          ) : (
            <img
              src={"logo" in model ? model.logo : "/default-model-icon.png"}
              alt={`${model.name} logo`}
              className="w-8 h-8 object-contain border border-gray-200 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-model-icon.png";
              }}
            />
          )}
          <div>
            <h2 className="text-lg font-bold">{model.name}</h2>
            {"provider" in model && (
              <p className="text-xs text-gray-500">{model.provider}</p>
            )}
            {"level" in model && (
              <p className="text-xs text-gray-500">{String(model.level)}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mx-0.5">
          {type === "actionNode" ? (
            <div>
              This is an action node. Please select a model from the list.
            </div>
          ) : (
            Object.entries(parameters).map(([key, value]) =>
              renderParameterInput(key, value)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelContent;
