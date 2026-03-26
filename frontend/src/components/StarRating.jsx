import React from "react";
import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating, totalReviews, size = 14 }) => {
  // Generate an array of 5 star states: 'full', 'half', or 'empty'
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    if (rating >= starValue) return "full";
    if (rating >= starValue - 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((state, i) => (
          <span key={i} className="text-[#FFA41C]">
            {" "}
            {/* Amazon's star yellow */}
            {state === "full" && (
              <Star size={size} fill="currentColor" strokeWidth={0} />
            )}
            {state === "half" && (
              <StarHalf size={size} fill="currentColor" strokeWidth={0} />
            )}
            {state === "empty" && (
              <Star size={size} className="text-gray-300" strokeWidth={1.5} />
            )}
          </span>
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs font-medium text-[#007185] ml-1">
          {totalReviews.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default StarRating;
