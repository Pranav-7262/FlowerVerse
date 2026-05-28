import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import StarRating from "../components/StarRating";

const AccountReviews = () => {
  const { getUserReviews } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserReviews();
      if (res?.data?.reviews) {
        setReviews(res.data.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setError("Failed to load reviews. Please try again.");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Your Reviews</h2>
        <p className="text-gray-600">
          {reviews.length === 0
            ? "You haven't written any reviews yet. Share your feedback on flowers you've purchased!"
            : `You have written ${reviews.length} review${reviews.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600 text-lg">No reviews yet</p>
          <p className="text-gray-500 mt-2">
            Start by reviewing flowers from your orders
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StarRating rating={review.rating} size={16} />
                    <span className="text-sm font-medium text-gray-700">
                      {review.rating}/5
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {review.title}
                  </h3>
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {review.comment && (
                <p className="text-gray-700 mb-4 leading-relaxed bg-gray-50 p-4 rounded">
                  {review.comment}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {review.helpful > 0 && (
                    <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      👍 {review.helpful} found this helpful
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse More Flowers!
          </a>
        </div>
      )}
    </div>
  );
};

export default AccountReviews;
