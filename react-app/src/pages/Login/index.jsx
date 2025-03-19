import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


    const onSubmitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log("🔹 Login Attempt: ", { email, password });

      try {
        const response = await window.authAPI.login(email, password);
        console.log("✅ Login Response:", response);

        if (response.success) {
          // Save token for future requests
          window.sessionStorage.setItem("authToken", response.token);  // <-- Save the token here
          console.log("🔑 Saved auth token:", response.token);           // <-- Log the token

          toast.success("Login successful!");
          console.log("🔄 Redirecting to /dashboard...");
          navigate("/dashboard", { replace: true });
        } else {
          toast.error(response.message);
          console.error("❌ Login failed:", response.message);
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
        console.error("❌ Login Error:", error);
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-white to-red-400">
      <img
        onClick={() => navigate("/")}
        src={assets.kiloKulture_Logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-[#D2122E] p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Login</h2>
        <p className="text-center text-sm mb-6">Login to your account!</p>

        <form onSubmit={onSubmitHandler}>
          <InputField
            icon={assets.mail_icon}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={assets.lock_icon}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-red-300 to bg-red-600 text-white font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ icon, type, placeholder, value, onChange }) => (
  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#fd5c63]">
    <img src={icon} alt="icon" />
    <input
      className="bg-transparent outline-none w-full"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Login;

