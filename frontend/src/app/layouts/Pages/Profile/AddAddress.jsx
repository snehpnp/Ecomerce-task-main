import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaEnvelope,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddAddress = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    lat: 28.6139,
    lng: 77.209,
  });
  const [errors, setErrors] = useState({});

  // All saved addresses state, with one marked as primary
  const [addresses, setAddresses] = useState([]);

  // Validation function
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      errs.phone = "Valid 10 digit phone number required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.zip.trim() || !/^\d{5,6}$/.test(form.zip))
      errs.zip = "Valid zip code required";
    return errs;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save address on form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Create a new address with an id and primary flag
      const newAddress = {
        ...form,
        id: Date.now(),
        isPrimary: addresses.length === 0, // first address is primary by default
      };

      setAddresses((prev) => [...prev, newAddress]);
      alert("Address saved!");

      // Reset form except keep lat/lng for user convenience
      setForm((prev) => ({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        lat: prev.lat,
        lng: prev.lng,
      }));
      setErrors({});
    }
  };

  // To set primary address when user clicks toggle
  const setPrimaryAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id
          ? { ...addr, isPrimary: true }
          : { ...addr, isPrimary: false }
      )
    );
  };

  // Map click handler to update lat/lng on map click
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setForm((prev) => ({
          ...prev,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        }));
      },
    });
    return null;
  };

  // On mount try geolocation to center map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
          }));
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        }
      );
    } else {
      console.warn("Geolocation not supported");
    }
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        <FaMapMarkerAlt /> Add Delivery Address
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name & Phone */}
        <div style={rowStyle}>
          <div style={colStyle}>
            <label style={labelStyle}>
              <FaUser /> Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Full Name"
            />
            {errors.name && <small style={errorStyle}>{errors.name}</small>}
          </div>

          <div style={colStyle}>
            <label style={labelStyle}>
              <FaPhone /> Phone:
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="10 digit number"
            />
            {errors.phone && <small style={errorStyle}>{errors.phone}</small>}
          </div>
        </div>

        {/* Address */}
        <div style={fullRow}>
          <label style={labelStyle}>
            <FaHome /> Address:
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleInputChange}
            style={{ ...inputStyle, height: "45px", resize: "none" }}
            placeholder="Address"
          />
          {errors.address && <small style={errorStyle}>{errors.address}</small>}
        </div>

        {/* City & State */}
        <div style={rowStyle}>
          <div style={colStyle}>
            <label style={labelStyle}>
              <FaCity /> City:
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="City"
            />
            {errors.city && <small style={errorStyle}>{errors.city}</small>}
          </div>

          <div style={colStyle}>
            <label style={labelStyle}>State:</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="State"
            />
            {errors.state && <small style={errorStyle}>{errors.state}</small>}
          </div>
        </div>

        {/* Zip Code */}
        <div style={rowStyle}>
          <div style={colStyle}>
            <label style={labelStyle}>
              <FaEnvelope /> Zip Code:
            </label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Postal Code"
            />
            {errors.zip && <small style={errorStyle}>{errors.zip}</small>}
          </div>
          <div style={colStyle}></div>
        </div>

        {/* Map */}
        <label style={labelStyle}>Select Location on Map:</label>
        <div
          style={{
            height: "230px",
            marginBottom: "20px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <MapContainer
            center={[form.lat, form.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />
            <Marker position={[form.lat, form.lng]} />
          </MapContainer>
        </div>

        <button type="submit" style={buttonStyle}>
          Save Address
        </button>
      </form>

      {/* Saved Addresses List */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>
          Saved Addresses
        </h3>
        {addresses.length === 0 ? (
          <p>No addresses saved yet.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "12px",
                backgroundColor: addr.isPrimary ? "#d1e7dd" : "#f8f9fa",
                border: addr.isPrimary
                  ? "2px solid #0f5132"
                  : "1px solid #ced4da",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{addr.name}</strong> — {addr.phone}
                <br />
                {addr.address}, {addr.city}, {addr.state} - {addr.zip}
              </div>
              <div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: addr.isPrimary ? "#0f5132" : "#6c757d",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  title={addr.isPrimary ? "Primary Address" : "Set as Primary"}
                  onClick={() => setPrimaryAddress(addr.id)}
                >
                  {addr.isPrimary ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Style Objects
const containerStyle = {
  maxWidth: "800px",
  margin: "30px auto",
  padding: "30px",
  background: "rgba(255, 255, 255, 0.15)",
  borderRadius: "20px",
  backdropFilter: "blur(15px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  fontFamily: "'Segoe UI', sans-serif",
};

const rowStyle = {
  display: "flex",
  gap: "20px",
  marginBottom: "15px",
};

const fullRow = {
  marginBottom: "15px",
};

const colStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "5px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
};

const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "4px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  fontWeight: "600",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
};

export default AddAddress;
