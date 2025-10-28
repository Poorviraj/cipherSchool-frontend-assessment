// src/components/Preview.jsx
import React, { useEffect, useRef } from "react";
import { useProject } from "../context/ProjectContext";

export default function Preview() {
  const iframeRef = useRef(null);
  const { files } = useProject();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const mainFile = files.find((f) => f.name === "src/main.jsx");
    const appFile = files.find((f) => f.name === "src/App.jsx");

    // Remove imports/exports so in-browser Babel doesn't crash
    const sanitize = (code) =>
      code
        .replace(/import\s+[^;]+;/g, "")
        .replace(/export\s+default\s+/g, "");

    const appCode = sanitize(appFile?.content || "");
    const mainCode = sanitize(mainFile?.content || "");

    // Replace createRoot(...) with ReactDOM.createRoot(...)
    const fixedMain = mainCode.replace(/createRoot\s*\(/g, "ReactDOM.createRoot(");

    const combinedCode = `
      const App = ${appCode};
      ${fixedMain};
    `;

    const html = `
      <html>
        <head>
          <style>
            html, body { margin: 0; padding: 0; background: #fff; }
            #root { height: 100vh; }
          </style>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel" data-presets="react">
            try {
              ${combinedCode}
              console.log("✅ React app running");
            } catch (err) {
              document.body.innerHTML = '<pre style="color:red;">' + err + '</pre>';
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;

    iframe.srcdoc = html;
  }, [files]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      <iframe ref={iframeRef} title="preview" sandbox="allow-scripts" className="w-full h-full" />
    </div>
  );
}
