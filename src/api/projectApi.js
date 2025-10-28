// src/api/projectApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

// Create new project
export const createProjectApi = async (payload, token) => {
  const { data } = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Get all projects for logged-in user
export const getUserProjectsApi = async (token) => {
  const { data } = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Get single project by projectId
export const getProjectApi = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Update project files
export const updateProjectApi = async (id, files, token) => {
  const { data } = await axios.put(
    `${API_URL}/${id}`,
    { files },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// Delete a project
export const deleteProjectApi = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
