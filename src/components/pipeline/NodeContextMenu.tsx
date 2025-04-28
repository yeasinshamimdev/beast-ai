import React from 'react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ x, y, onDelete, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        zIndex: 20,
      }}
      onMouseLeave={onClose}
    >
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        style={{
          padding: '8px 12px',
          display: 'block',
          width: '100%',
          border: 'none',
          background: 'none',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        🗑 Delete Node
      </button>
    </div>
  );
};

export default NodeContextMenu;
