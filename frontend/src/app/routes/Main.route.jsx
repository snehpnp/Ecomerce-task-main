import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Header from "../components/Header";
import Banner from "../components/Banner";
import HomeProducts from "../layouts/Pages/ProductManangement";
import Products from "../layouts/Products/Products";
import PaymentHistory from "../layouts/Payment/Payment";
import Success from "../layouts/Pages/Success";
import ProductPage from "../layouts/Pages/ProductPage";
import About from "../layouts/Pages/About/About";
import Contact from "../layouts/Pages/Contact/Contact";
import Profile from "../layouts/Pages/Profile/Profile";

const Routing = () => {
  const location = useLocation();

  // ✅ Paths where Banner should be hidden
  const MatchData = ["products", "payment","success","product","contact","about","profile"];
  const hideBanner = MatchData.some((path) =>
    location.pathname.includes(path)
  );

  return (
    <div className="admin-container">
      <Header />
      <div className="admin-content">
        {!hideBanner && <Banner />}
        <main
          id="main"
          className={`main ${hideBanner ? "mt-20" : ""}`}
        >
          <div className="admin-main">
            <Routes>
              <Route path="/" element={<HomeProducts />} />
              <Route path="/products" element={<Products />} />
              <Route path="/payment" element={<PaymentHistory />} />
                <Route path="/success" element={<Success />} />
                <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />


              {/* Add more routes as needed */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Routing;
