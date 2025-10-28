import React from "react";
import { useProject } from "../context/ProjectContext";
import { updateProjectApi } from "../api/projectApi";
import { useAuth } from "../context/AuthContext";
import { Save } from "lucide-react";
import { ArrowBigLeftDash  } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { projectId, files, name } = useProject();
  const { token } = useAuth();

  const handleSave = async () => {
    if (!projectId) {
      alert("Project not created via backend. Create from Dashboard first.");
      return;
    }

    try {
      if (!files || files.length === 0) {
        alert("⚠️ No files to save!");
        return;
      }
      await updateProjectApi(projectId, files, token);


      alert("Saved successfully");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="navbar flex items-center justify-between px-4 py-3 bg-gray-900 text-white border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold tracking-wide">⚡ CipherStudio</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        <Link to='/dashboard' className=" flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition " >
          <ArrowBigLeftDash size={16} />
          Dasboard
        </Link>
      </div>
    </div>
  );
}
