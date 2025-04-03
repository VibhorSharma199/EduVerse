import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // Clear any existing auth errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Clear auth error when email or password changes
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [email, password, authError, clearError]);

  const validateForm = () => {
    if (!email) {
      throw new Error("Email is required");
    }
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email address");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isLoading) return;

      try {
        validateForm();
        setIsLoading(true);
        await login(email, password);

        // Save email in localStorage if rememberMe is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate(from, { replace: true });
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, navigate, from, isLoading, rememberMe]
  );

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value.trim());
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {authError && (
            <div className="rounded-md bg-red-50 p-4">
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
                  <div className="text-sm text-red-700">{authError}</div>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50"
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              tabIndex={isLoading ? -1 : 0}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
