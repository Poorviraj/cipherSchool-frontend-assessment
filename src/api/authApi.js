import axios from "axios";

const API_URL = "https://cipherschool-assessment-backend.onrender.com/api/auth";


export const registerApi = async (userData) => {
  const { data } = await axios.post(`${API_URL}/register`, userData);
  return data;
};

export const loginApi = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/login`, credentials);
  return data;
};
