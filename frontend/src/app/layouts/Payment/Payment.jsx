import React, { useEffect, useState } from "react";
import { GetPaymentByUser } from "../../services/ProductService";
import { authToken } from "../../utils/Tokenverify";

const PaymentHistory = () => {
  let Token = authToken();
  const [payments, setPayments] = useState([]);

  // Dummy payment data — replace with fetch/axios from API
  useEffect(() => {
    const GetPayment = async () => {
      try {
        const response = await GetPaymentByUser(Token?.id);

        if (response.success) {
          setPayments(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };
    GetPayment();
  }, []);


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💳 Payment History</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
             {Token.role == "ADMIN" && <th className="px-4 py-2 text-left">Full Name</th>}

              <th className="px-4 py-2 text-left">Product Name</th>

              <th className="px-4 py-2 text-left">Payment ID</th>
          
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t text-sm">
                {Token.role == "ADMIN" && <td className="px-4 py-2">{payment.usersDetails.FullName}</td>}

                <td className="px-4 py-2">{payment.productDetails.name}</td>

                <td className="px-4 py-2">{payment.order_id}</td>
                <td className="px-4 py-2">₹{payment.amount.toFixed(2)}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    payment.status === "completed"
                      ? "text-green-600"
                      : payment.status === "Failed"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {payment.status}
                </td>
                <td className="px-4 py-2">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
