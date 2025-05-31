import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

      // Auto-hide after 5 seconds and redirect
      const timeout = setTimeout(() => {
        setShowPopup(false);
        navigate("/"); // Redirect to home
      }, 5000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {showPopup && (
        <div className="bg-green-100 p-6 text-green-800 rounded shadow-md text-center animate-fade-in max-w-md">
          <h2 className="text-xl font-bold">Payment Successful!</h2>
          <p className="mt-2">Your payment ID is:</p>
          <code className="text-sm">{paymentId}</code>
          <p className="mt-2">Thank you for your purchase!</p>
          <p className="mt-2">You will be redirected shortly...</p>
        </div>
      )}
    </div>
  );
};

export default Success;
