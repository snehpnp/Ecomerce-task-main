import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../../services/ProductService";
import { authToken } from "../../../utils/Tokenverify";

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
      <div className="flex items-center justify-center h-screen">
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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center px-4 py-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">
          🙍‍♂️ Your Profile
        </h1>

        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src="https://res.cloudinary.com/dsuvis7qq/image/upload/v1748682658/viwgywxq3zbdstraruet.png"
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border shadow"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="px-4 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Role: {user.role || "User"}
          </span>
        </div>

        <div className="border-t pt-4 text-gray-700 space-y-3">
          <p>
            <strong>📧 Email:</strong> {user.email}
          </p>
          <p>
            <strong>📦 Orders:</strong> {user.orders?.length || 0}
          </p>
          <p>
            <strong>🛒 Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="border-t pt-4 text-gray-700 space-y-4 mt-6">
          <div>
            <h3 className="font-semibold mb-1">📝 Bio</h3>
            <p>
              This is your personal profile page where you can view your account
              details, order history, and more.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">📞 Contact Info</h3>
            <p>Phone: {user.phone || "Not provided"}</p>
            <p>Address: {user.address || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">🔗 Social Links</h3>
            <div className="flex gap-3">
              <a
                href={user.social?.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Twitter
              </a>
              <a
                href={user.social?.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                LinkedIn
              </a>
              <a
                href={user.social?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Profile;
