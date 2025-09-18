import { Link } from "react-router-dom";
import Footer from "../components/common/footer";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="bg-white text-gray-800 min-h-screen pt-24 pb-16 px-6 sm:px-16 md:px-20 lg:px-36">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">
          Privacy Policy
        </h1>

        <p className="mb-6 text-gray-600 text-base leading-relaxed">
          At <strong>Bahamas Sunshine Lodge</strong>, we respect your privacy
          and are committed to protecting your personal information. This
          Privacy Policy outlines how we collect, use, and safeguard the
          information you provide to us.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may collect personal information from you such as your name,
            email address, phone number, payment details, and booking
            preferences when you make a reservation or contact us via our
            website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li>To process your booking and manage your stay</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To improve our services and website experience</li>
            <li>To send promotional offers (only if you opt-in)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            3. Information Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We implement industry-standard security measures to protect your
            personal information against unauthorized access, alteration,
            disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">4. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            We may use cookies to enhance your browsing experience. You can
            choose to disable cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            5. Third-Party Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell or rent your personal data. However, we may use
            third-party services (e.g., payment gateways) that collect data as
            per their own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            6. Your Rights
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You may request access to, correction of, or deletion of your
            personal data at any time. Please contact us at{" "}
            <strong>infos@bahamaslrb.com</strong> for any privacy concerns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            7. Updates to this Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy periodically. The most recent
            version will always be available on this page.
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-[#F9862D] hover:bg-orange-600 text-white px-6 py-2 rounded shadow-sm transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
