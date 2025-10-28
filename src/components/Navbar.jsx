import React, { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { updateProjectApi } from "../api/projectApi";
import { useAuth } from "../context/AuthContext";
import { Save, ArrowBigLeftDash } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const { projectId, files, name } = useProject();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Project not created via backend. Create from Dashboard first.");
      return;
    }

    if (!files || files.length === 0) {
      toast.error("⚠️ No files to save!");
      return;
    }

    try {
      setSaving(true);
      await updateProjectApi(projectId, files, token);
      toast.success("💾 Project saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="navbar flex items-center justify-between px-4 py-3 bg-gray-900 text-white border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold tracking-wide">⚡ CipherStudio</div>
        <p className="text-gray-400 text-sm">/ {name}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {saving ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save size={16} />
          )}
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition"
        >
          <ArrowBigLeftDash size={16} />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
