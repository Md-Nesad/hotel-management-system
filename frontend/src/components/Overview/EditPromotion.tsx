import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { DateInputWithIcon } from "./ui/DateInputWithIcon";
import { Link } from "react-router-dom";
import { useState } from "react";

// Type for form values
interface PromotionFormValues {
  title: string;
  discount: string;
  promoCode: string;
  status: string;
  startDate: string;
  endDate: string;
}

const EditPromotion: React.FC = () => {
  const { promotionId } = useParams();

  const initialValues: PromotionFormValues = {
    title: "",
    discount: "",
    promoCode: "",
    status: "Active",
    startDate: "",
    endDate: "",
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Promotion title is required"),
    discount: Yup.string().required("Discount is required"),
    promoCode: Yup.string().required("Promo code is required"),
    status: Yup.string().required("Status is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
  });

  const handleSubmit = async (values: PromotionFormValues) => {
    setIsSubmitted(true);
    try {
      const payload = {
        promoTitle: values.title,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        promoCode: values.promoCode,
        discount: parseInt(values.discount.replace("%", "")),
        status: values.status.toLowerCase(),
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated!");
        return;
      }

      const res = await fetch(
        `https://backend.bahamaslrb.com/promotion/${promotionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update promotion");
      }

      const result = await res.json();
      console.log("Server Response:", result);
      alert("Promotion updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating promotion. Please login again or try later.");
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div>
      <h2 className="text-center py-3 text-gray-700 text-2xl bg-white shadow-sm rounded-md mb-5">
        Edit Details
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="mx-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Promotion Title
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter promotion title"
                      className="block w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount
                    </label>
                    <Field
                      as="select"
                      id="discount"
                      name="discount"
                      className="block w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                    >
                      <option value="">Select Discount</option>
                      <option value="10%">10%</option>
                      <option value="20%">20%</option>
                      <option value="30%">30%</option>
                      <option value="45%">45%</option>
                      <option value="50%">50%</option>
                    </Field>
                    <ErrorMessage
                      name="discount"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="promoCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Promo Code
                    </label>
                    <Field
                      id="promoCode"
                      name="promoCode"
                      type="text"
                      placeholder="Edit promo code"
                      className="block w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-400"
                    />
                    <ErrorMessage
                      name="promoCode"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="block w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <DateInputWithIcon
                      id="startDate"
                      name="startDate"
                      type="date"
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <DateInputWithIcon
                      id="endDate"
                      name="endDate"
                      type="date"
                    />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-sm text-red-600 mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
                  <Link to="/dashboard/promotion">
                    <button
                      type="button"
                      className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md font-medium hover:bg-[#F9862D] hover:text-white cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </Link>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition cursor-pointer"
                  >
                    {isSubmitted ? "Updating..." : "Update"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;
