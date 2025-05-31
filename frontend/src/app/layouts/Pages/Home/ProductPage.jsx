import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleCheckout,
  getProductById,
} from "../../../services/ProductService";
import { authToken } from "../../../utils/Tokenverify";
import ProductAll from "../../Pages/Home/ProductManangement";

const ProductCard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const Token = authToken();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  const staticSizes = ["S", "M", "L", "XL"];
  const staticColors = ["Black", "Brown", "Tan"];
  const staticOffer = "Use Visa Credit Card and get 10% cashback up to ₹800!";
  const creditCardUsed = "Visa Credit Card";
  const bonusAmount = 800;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById({ id: params.id });
        if (data.status) {
          setProduct(data.data);
          setSelectedSize("M");
          setSelectedColor("Black");
          setQuantity(1);
        } else {
          setProduct(null);
        }
      } catch (error) {
        setProduct(null);
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  const incrementQty = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };
  const decrementQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const CreatePayment = () => {
    if (!Token) {
      navigate("/login");
      return;
    }
    handleCheckout(product, Token);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        Loading product...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="max-w-6xl mx-auto p-6">
        {product ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Product Image */}
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={product?.image_url?.[0]}
                  alt={product?.name || "product image"}
                  className="rounded-lg object-contain max-h-[400px]"
                />
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl font-extrabold">{product.name}</h1>

                <p className="text-gray-700 whitespace-pre-line">
                  {product.detailedDescription ||
                    product.description ||
                    "No detailed description available."}
                </p>

                <p className="text-3xl font-bold text-green-700">
                  ₹ {product.price}
                </p>

                {/* Size Selector */}
                <div>
                  <h3 className="font-semibold mb-2">Select Size:</h3>
                  <div className="flex gap-3">
                    {staticSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-800 border-gray-300 hover:border-blue-500"
                        } transition`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <h3 className="font-semibold mb-2">Select Color:</h3>
                  <div className="flex gap-3">
                    {staticColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded border ${
                          selectedColor === color
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-800 border-gray-300 hover:border-blue-500"
                        } transition`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">Quantity:</h3>
                  <button
                    onClick={decrementQty}
                    disabled={quantity === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={incrementQty}
                    disabled={quantity === product.stock}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Stock and Buy Button */}
                <div>
                  {product.stock > 0 ? (
                    <button
                      onClick={CreatePayment}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
                    >
                      Buy Now
                    </button>
                  ) : (
                    <span className="text-red-600 font-bold">Out of Stock</span>
                  )}
                </div>

                {/* Offer & Payment Info */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Special Offer
                  </h3>
                  <p>{staticOffer}</p>
                  <p className="mt-3 text-sm text-gray-600">
                    Payment method used: <b>{creditCardUsed}</b>
                  </p>
                  <p className="text-sm text-gray-600">
                    Bonus cashback you will receive: <b>₹ {bonusAmount}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // If product not found or no data
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center text-gray-700">
            <h2 className="text-2xl font-semibold mb-4">
              Product Not Available
            </h2>
            <p>
              Sorry, the product you are looking for is currently not available.
            </p>
            <p className="mt-2">Please check out other products below.</p>
          </div>
        )}

        {/* Related Products without big margin, just a small gap */}
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>

        <ProductAll />
      </div>
    </div>
  );
};

export default ProductCard;
