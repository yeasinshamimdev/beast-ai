import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaLayerGroup, FaRegQuestionCircle } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

interface WorkflowMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

function Pipelines() {
  const [workflows, setWorkflows] = useState<WorkflowMeta[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("workflow_")
    );

    const loadedWorkflows: WorkflowMeta[] = keys.map((key) => {
      const workflow = JSON.parse(localStorage.getItem(key) || "{}");
      return {
        id: key.replace("workflow_", ""),
        name: workflow.title,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        isActive: workflow.isActive,
      };
    });

    setWorkflows(loadedWorkflows);
  }, []);

  const handleNavigation = () => {
    const rawUuid = uuidv4();
    const newId = rawUuid.replace(/-/g, "");
    navigate(`/pipelines/${newId}`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4 w-full bg-white dark:bg-black">
        <div>
          <h2 className="md:text-xl text-lg font-semibold dark:text-white text-black">
            Overview
          </h2>
          <p className="text-gray-500 font-normal text-xs md:text-sm">
            All the workflows, credentials and executions you have access to
          </p>
        </div>
        <button
          onClick={handleNavigation}
          className="bg-black dark:border dark:border-slate-50 text-white text-sm font-medium hover:bg-gray-800 transition-all ease-in-out duration-300 rounded-md px-3 md:px-4 py-1.5 md:py-2 cursor-pointer flex items-center gap-1"
        >
          <BiPlus className="w-5 h-5" strokeWidth={1} />{" "}
          <span className="hidden md:block">Create pipeline</span>
        </button>
      </div>
      {
        <div className="my-10 flex flex-col gap-4 w-full overflow-hidden">
          {workflows?.length > 0 ? (
            workflows.map((workflow) => (
              <PipelineCard key={workflow.id} workflow={workflow} />
            ))
          ) : (
            <div className="p-5 flex flex-col items-center justify-center gap-3 h-[300px] rounded-lg bg-gray-50">
              <FaRegQuestionCircle size={60} className="text-gray-400" />
              <p className="text-gray-500 font-normal">
                Looks like you don't have a pipeline yet
              </p>
              <button
                onClick={handleNavigation}
                className="bg-black w-fit text-white text-sm font-medium hover:bg-gray-800 transition-all ease-in-out duration-300 rounded-md px-4 py-2 cursor-pointer flex items-center gap-1"
              >
                <BiPlus className="w-5 h-5" strokeWidth={1} /> Create pipeline
              </button>
            </div>
          )}
        </div>
      }
    </div>
  );
}

export default Pipelines;

interface PipelineCardProps {
  workflow: WorkflowMeta;
}

const PipelineCard: React.FC<PipelineCardProps> = ({ workflow }) => {
  const [isActive, setIsActive] = useState<boolean>(workflow.isActive);
  const navigate = useNavigate();

  // Update localStorage when toggling active state
  const toggleActive = () => {
    const stored = localStorage.getItem(`workflow_${workflow.id}`);
    if (stored) {
      const updatedWorkflow = JSON.parse(stored);
      updatedWorkflow.isActive = !isActive;
      updatedWorkflow.updatedAt = new Date().toLocaleString();
      localStorage.setItem(
        `workflow_${workflow.id}`,
        JSON.stringify(updatedWorkflow)
      );
    }
    setIsActive(!isActive);
  };

  const handleNavigate = () => {
    navigate(`/pipelines/${workflow.id}`);
  };

  return (
    <div className="p-4 cursor-pointer flex md:flex-row flex-col items-start md:items-center justify-between w-full bg-white border border-gray-200 rounded-md shadow-sm relative">
      {/* Left Side */}
      <div className="flex justify-between w-full">
        <div onClick={handleNavigate}>
          <h3 className="text-md md:text-lg font-semibold text-gray-800">
            {workflow.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Last updated {workflow.updatedAt} | Created {workflow.createdAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="mt-6 md:mt-0">
            <span className="text-xs md:text-sm mb-1 text-gray-500 md:hidden block">
              {isActive ? "Active" : "Inactive"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer md:hidden">
              <input
                type="checkbox"
                checked={isActive}
                onChange={toggleActive}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      </div>
      <FiMoreVertical className="text-gray-500 cursor-pointer md:hidden block absolute top-3 right-3" />

      {/* Right Side */}
      <div className="flex items-center md:space-x-4 mt-2 md:mt-0">
        <div className="flex items-center space-x-1 px-2 py-1 border border-gray-200 rounded-md bg-gray-50">
          <FaLayerGroup className="text-gray-500 " />
          <span className="text-xs md:text-sm text-gray-500">
            Video content gener...
          </span>
        </div>

        <span className="text-sm text-gray-500 hidden md:block">
          {isActive ? "Active" : "Inactive"}
        </span>
        <label className="relative md:inline-flex items-center cursor-pointer hidden">
          <input
            type="checkbox"
            checked={isActive}
            onChange={toggleActive}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-5"></div>
        </label>

        <FiMoreVertical className="text-gray-500 cursor-pointer hidden md:block" />
      </div>
    </div>
  );
};
