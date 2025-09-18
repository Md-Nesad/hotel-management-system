import { Link } from "react-router-dom";
import Footer from "../components/common/footer";
import { useEffect } from "react";

const CookiesPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="bg-white text-gray-800 min-h-screen pt-24 pb-16 px-6 sm:px-12 md:px-20 lg:px-36">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">
          Cookies Policy
        </h1>

        <p className="mb-6 text-gray-600 text-base leading-relaxed">
          This Cookies Policy explains how{" "}
          <strong>Bahamas Sunshine Lodge</strong> uses cookies and similar
          technologies to recognize you when you visit our website. It explains
          what these technologies are, why we use them, and your rights to
          control our use of them.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            1. What Are Cookies?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files that are placed on your device when you
            visit a website. They are widely used to make websites work more
            efficiently, as well as to provide reporting information and
            personalized content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            2. Why We Use Cookies
          </h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li>To remember your preferences and settings</li>
            <li>To help us understand how you use our site</li>
            <li>To improve performance and user experience</li>
            <li>To provide relevant promotions or advertisements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            3. Types of Cookies We Use
          </h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Required for basic website
              functionality.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Help us analyze site usage
              and improve performance.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your settings and
              preferences.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used for promotional and
              advertising purposes.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            4. Managing Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You can manage cookies through your browser settings. Most browsers
            allow you to block or delete cookies. Please note that disabling
            essential cookies may affect site functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            5. Third-Party Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may allow trusted third parties to place cookies to enhance user
            experience (e.g., analytics or ad services). These third-party
            cookies are subject to their own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            6. Updates to This Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Cookies Policy from time to time to reflect
            changes in legal or operational requirements. Any changes will be
            posted on this page.
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

export default CookiesPolicy;
