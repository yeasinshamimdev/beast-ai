import React from "react";
import clsx from "clsx";
import { Model } from "@/types/aiModels";

const formatLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const isEditableField = (key: string) =>
  ["prompt", "text", "model"].includes(key);

interface PanelContentProps {
  model: Model;
}

const PanelContent: React.FC<PanelContentProps> = ( {model} ) => {
  const parameters = model?.parameters; // handle typo
 

  return (
    <div className="overflow-y-scroll h-[85%] mb-5 hide-scrollbar">
      <div className="bg-white dark:bg-gray-900 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={model.logo}
            alt={`${model.name} logo`}
            className="w-8 h-8 object-contain border border-gray-200 rounded-full"
          />
          <div>
            <h2 className="text-md font-bold">{model.name}</h2>
            <p className="text-xs text-gray-500">{model.provider}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mx-0.5">
          {Object.entries(parameters).map(([key, value]) => {
            const label = formatLabel(key);
            const name = `${model.name}_${key}`;

            if (Array.isArray(value)) {
              return (
                <div key={key} className="flex flex-col">
                  <label className="text-xs font-medium mb-1">{label}</label>
                  <select name={name} className="border border-gray-200 rounded px-3 py-2 capitalize">
                    {value.map((opt, idx) => (
                      <option key={idx} value={opt} className="capitalize">
                        {formatLabel(opt)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (
              typeof value === "object" &&
              value !== null &&
              ("min" in value || "max" in value)
            ) {
              return (
                <div key={key} className="flex flex-col">
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
                    Default: {value.default ?? "N/A"} | Min: {value.min} | Max: {value.max}
                  </p>
                </div>
              );
            }

            if (key === "prompt") {
                return (
                  <div key={key} className="flex flex-col ">
                    <label className="text-xs font-medium mb-1">{label}</label>
                    <textarea
                      name={name}
                      defaultValue={value as string}
                      placeholder="Enter your prompt here..."
                      className="border border-gray-200 rounded px-3 py-2 min-h-[100px] focus:outline-none"
                    />
                  </div>
                );
              }

            return (
              <div key={key} className="flex flex-col">
                <label className="text-xs font-medium mb-1">{label}</label>
                <input
                  name={name}
                  defaultValue={value as string | number}
                  disabled={!isEditableField(key)}
                  className={clsx(
                    "border border-gray-200 rounded px-3 py-2",
                    !isEditableField(key) && "bg-gray-100 text-gray-500"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PanelContent;
