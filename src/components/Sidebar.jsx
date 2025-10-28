import React from "react";
import { useProject } from "../context/ProjectContext";
import { Plus, Trash2, File } from "lucide-react";

export default function Sidebar() {
  const { files, activeFile, dispatch } = useProject();

  const addFile = () => {
    const name = prompt("Enter new file path (e.g., src/Hello.jsx):");
    if (!name) return;
    dispatch({ type: "ADD_FILE", payload: { name, content: "// new file" } });
  };

  const deleteFile = (name) => {
    if (!confirm("Delete " + name + "?")) return;
    dispatch({ type: "DELETE_FILE", payload: name });
  };

  return (
    <div className="sidebar w-72 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Files</div>
        <button onClick={addFile} title="Add file">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {files.map((f) => (
          <div
            key={f.name}
            onClick={() => dispatch({ type: "SET_ACTIVE", payload: f.name })}
            className={`p-2 rounded flex items-center justify-between cursor-pointer ${f.name === activeFile ? "bg-slate-700" : "hover:bg-slate-700"}`}
          >
            <div className="flex items-center gap-2">
              <File size={14} />
              <span className="text-sm">{f.name}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); deleteFile(f.name); }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
