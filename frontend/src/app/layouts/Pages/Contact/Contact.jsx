import React from "react";

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        📞 Contact Us
      </h1>

      <p className="text-center text-gray-700 text-lg mb-10">
        Have a question, concern, or feedback? We're here to help. Reach out to us anytime!
      </p>

      {/* Contact Information */}
      <div className="mb-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">📍 Address</h2>
          <p className="text-gray-600">123 Ecom Street,<br />New Delhi, India</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">📧 Email</h2>
          <p className="text-gray-600">support@shopnest.com</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">📱 Phone</h2>
          <p className="text-gray-600">+91 9876543210</p>
        </div>

        {/* Contact Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows="4"
              placeholder="Your message..."
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
      </div>
    </div>
  );
};

export default Contact;
