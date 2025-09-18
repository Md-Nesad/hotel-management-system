import React, { useState } from "react";

interface InlineReadMoreProps {
  text: string;
  summaryLength?: number;
}

const InlineReadMore: React.FC<InlineReadMoreProps> = ({
  text,
  summaryLength = 50,
}) => {
  const [expanded, setExpanded] = useState(false);

  const summary =
    text.length > summaryLength
      ? text.slice(0, summaryLength).trim() + "..."
      : text;

  return (
    <div className="text-sm font-semibold text-black leading-snug flex flex-wrap items-center gap-1 max-w-md">
      <span>{expanded ? text : summary}</span>

      {!expanded && text.length > summaryLength && (
        <button
          onClick={() => setExpanded(true)}
          className="text-[#F9862D] hidden hover:underline text-xs font-semibold cursor-pointer bg-transparent border-0 p-0"
          aria-label="Read more"
        >
          Read More
        </button>
      )}
    </div>
  );
};

export default InlineReadMore;
