import React, { useState } from "react";

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, feedback });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
      <div className="w-[400px] bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Give Feedback</h2>
        <p className="text-sm text-gray-700 mb-4">
          What Are Your Thoughts on the Room?
        </p>

        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= (hover ?? rating)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-sm text-gray-700 block mb-1">
            Do you have any thoughts you’d like to share?
          </label>
          <textarea
            placeholder="Write here"
            className="w-full border border-orange-300 rounded-md p-2 mb-5 focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-5 py-2 rounded-md border border-orange-400 text-orange-500 font-medium hover:bg-orange-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

interface StarProps {
  filled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const Star: React.FC<StarProps> = ({
  filled,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <svg
      className={`w-6 h-6 cursor-pointer transition-colors ${
        filled ? "text-orange-400" : "text-gray-300"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.564-.955L10 0l2.947 5.955 6.564.955-4.755 4.635 1.122 6.545z" />
    </svg>
  );
};
