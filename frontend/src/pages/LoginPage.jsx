import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (result) {
        // Check user role and redirect accordingly
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Form Login */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Welcome Back</h2>
          <form onSubmit={handleLogin} autoComplete="off" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-center font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Kanan: Background biru dan tulisan besar */}
      <div className="flex-1 bg-blue-600 flex justify-center items-center">
        <h1 className="text-white text-5xl font-bold tracking-wide select-none">
          LOGIN HERE
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;