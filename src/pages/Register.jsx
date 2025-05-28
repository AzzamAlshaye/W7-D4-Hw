// src/pages/Register.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.fullName) {
      errors.fullName = "Required";
    } else if (values.fullName.length < 3) {
      errors.fullName = "Must be at least 3 characters";
    } else if (values.fullName.length > 50) {
      errors.fullName = "Can't exceed 50 characters";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Must be at least 8 characters";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords must match";
    }
    return errors;
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const userPayload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    };

    try {
      await axios.post(
        "https://68370703664e72d28e432cf6.mockapi.io/login",
        userPayload
      );
      toast.success("Sign-up successful! Redirecting to login…");
      resetForm();
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-6">
      <ToastContainer position="top-center" />
      <div className="bg-neutral-200 shadow-2xl rounded-3xl max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-6">
          <FaUserPlus className="text-5xl text-neutral-900 mb-2" />
          <h2 className="text-2xl font-bold text-neutral-900">
            Create Account
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-neutral-800 font-medium mb-1"
                >
                  Full Name
                </label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-neutral-800 font-medium mb-1"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-neutral-800 font-medium mb-1"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-neutral-800 font-medium mb-1"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {isSubmitting ? "Registring ..." : "Register"}
              </button>
              <Link to="/">
                <button className="w-full py-2 bg-neutral-600 text-neutral-100 font-semibold rounded-lg hover:bg-neutral-400 hover:text-neutral-800  transition">
                  Home
                </button>
              </Link>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-neutral-800">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-neutral-900 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
