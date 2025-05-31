import React from "react";

const About = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Transparent dark overlay */}
      <div className="bg-black bg-opacity-60 min-h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto px-6 py-12 text-white">
          <h1 className="text-4xl font-bold mb-6 text-center text-cyan-400">
            🛍️ About Us
          </h1>

          <p className="text-gray-200 text-lg mb-6 text-center">
            Welcome to <span className="font-semibold text-cyan-300">ShopNest</span>, your one-stop
            online shop for high-quality and affordable products. We are passionate
            about delivering an excellent customer experience and top-notch service.
          </p>

          <div className="grid md:grid-cols-2 gap-10 items-start mt-10">
            {/* Mission Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-cyan-300">🎯 Our Mission</h2>
              <p className="text-gray-300">
                At ShopNest, our mission is to make online shopping convenient,
                secure, and enjoyable for everyone. We aim to offer a wide range of
                carefully curated products backed by fast delivery and responsive
                customer support.
              </p>
            </div>

            {/* Vision Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-cyan-300">🚀 Our Vision</h2>
              <p className="text-gray-300">
                We envision a future where shopping online is as personal and
                reliable as shopping in-store. By leveraging modern technology,
                cloud storage (like Cloudinary), and secure payments (via Stripe),
                we make that vision a reality.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">👨‍💻 Meet the Team</h2>
            <ul className="space-y-2 text-gray-300">
              <li><strong>Your Name</strong> – Full Stack Developer</li>
              <li>🛠️ Tech Stack: React, Node.js, MongoDB, Stripe, Cloudinary</li>
              <li>📧 Contact: your.email@example.com</li>
              <li>🔗 GitHub: https://github.com/yourusername</li>
            </ul>
          </div>

          <div className="mt-12 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
