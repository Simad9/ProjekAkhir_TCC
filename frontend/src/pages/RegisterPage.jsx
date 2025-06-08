import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        {
          username,
          // email,
          password,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.data) {
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Background biru dengan teks besar */}
      <div className="flex-1 bg-blue-600 flex justify-center items-center">
        <h1 className="text-white text-5xl font-bold tracking-wide select-none">
          REGISTER HERE
        </h1>
      </div>

      {/* Kanan: Form Register */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Register</h2>
          <form onSubmit={handleRegister} autoComplete="off" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div> */}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                className="mt-2 w-full rounded-md border border-gray-300 bg-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md text-center font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Sudah Punya Akun?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
