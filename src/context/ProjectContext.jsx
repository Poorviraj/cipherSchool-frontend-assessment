import React, { createContext, useContext, useReducer } from "react";

const ProjectContext = createContext();

const initialState = {
  projectId: null,
  name: "Cipher Project",
  files: [
    {
      name: "src/App.jsx",
      content: `import React from "react";

export default function App() {
  return <div style={{ padding: 24 }}>Hello from CipherStudio!</div>;
}`
    },
    {
      name: "src/main.jsx",
      content: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);`
    }
  ],
  activeFile: "src/App.jsx"
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PROJECT":
      return { ...state, ...action.payload };
    case "SET_FILES":
      return { ...state, files: action.payload, activeFile: action.payload[0]?.name || null };
    case "SET_ACTIVE":
      return { ...state, activeFile: action.payload };
    case "UPDATE_FILE":
      return {
        ...state,
        files: state.files.map((f) => (f.name === action.payload.name ? { ...f, content: action.payload.content } : f))
      };
    case "ADD_FILE":
      return { ...state, files: [...state.files, action.payload], activeFile: action.payload.name };
    case "DELETE_FILE":
      const newFiles = state.files.filter((f) => f.name !== action.payload);
      return { ...state, files: newFiles, activeFile: newFiles[0]?.name || null };
    case "SET_PROJECT_ID":
      return { ...state, projectId: action.payload };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <ProjectContext.Provider value={{ ...state, dispatch }}>{children}</ProjectContext.Provider>;
}

export const useProject = () => useContext(ProjectContext);
