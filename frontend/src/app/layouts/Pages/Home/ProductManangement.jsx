import React, { useEffect, useState, useContext } from "react";
import { getAllProducts } from "../../../services/ProductService";
import { FaHeart, FaRegHeart, FaCartPlus, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authToken } from "../../../utils/Tokenverify";
import { MyContext } from "../../../../context/MyContext";

const HomeProducts = () => {
  const navigate = useNavigate();
  let Token = authToken();
  const { addProduct } = useContext(MyContext);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const fetchTopRatedProducts = async () => {
    setLoading(true);
    const req = { limit: 20 };
    try {
      const res = await getAllProducts(req);
      if (res.status) {
        setTopRatedProducts(res.data);
      } else {
        setTopRatedProducts([]);
      }
    } catch (error) {
      console.error("Error while fetching top products", error);
      setTopRatedProducts([]);
    }
    setLoading(false);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      setCart([...cart, product]);
      addProduct(product);
    }
  };

  const RedirectToProductPage = (id) => {
    if (!Token) {
      navigate("/login");
      return;
    }
    navigate(`/product/${id}`);
  };

  return (
    <div className="pt-14 px-4 md:px-8 w-full bg-white">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-center mb-2 text-gray-900 relative after:absolute after:w-20 after:h-1 after:bg-blue-500 after:rounded after:left-1/2 after:-bottom-1 after:-translate-x-1/2">
          Popular Products
        </h2>

        {loading ? (
          <div className="flex justify-center mt-16">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
              {topRatedProducts.length > 0 ? (
                topRatedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl border shadow hover:shadow-lg p-4 transition relative"
                    // REMOVE this onClick from here
                    // onClick={() => RedirectToProductPage(product._id)}
                  >
                    {/* Add onClick on image and title separately */}
                    <img
                      src={product.image_url[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-3 cursor-pointer"
                      onClick={() => RedirectToProductPage(product._id)}
                    />
                    <h3
                      className="text-md font-semibold cursor-pointer"
                      onClick={() => RedirectToProductPage(product._id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {product.description}
                    </p>
                    <div className="mt-2 text-blue-600 font-semibold">
                      ₹{product.price}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling to parent div
                          toggleFavorite(product._id);
                        }}
                        className="text-red-500 hover:scale-110 transition"
                        title="Favorite"
                      >
                        {favorites.includes(product._id) ? (
                          <FaHeart size={20} />
                        ) : (
                          <FaRegHeart size={20} />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling to parent div
                          addToCart(product);
                        }}
                        className="text-blue-600 hover:scale-110 transition flex items-center gap-2"
                      >
                        {cart.find((item) => item._id === product._id) ? (
                          <>
                            <FaCheck /> <span className="text-sm">Added</span>
                          </>
                        ) : (
                          <>
                            <FaCartPlus /> <span className="text-sm">Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No popular products available right now.
                </p>
              )}
            </div>

            <button
              onClick={() => (window.location.href = "/all-products")}
              className="px-14 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 shadow-sm"
            >
              See More
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
