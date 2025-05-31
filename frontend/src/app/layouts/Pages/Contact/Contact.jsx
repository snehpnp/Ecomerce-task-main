import React from "react";

const Contact = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Transparent dark overlay */}
      <div className="bg-black bg-opacity-60 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-6 py-12 text-white">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-cyan-400">
              📞 Contact Us
            </h1>

            <p className="text-center text-gray-300 text-lg mb-10">
              Have a question, concern, or feedback? We're here to help. Reach out to us anytime!
            </p>

            {/* Contact Information and Form */}
            <div className="mb-8 grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-cyan-300">📍 Address</h2>
                <p className="text-gray-300">
                  123 Ecom Street,<br />New Delhi, India
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2 text-cyan-300">📧 Email</h2>
                <p className="text-gray-300">support@shopnest.com</p>

                <h2 className="text-xl font-semibold mt-6 mb-2 text-cyan-300">📱 Phone</h2>
                <p className="text-gray-300">+91 9876543210</p>
              </div>

              {/* Contact Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="mt-1 w-full px-4 py-2 rounded-md border border-gray-600 bg-black bg-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full px-4 py-2 rounded-md border border-gray-600 bg-black bg-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Your message..."
                    className="mt-1 w-full px-4 py-2 rounded-md border border-gray-600 bg-black bg-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-2 rounded-full text-white font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="text-center text-sm text-gray-400 mt-6">
              &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
