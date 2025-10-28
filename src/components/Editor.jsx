import React from "react";
import Editor from "@monaco-editor/react";
import { useProject } from "../context/ProjectContext";

export default function CodeEditor() {
  const { files, activeFile, dispatch } = useProject();
  const file = files.find((f) => f.name === activeFile) ?? { name: "", content: "" };

  return (
    <div className="editor-panel flex-1">
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.03)", background: "#061025" }}>
          <div className="text-sm font-medium">{file.name}</div>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language="javascript"
            theme="vs-dark"
            value={file.content}
            onChange={(value) => dispatch({ type: "UPDATE_FILE", payload: { name: file.name, content: value || "" } })}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: "on"
            }}
          />
        </div>
      </div>
    </div>
  );
}
