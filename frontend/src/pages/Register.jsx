import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();

  // Clear any existing auth errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Clear auth error when form data changes
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [formData, authError, clearError]);

  const validateForm = useCallback(() => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      try {
        const { confirmPassword: _, ...registrationData } = formData;
        await register(registrationData);
        navigate("/dashboard");
      } catch (err) {
        console.error("Registration failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData, register, navigate, loading, validateForm]
  );

  const renderField = useCallback(
    ({ name, type = "text", label, placeholder, options = null }) => {
      const commonProps = {
        id: name,
        name,
        required: true,
        value: formData[name],
        onChange: handleChange,
        disabled: loading,
        className: `appearance-none rounded-none relative block w-full px-3 py-2 border ${
          formErrors[name]
            ? "border-red-300 text-red-900 placeholder-red-300"
            : "border-gray-300 placeholder-gray-500 text-gray-900"
        } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
          loading ? "bg-gray-50" : ""
        }`,
      };

      return (
        <div>
          <label htmlFor={name} className="sr-only">
            {label}
          </label>
          {options ? (
            <select {...commonProps}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input type={type} placeholder={placeholder} {...commonProps} />
          )}
          {formErrors[name] && (
            <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
          )}
        </div>
      );
    },
    [formData, formErrors, loading, handleChange]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {authError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{authError}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            {renderField({
              name: "name",
              label: "Full Name",
              placeholder: "Full Name",
            })}
            {renderField({
              name: "email",
              type: "email",
              label: "Email address",
              placeholder: "Email address",
            })}
            {renderField({
              name: "password",
              type: "password",
              label: "Password",
              placeholder: "Password",
            })}
            {renderField({
              name: "confirmPassword",
              type: "password",
              label: "Confirm Password",
              placeholder: "Confirm Password",
            })}
            {renderField({
              name: "role",
              label: "Role",
              options: [
                { value: "student", label: "Student" },
                { value: "mentor", label: "Mentor" },
              ],
            })}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              tabIndex={loading ? -1 : 0}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
