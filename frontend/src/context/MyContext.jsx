import React, { createContext, useState, useEffect } from "react";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  // Load cart from localStorage or empty array
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart (flat structure)
  const addProduct = (product) => {
    // If product has nested "0" key, flatten it
    const actualProduct = product?.["0"] ? product["0"] : product;

    setCart((prevCart) => {
      const existing = prevCart.find((p) => p._id === actualProduct._id);

      if (existing) {
        return prevCart.map((p) =>
          p._id === actualProduct._id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prevCart, { ...actualProduct, qty: 1 }];
      }
    });
  };

  // Increase qty
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease qty (minimum 1)
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  // Remove product
  const removeProduct = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.offer_price * item.qty,
    0
  );

  return (
    <MyContext.Provider
      value={{
        cart,
        addProduct,
        increaseQty,
        decreaseQty,
        removeProduct,
        totalPrice,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
