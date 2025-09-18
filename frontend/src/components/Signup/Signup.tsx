import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import { FaChevronDown } from "react-icons/fa";

interface SignupFormValues {
  name: string;
  username: string;
  password: string;
  role: string;
}

interface SignupResponse {
  token?: string;
  access_token?: string;
  accessToken?: string;
  message?: string;
  error?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").min(2),
  username: Yup.string().required("Username is required").min(3),
  password: Yup.string().required("Password is required").min(8),
});

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: SignupFormValues = {
    name: "",
    username: "",
    password: "",
    role: "user",
  };

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting, setStatus }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      const response = await axios.post<SignupResponse>(
        "https://backend.bahamaslrb.com/user/signup",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      setStatus({
        error:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Signup failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 mt-5">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-orange-600 font-semibold hover:text-orange-500"
          >
            Already have an account? Log in
          </button>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign up to create an account
        </h2>

        <Formik
          initialValues={initialValues}
          initialStatus={null}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form autoComplete="off" className="mt-4 space-y-6">
              {["name", "username", "password"].map((field) => (
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
                    autoComplete={field}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              ))}

              {/* ✅ Role selection dropdown */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none "
                  >
                    <option value="">Select a role</option>
                    <option value="employee">Employee</option>
                    <option value="housekeeper">House Keeper</option>
                  </Field>
                  <FaChevronDown
                    size={14}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {status?.error && (
                <div className="text-sm text-red-600 text-center">
                  {status.error}
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-300 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;
