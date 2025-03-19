import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdminProfile from "./pages/AdminProfile";
import Payments from "./pages/Payments";
import Members from "./pages/Members";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute><div className="flex"><Sidebar /><Dashboard /></div></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><div className="flex"><Sidebar /><AdminProfile /></div></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><div className="flex"><Sidebar /><Payments /></div></PrivateRoute>} />
        <Route path="/members" element={<PrivateRoute><div className="flex"><Sidebar /><Members /></div></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;

