import React, { useContext } from "react";
import { MyContext } from "../../../context/MyContext";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeProduct, totalPrice } =
    useContext(MyContext);

  if (!cart || cart.length === 0)
    return (
      <div className="cart-container empty">
        <h2>Your cart is empty</h2>
      </div>
    );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => {
          const product = item
          const qty = item.qty;
          return (
            <li key={product._id} className="cart-item">
              <img
                src={product?.image_url[0] || "/placeholder.png"}
                alt={product?.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h3>{product?.name}</h3>
                <p className="description">{product?.description}</p>
                <p className="price">Price: ₹{product?.offer_price}</p>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(product._id)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => increaseQty(product._id)}>+</button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeProduct(product._id)}
                >
                  Remove
                </button>
              </div>

              <div className="cart-item-total">
                ₹{product.offer_price * qty}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="total-container">
        <h3>Total Price: ₹{totalPrice}</h3>
      </div>
    </div>
  );
};

export default Cart;
