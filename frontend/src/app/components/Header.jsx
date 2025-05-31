import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { authToken } from "../utils/Tokenverify";

const Header = () => {
  const navigate = useNavigate();
  const token = authToken();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  const toggleDropdown = () => setIsDropdownVisible((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenu(!isMobileMenu);

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
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-200 bg-white text-gray-700 z-50 shadow-sm">
      {/* Logo */}
      <Link to="/">
        <img src="/assets/img/logo.svg" alt="Logo" className="w-32" />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <Link to="/about" className="hover:text-blue-600 transition">About Us</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        {token?.role === "ADMIN" && (
          <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <FaBars size={20} onClick={toggleMobileMenu} className="cursor-pointer" />
      </div>

      {/* Mobile Nav */}
      {isMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-3 md:hidden z-40">
          <Link to="/" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/about" onClick={toggleMobileMenu}>About Us</Link>
          <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
          {token?.role === "ADMIN" && (
            <Link to="/products" onClick={toggleMobileMenu}>Products</Link>
          )}
        </div>
      )}

      {/* Profile / Login */}
      {token ? (
        <div className="relative">
          <img
            onClick={toggleDropdown}
            src="https://res.cloudinary.com/dsuvis7qq/image/upload/v1748682658/viwgywxq3zbdstraruet.png"
            alt="profile"
            className="w-9 h-9 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-400 transition"
          />

          <div
            className={`absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 transition-all duration-300 ease-in-out transform ${
              isDropdownVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
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
                onClick={() => setIsDropdownVisible(false)}
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
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Header;
