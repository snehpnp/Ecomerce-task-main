import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // For the profile icon (you can use any other icon)
import { authToken } from "../utils/Tokenverify";
const Header = () => {
  const navigate = useNavigate();
  const token = authToken();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 bg-white text-gray-700 z-50 shadow-md">
      <img src="/assets/img/logo.svg" alt="Logo" />

      {/* Navigation Links */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link to="/" className="hover:text-gray-900 transition">
          Home
        </Link>

        <Link to="/about" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>
        {token && token?.role == "ADMIN" && (
          <Link to="/products" className="hover:text-gray-900 transition">
            products
          </Link>
        )}
      </div>

      {/* Profile Icon */}
      {/* Profile Icon & Animated Dropdown */}
      {token ? (
        <div className="relative">
          <FaUserCircle
            size={30}
            className="cursor-pointer text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={toggleDropdown}
          />

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-44 bg-white rounded-md shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform ${
              isDropdownVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            } z-50`}
          >
            <div className="py-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownVisible(false)}
              >
                My Profile
              </Link>
              <Link
                to="/payment"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Payment History
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          <Link to="/login" className="text-white">
            Login
          </Link>
        </button>
      )}
    </nav>
  );
};

export default Header;
