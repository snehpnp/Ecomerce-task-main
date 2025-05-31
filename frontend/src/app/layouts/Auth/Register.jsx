import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { Registerinfo } from "../../services/Auth";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            phoneNo: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(3, "At least 3 characters required")
                .required("Full Name is required"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            phoneNo: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
                .required("Phone number is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const data = {
                    FullName: values.fullName,
                    Email: values.email,
                    PhoneNo: values.phoneNo,
                    Password: values.password,
                };
                const res = await Registerinfo(data);

                if (res.status) {
                    await MySwal.fire({
                        icon: "success",
                        title: "Registered successfully!",
                        text: res.msg,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    navigate("/login");
                } else {
                    await MySwal.fire({
                        icon: "error",
                        title: "Registration failed",
                        text: res.msg,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                }
            } catch (err) {
                await MySwal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: err.message || "Please try again",
                });
            }
        },
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "20px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "20px",
                    padding: "40px 35px",
                    width: "100%",
                    maxWidth: "480px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <h3
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        fontWeight: "700",
                        fontSize: "1.8rem",
                        color: "#007bff",
                    }}
                >
                    Create Your Account
                </h3>

                <form onSubmit={formik.handleSubmit} noValidate>
                    {/* Full Name */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="fullName"
                            style={{
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            <FaUser style={{ marginRight: "8px", verticalAlign: "middle" }} />
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border:
                                    formik.touched.fullName && formik.errors.fullName
                                        ? "2px solid #e74c3c"
                                        : "1.8px solid #ddd",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border-color 0.3s",
                            }}
                            {...formik.getFieldProps("fullName")}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                            <div
                                style={{
                                    color: "#e74c3c",
                                    fontSize: "13px",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                {formik.errors.fullName}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="email"
                            style={{
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            <FaEnvelope style={{ marginRight: "8px", verticalAlign: "middle" }} />
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border:
                                    formik.touched.email && formik.errors.email
                                        ? "2px solid #e74c3c"
                                        : "1.8px solid #ddd",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border-color 0.3s",
                            }}
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div
                                style={{
                                    color: "#e74c3c",
                                    fontSize: "13px",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="phoneNo"
                            style={{
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            <FaPhone style={{ marginRight: "8px", verticalAlign: "middle" }} />
                            Phone Number
                        </label>
                        <input
                            id="phoneNo"
                            type="text"
                            name="phoneNo"
                            placeholder="Enter your 10-digit phone number"
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border:
                                    formik.touched.phoneNo && formik.errors.phoneNo
                                        ? "2px solid #e74c3c"
                                        : "1.8px solid #ddd",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border-color 0.3s",
                            }}
                            {...formik.getFieldProps("phoneNo")}
                        />
                        {formik.touched.phoneNo && formik.errors.phoneNo && (
                            <div
                                style={{
                                    color: "#e74c3c",
                                    fontSize: "13px",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                {formik.errors.phoneNo}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="password"
                            style={{
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            <FaLock style={{ marginRight: "8px", verticalAlign: "middle" }} />
                            Password
                        </label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                style={{
                                    flex: 1,
                                    padding: "12px 14px",
                                    borderRadius: "8px 0 0 8px",
                                    border:
                                        formik.touched.password && formik.errors.password
                                            ? "2px solid #e74c3c"
                                            : "1.8px solid #ddd",
                                    borderRight: "none",
                                    fontSize: "1rem",
                                    outline: "none",
                                    transition: "border-color 0.3s",
                                }}
                                {...formik.getFieldProps("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    border: "1.8px solid #ddd",
                                    borderLeft: "none",
                                    borderRadius: "0 8px 8px 0",
                                    padding: "0 14px",
                                    backgroundColor: "#f9f9f9",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "44px",
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash color="#555" /> : <FaEye color="#555" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div
                                style={{
                                    color: "#e74c3c",
                                    fontSize: "13px",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                {formik.errors.password}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "28px" }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{
                                marginBottom: "6px",
                                display: "block",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            <FaLock style={{ marginRight: "8px", verticalAlign: "middle" }} />
                            Confirm Password
                        </label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                style={{
                                    flex: 1,
                                    padding: "12px 14px",
                                    borderRadius: "8px 0 0 8px",
                                    border:
                                        formik.touched.confirmPassword &&
                                        formik.errors.confirmPassword
                                            ? "2px solid #e74c3c"
                                            : "1.8px solid #ddd",
                                    borderRight: "none",
                                    fontSize: "1rem",
                                    outline: "none",
                                    transition: "border-color 0.3s",
                                }}
                                {...formik.getFieldProps("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    border: "1.8px solid #ddd",
                                    borderLeft: "none",
                                    borderRadius: "0 8px 8px 0",
                                    padding: "0 14px",
                                    backgroundColor: "#f9f9f9",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "44px",
                                }}
                                aria-label={
                                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash color="#555" />
                                ) : (
                                    <FaEye color="#555" />
                                )}
                            </button>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div
                                style={{
                                    color: "#e74c3c",
                                    fontSize: "13px",
                                    marginTop: "5px",
                                    fontWeight: "500",
                                }}
                            >
                                {formik.errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    <div
                        className="flex justify-between text-sm"
                        style={{
                            marginBottom: "22px",
                            textAlign: "right",
                        }}
                    >
                        <span
                            onClick={() => navigate("/login")}
                            style={{
                                color: "#007bff",
                                cursor: "pointer",
                                fontWeight: "600",
                                userSelect: "none",
                                textDecoration: "underline",
                            }}
                        >
                            Already have an account? Login
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            boxShadow: "0 4px 10px rgba(0,123,255,0.4)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                    >
                        {formik.isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
