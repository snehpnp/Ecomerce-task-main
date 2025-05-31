import React, { useEffect, useState } from "react";
import ProductCard from "../Pages/ProductCard";
// import { useAppContext } from "@/context/AppContext";
import { getTopRatedProducts } from "../../services/ProductService";

const HomeProducts = () => {
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    fetchTopRatedProducts();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const id = params.get("payment_id");

    if (id) {
      setPaymentId(id);
      setShowSuccess(true);

      // Hide after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  // Function to fetch top rated products
  const fetchTopRatedProducts = async () => {
    const req = { limit: 20 };
    try {
      const res = await getTopRatedProducts(req);
      if (res.status) {
        setTopRatedProducts(res.data); // Agar status true hai to data set karo
      } else {
        setTopRatedProducts([]); // Agar error hai to empty array
      }
    } catch (error) {
      console.error("Error while fetching top products", error);
    }
  };

  return (
    <div className="pt-14 px-4 md:px-8 w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center">
        <p className="text-2xl font-medium text-left w-full">
          Popular products
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {topRatedProducts?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        <button
          onClick={() => router.push("/all-products")}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          See more
        </button>
      </div>

      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded shadow-md animate-fade-in z-50">
          <strong>✅ Payment Successful!</strong>
          <div className="text-sm mt-1">Payment ID: {paymentId}</div>
        </div>
      )}
    </div>
  );
};

export default HomeProducts;
