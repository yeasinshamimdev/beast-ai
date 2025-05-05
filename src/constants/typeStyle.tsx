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
import { RxCursorArrow } from "react-icons/rx";
import { RiEyeLine, RiTimeLine } from "react-icons/ri";
import { MdOutput } from "react-icons/md";

type NodeType =
  | "text"
  | "image"
  | "voice"
  | "audio"
  | "video"
  | "system"
  | "input"
  | "output"
  | "config"
  | "button"
  | "preview"
  | "wait"
  | "output_sender";

  export const typeStyles: Record<
  NodeType,
  { boxBg: string; bg: string; text: string; border: string; icon: JSX.Element }
> = {
  text: {
    boxBg: "bg-violet-50",
    bg: "bg-violet-200",
    text: "text-violet-800",
    border: "border-violet-500",
    icon: <FaFont />,
  },
  image: {
    boxBg: "bg-green-50",
    bg: "bg-green-200",
    text: "text-green-800",
    border: "border-green-500",
    icon: <FaImage />,
  },
  voice: {
    boxBg: "bg-pink-50",
    bg: "bg-pink-200",
    text: "text-pink-800",
    border: "border-pink-500",
    icon: <FaMicrophone />,
  },
  audio: {
    boxBg: "bg-red-50",
    bg: "bg-red-200",
    text: "text-red-800",
    border: "border-red-500",
    icon: <FaMusic />,
  },
  video: {
    boxBg: "bg-blue-50",
    bg: "bg-blue-200",
    text: "text-blue-800",
    border: "border-blue-500",
    icon: <FaVideo />,
  },
  system: {
    boxBg: "bg-purple-50",
    bg: "bg-purple-200",
    text: "text-purple-800",
    border: "border-purple-500",
    icon: <FaCog />,
  },
  input: {
    boxBg: "bg-blue-50",
    bg: "bg-blue-200",
    text: "text-blue-800",
    border: "border-blue-500",
    icon: <FaMicrophone />,
  },
  output: {
    boxBg: "bg-green-50",
    bg: "bg-green-200",
    text: "text-green-800",
    border: "border-green-500",
    icon: <FaImage />,
  },
  config: {
    boxBg: "bg-sky-50",
    bg: "bg-sky-200",
    text: "text-sky-800",
    border: "border-sky-500",
    icon: <FaRobot />,
  },
  button: {
    boxBg: "bg-orange-50",
    bg: "bg-orange-200",
    text: "text-orange-800",
    border: "border-orange-500",
    icon: <RxCursorArrow />,
  },
  wait: {
    boxBg: "bg-indigo-50",
    bg: "bg-indigo-200",
    text: "text-indigo-800",
    border: "border-indigo-500",
    icon: <RiTimeLine />,
  },
  output_sender: {
    boxBg: "bg-fuchsia-50",
    bg: "bg-fuchsia-200",
    text: "text-fuchsia-800",
    border: "border-fuchsia-500",
    icon: <MdOutput />,
  },
  preview: {
    boxBg: "bg-teal-50",
    bg: "bg-teal-200",
    text: "text-teal-800",
    border: "border-teal-500",
    icon: <RiEyeLine />,
  },
};


export const NodeIcons = {
  output_sender: <MdOutput className="w-6 h-6 text-black" />,
  wait: <RiTimeLine className="w-6 h-6 text-black" />,
  button: <RxCursorArrow className="w-6 h-6 text-black" />,
  preview: <RiEyeLine className="w-6 h-6 text-black" />,
};
