import axios from "axios";
import { base_url } from "../utils/Config";
import { loadStripe } from "@stripe/stripe-js";

export const addProduct = async (data) => {
  try {
    const response = await axios.post(`${base_url}add-product`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const getAllProducts = async (data) => {
  try {
    const response = await axios.get(`${base_url}get-all-products`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateProduct = async (data) => {
  try {
    const response = await axios.post(`${base_url}update-product`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (data) => {
  try {
    const response = await axios.post(`${base_url}delete-product`, data);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);

  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dsuvis7qq/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Cloudinary error response: ", data);
      return null;
    }
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};

const VITE_LOADSCRIPT = import.meta.env.VITE_LOADSCRIPT;
const stripePromise = loadStripe(VITE_LOADSCRIPT); // Your publishable key

export const handleCheckout = async (data, Token) => {
  const response = await axios.post("http://localhost:8080/create-order", {
    items: { id: data._id, user_id: Token.id, quantity: 1 },
  });

  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId: response.data.id });
};



export const getProductById = async (data) => {
  try {
    const response = await axios.post(`${base_url}get-product-byId`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const addToCart = async (data) => {
  try {
    const response = await axios.post(`${base_url}addToCart`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const GetPaymentByUser = async (data) => {
  try {
    const response = await axios.get(`${base_url}payment/${data}`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};
