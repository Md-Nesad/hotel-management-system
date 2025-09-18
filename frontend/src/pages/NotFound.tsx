const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        {/* OOPS! */}
        <h1 className="text-6xl font-bold text-gray-800 mb-6">OOPS!</h1>

        {/* Page not found text */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page not found.
        </h2>

        {/* Description text */}
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you were looking for. We suggest that
          you
        </p>

        {/* Return to home page text */}
        <p className="text-gray-600 mb-8">return to home page.</p>

        {/* GO BACK button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-gray-800 cursor-pointer text-white font-medium rounded hover:bg-gray-700 transition-colors"
        >
          GO BACK
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
