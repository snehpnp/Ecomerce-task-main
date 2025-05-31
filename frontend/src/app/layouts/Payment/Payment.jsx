import React, { useEffect, useState, useMemo } from "react";
import { GetPaymentByUser } from "../../services/ProductService";
import { authToken } from "../../utils/Tokenverify";
import * as XLSX from "xlsx";

const PaymentHistory = () => {
  const Token = authToken();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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
  }, [Token?.id]);

  // Filter and search combined
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        filterStatus === "All" ||
        payment.status.toLowerCase() === filterStatus.toLowerCase();

      const matchesSearch =
        payment.productDetails.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.order_id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [payments, searchTerm, filterStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle page change safely
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (filteredPayments.length === 0) return;

    const worksheetData = filteredPayments.map((p) => ({
      FullName: Token.role === "ADMIN" ? p.usersDetails.FullName : undefined,
      ProductName: p.productDetails.name,
      PaymentID: p.order_id,
      Amount: p.amount.toFixed(2),
      Status: p.status,
      Date: new Date(p.createdAt).toLocaleString(),
    }));

    if (Token.role !== "ADMIN") {
      worksheetData.forEach((row) => delete row.FullName);
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payment_history.xlsx");
  };

  return (
    <div
      className="mx-auto min-h-screen relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          💳 Payment History
        </h2>

        {/* Search & Filter & Export */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 justify-between items-center">
          <input
            type="text"
            placeholder="Search by Product Name or Payment ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3"
          />

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // reset page on filter
            }}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/5"
          >
            <option value="All">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <button
            onClick={exportToExcel}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
          >
            Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded shadow-md border border-gray-300 bg-white">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                {Token?.role === "ADMIN" && (
                  <th className="px-4 py-3 text-left border-b border-gray-300">
                    Full Name
                  </th>
                )}

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Product Name
                </th>

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Payment ID
                </th>

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Amount
                </th>

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Status
                </th>

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments?.length > 0 ? (
                paginatedPayments?.map((payment) => (
                  <tr
                    key={payment?.id}
                    className="border-t text-sm hover:bg-blue-50 transition"
                  >
                    {Token.role === "ADMIN" && (
                      <td className="px-4 py-3">{payment?.usersDetails.FullName}</td>
                    )}

                    <td className="px-4 py-3">{payment?.productDetails.name}</td>

                    <td className="px-4 py-3">{payment?.order_id}</td>

                    <td className="px-4 py-3">₹{payment?.amount.toFixed(2)}</td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        payment?.status === "completed"
                          ? "text-green-600"
                          : payment.status === "Failed"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {payment.status}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Token?.role === "ADMIN" ? 6 : 5}
                    className="text-center py-8 text-gray-500"
                  >
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredPayments?.length > recordsPerPage && (
          <div className="flex justify-between items-center mt-4 px-4 md:px-0">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50`}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Showing{" "}
              {(currentPage - 1) * recordsPerPage + 1} -{" "}
              {Math.min(currentPage * recordsPerPage, filteredPayments.length)} of{" "}
              {filteredPayments.length}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
