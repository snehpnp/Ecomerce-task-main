import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../../services/ProductService";
import { authToken } from "../../../utils/Tokenverify";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authToken();
    if (token?.id) {
      getUserProfile(token.id).then((res) => {
        if (res?.status) {
          setUser(res.user);
        } else {
          console.error("Failed to load user profile:", res?.message);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-opacity-70"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        ❌ Unable to load profile.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-blue-600 text-center">
        🙍‍♂️ Your Profile
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border">
        <div className="flex flex-col items-center gap-4">
          <motion.img
            src={"https://res.cloudinary.com/dsuvis7qq/image/upload/v1748682658/viwgywxq3zbdstraruet.png"}
            alt="Profile"
            loading="lazy"
            className="w-28 h-28 rounded-full object-cover border shadow"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Role: {user.role || "User"}
          </span>
        </div>

        <div className="border-t pt-4 space-y-3 text-gray-700">
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>📦 Orders:</strong> {user.orders?.length || 0}</p>
          <p><strong>🛒 Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-6">
        &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
      </div>
    </motion.div>
  );
};

export default Profile;
