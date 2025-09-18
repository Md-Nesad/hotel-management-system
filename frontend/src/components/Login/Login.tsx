import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  access_token?: string;
  accessToken?: string;
  error?: string;
  message?: string;
  [key: string]: any;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required").min(3),
  password: Yup.string().required("Password is required").min(6),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setStatus }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await axios.post<LoginResponse>(
        "https://backend.bahamaslrb.com/user/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      login(response.data);

      const token =
        response.data.access_token ||
        response.data.token ||
        response.data.accessToken;

      if (typeof token === "string" && token.length > 0) {
        // Save token to localStorage
        localStorage.setItem("token", token);

        // Decode token to extract role
        let role = "";
        try {
          const decoded: any = jwtDecode(token);
          role = decoded.role;
          console.log("Role:", role);
          localStorage.setItem("role", role);
        } catch {
          role = "";
        }

        // Navigate based on role
        if (role === "admin") {
          navigate("/dashboard/room");
        } else if (role === "employee") {
          navigate("/dashboard/concierge");
        } else if (role === "housekeeper") {
          navigate("/dashboard/housekeeping");
        } else {
          navigate("/");
        }

        setStatus(null);
      } else {
        setStatus({
          error:
            response.data.message ||
            "Login successful, but no token returned. Please try again.",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setStatus({
        error:
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpClick = () => navigate("/signup");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 mt-5">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Top right Sign Up button */}
        <div className="flex justify-end">
          <button
            onClick={handleSignUpClick}
            className="text-sm text-orange-600 font-semibold hover:text-orange-500"
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>

        <p className="text-sm text-gray-500 text-center font-medium">
          Login with your credentials
        </p>

        <Formik
          initialValues={initialValues}
          initialStatus={null}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, setStatus }) => (
            <Form className="mt-4 space-y-6">
              {["username", "password"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 capitalize"
                  >
                    {field}
                  </label>
                  <Field
                    id={field}
                    name={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={`Enter your ${field}`}
                    autoComplete={
                      field === "password" ? "current-password" : "username"
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    onInput={() => setStatus(null)}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              ))}

              {/* Show error message */}
              {status?.error && (
                <div className="text-sm text-red-600 text-center">
                  {status.error}
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-4 py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-300 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={handleSignUpClick}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Sign up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
