import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Retrieve token
    if (token) {
      window.authAPI.authenticateUser(token)
        .then((response) => {
          if (response.success) {
            setUserData(response.user);
          } else {
            setUserData(null);
          }
        })
        .catch(() => setUserData(null));
    }
  }, []);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.kiloKulture_Logo} alt="Kilo Culture Logo" className="w-18 sm:w-20" />
      {userData ? (
        <div>{userData.name[0].toUpperCase()}</div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;

