import { AiNodeData } from '@/types/workflow';
import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow'; 

export const CustomAiNode: React.FC<NodeProps<AiNodeData>> = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '2px solid #4A90E2', borderRadius: 8, background: '#f0f0f0' }}>
      <Handle type="target" position={Position.Right} />
      <strong>{data.label}</strong>
      <ul>
        {data.config.params.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
      <Handle type="source"  position={Position.Left} />
    </div>
  );
};
