// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProjectsApi, createProjectApi } from "../api/projectApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load all user's projects
useEffect(() => {
  (async function () {
    try {
      const data = await getUserProjectsApi(token);
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  })();
}, [token]);

if (loading) return <Loader text="Fetching your projects..." />;

  // Create a new project
  const handleCreate = async () => {
    if (!newProject.trim()) {
      toast.error("Enter a project name");
      return;
    }

    try {
      const project = await createProjectApi({ name: newProject, files: [] }, token);
      toast.success("New React project created!");
      setProjects([...projects, project]);
      setNewProject("");

      // Redirect to IDE immediately
      navigate(`/project/${project.projectId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded w-64"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Create New React Project
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects yet. Create one above!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/project/${p.projectId}`)}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
