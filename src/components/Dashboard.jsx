import React, { useEffect, useState } from "react";
import { createProjectApi, getProjectApi } from "../api/projectApi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await createProjectApi("CipherProject");
      navigate(`/project/${res.projectId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl shadow-xl w-[720px] text-center">
        <h1 className="text-3xl font-bold mb-4">CipherStudio</h1>
        <p className="mb-6 text-slate-300">
          Create a browser React project and start editing instantly.
        </p>
        <button
          onClick={handleCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3 rounded-md font-semibold"
        >
          {creating ? "Creating..." : "Create New React Project"}
        </button>
      </div>
    </div>
  );
}
