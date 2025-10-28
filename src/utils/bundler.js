// bundler.js
// Build an iframe HTML which loads React 18 UMD + Babel standalone
// and then compiles modules in-memory and executes the entry.

export function createPreviewSrcDoc(files = [], entry = "src/main.jsx") {
  // map by name
  const fileMap = {};
  files.forEach((f) => (fileMap[f.name] = f.content));

  // helper: get content or empty
  const get = (p) => fileMap[p] ?? "";

  // Build a JS source that will:
  // 1. load Babel, React UMD scripts (script tags in HTML)
  // 2. transform each module to CommonJS using Babel plugin transform-modules-commonjs
  // 3. create an internal require/resolver to load modules from the in-memory map
  // 4. run the entry module
  // We do all transforms inside the iframe using Babel standalone.

  // Prepare an object literal as JS source with raw module source strings
  const modulesObjectString = JSON.stringify(fileMap);

  const html = `
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>html,body{height:100%;margin:0;background:#020617;color:#fff}#root{height:100%}</style>
  </head>
  <body>
    <div id="root"></div>
    <div id="err" style="white-space:pre-wrap;color:#f87171;padding:12px;"></div>

    <!-- React 18 UMD -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Babel standalone -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script>
      (function(){
        const modules = ${modulesObjectString};

        // transform and evaluate modules
        const cache = {};

        function resolvePath(base, rel) {
          if (rel.startsWith("/")) return rel;
          // simple resolution: base like src/main.jsx, rel './App.jsx' -> src/App.jsx
          const baseParts = base.split("/").slice(0, -1);
          const relParts = rel.split("/");
          for (const part of relParts) {
            if (part === ".") continue;
            if (part === "..") baseParts.pop();
            else baseParts.push(part);
          }
          return baseParts.join("/");
        }

        function requireModule(modulePath) {
          if (cache[modulePath]) return cache[modulePath].exports;
          if (!modules[modulePath]) {
            throw new Error("Module not found: " + modulePath);
          }

          // transform module source from ESModules + JSX -> CommonJS using babel
          try {
            const transformed = Babel.transform(modules[modulePath], {
              presets: ['react'],
              plugins: ['transform-modules-commonjs']
            }).code;

            const moduleFunc = new Function('exports', 'require', 'module', '__filename', transformed);

            const module = { exports: {} };
            cache[modulePath] = module;
            // custom require which resolves relative paths
            const localRequire = function(relPath) {
              const resolved = resolvePath(modulePath, relPath);
              return requireModule(resolved);
            };

            moduleFunc(module.exports, localRequire, module, modulePath);

            return module.exports;
          } catch (err) {
            const errEl = document.getElementById('err');
            errEl.textContent = err.toString() + "\\n\\n" + (err.stack || "");
            throw err;
          }
        }

        try {
          // execute entry
          requireModule('${entry}');
        } catch (e) {
          console.error(e);
        }
      })();
    </script>
  </body>
  </html>
  `;

  return html;
}
