import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { handleCheckout, getProductById } from "../../../services/ProductService";
import { authToken } from "../../../utils/Tokenverify";
import ProductAll from "../../Pages/Home/ProductManangement";

const ProductCard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const Token = authToken();

  const [product, setProduct] = useState({
    _id: "12345",
    name: "Sample Product",
    description: "This is a sample product description.",
    price: 1000,
    stock: 1,
    image_url: ["https://via.placeholder.com/300"],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById({ id: params.id });
        if (data.status) {
          setProduct(data.data);
        } else {
          console.error("Error fetching product:", data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [params.id]);

  const CreatePayment = (data) => {
    if (!Token) {
      navigate("/login");
      return;
    }
    handleCheckout(data, Token);
  };

  return (
    <>
      {/* Highlighted Single Product View */}
      <div className="w-full px-6 py-10 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2">
          <img
            src={product?.image_url?.[0]}
            alt={product?.name || "product image"}
            className="rounded-xl object-contain w-full max-h-[400px] shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-gray-700 text-base">{product?.description}</p>
          <p className="text-2xl font-semibold text-green-600">
            Rs {product?.price}
          </p>
          <div className="mt-4">
            {product.stock === 1 ? (
              <button
                onClick={() => CreatePayment(product)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* Product List */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <ProductAll />
      </div>
    </>
  );
};

export default ProductCard;
