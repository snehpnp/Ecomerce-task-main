import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "react-feather";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    const id = params.get("payment_id");

    if (id) {
      setPaymentId(id);
      setShowPopup(true);

      // Auto-hide after 3 seconds and redirect to homepage
      const timeout = setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-white px-4">
      {showPopup && (
        <div className="bg-white border border-green-200 rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <CheckCircle size={60} className="text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-semibold text-green-700">Payment Successful!</h2>
          <p className="mt-2 text-gray-700">Thank you for your purchase.</p>
          <p className="mt-1 text-sm text-gray-500">Your payment ID:</p>
          <code className="block mt-1 text-sm font-mono text-gray-800 bg-gray-100 p-1 rounded">{paymentId}</code>
          <p className="mt-4 text-sm text-gray-400">Redirecting to homepage...</p>
        </div>
      )}
    </div>
  );
};

export default Success;
