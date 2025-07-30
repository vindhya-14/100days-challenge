
import React, { useState } from "react";

const FileNode = ({ node, onUpload }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(node, file.name);
    }
  };

  if (node.type === "folder") {
    return (
      <div className="node">
        <div className="folder" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "📂" : "📁"} {node.name}
        </div>

        {isExpanded && (
          <div className="children">
            <input
              type="file"
              onChange={handleUpload}
              style={{ marginBottom: "8px" }}
            />
            {node.children &&
              node.children.map((child, index) => (
                <FileNode key={index} node={child} onUpload={onUpload} />
              ))}
          </div>
        )}
      </div>
    );
  }

  return <div className="file">📄 {node.name}</div>;
};

const FileExplorer = ({ data, setData }) => {
  const handleUpload = (folder, fileName) => {
    const addFileToFolder = (nodes) =>
      nodes.map((node) => {
        if (node === folder) {
          return {
            ...node,
            children: [...(node.children || []), { type: "file", name: fileName }],
          };
        } else if (node.type === "folder") {
          return {
            ...node,
            children: addFileToFolder(node.children || []),
          };
        }
        return node;
      });

    const newData = addFileToFolder(data);
    setData(newData);
  };

  return (
    <div className="file-explorer">
      {data.map((item, index) => (
        <FileNode key={index} node={item} onUpload={handleUpload} />
      ))}
    </div>
  );
};

export default FileExplorer;
