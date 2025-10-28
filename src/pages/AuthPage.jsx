import React, { useState } from "react";
import { loginApi, registerApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (isLogin) {
        data = await loginApi({ email: form.email, password: form.password });
      } else {
        data = await registerApi(form);
      }
      login({ name: data.name, email: data.email }, data.token);
      toast.success(`${isLogin ? "Login" : "Signup"} successful`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-xl p-8 shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login to CipherStudio" : "Create your account"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-gray-700 p-2 rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-gray-700 p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-gray-700 p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 py-2 rounded hover:bg-blue-500">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 text-sm mt-4 text-center cursor-pointer"
        >
          {isLogin ? "Don’t have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
