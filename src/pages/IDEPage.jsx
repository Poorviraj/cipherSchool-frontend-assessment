import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext"; // ✅ Import token from context
import { getProjectApi } from "../api/projectApi";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import Loader from "../components/Loader";

export default function IDEPage() {
  const { id } = useParams();
  const { files, dispatch } = useProject();
  const { token } = useAuth(); // ✅ Get token from AuthContext
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) return;

    // console.log("🔑 Using token:", token); // Debug token in browser console

    (async function () {
      try {
        const data = await getProjectApi(id, token); // ✅ Pass token to API
        dispatch({
          type: "SET_PROJECT",
          payload: { projectId: data.projectId, name: data.name },
        });
        dispatch({ type: "SET_FILES", payload: data.files });
      } catch (err) {
        console.error("❌ Failed to load project:", err);
        alert("Failed to load project");
      } finally {
      setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) return <Loader text="Loading your project..." />;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex">
          <Editor />
          <Preview />
        </div>
      </div>
    </div>
  );
}
