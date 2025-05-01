import { ActionNode } from "@/types/workflow";

export const actionNodes: ActionNode[] = [
  {
    output_type: "output_sender",
    name: "Output",
    label: "Send output to another node",
    parameters: {
      destination: "", // Optional: dynamically chosen target node
    },
  },
  {
    output_type: "wait",
    name: "Wait Time",
    label: "Delay next execution",
    parameters: {
      time: {
        type: "number",
        label: "Wait Time (ms)",
        default: 500,
        min: 0,
        max: 60000,
      },
    },
  },
  {
    output_type: "button",
    name: "Action Button",
    label: "User-triggered action",
    parameters: {
      label: "",
      purpose: ["Generate", "Submit", "Download"],
    },
  },
  {
    output_type: "preview",
    name: "Preview Output",
    label: "Display output result",
    parameters: {
      source: {
        type: "nodeRef",
        label: "From Node ID",
        required: true,
      },
      key: {
        type: "text",
        label: "Output Key",
        placeholder: "e.g., image_url, transcript",
      },
    },
  },
];
