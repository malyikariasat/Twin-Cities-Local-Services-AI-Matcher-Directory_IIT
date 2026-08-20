import { useState } from "react";
import API from "../services/api";
import "./ReviewForm.css";

function ReviewForm({ providerId, onReviewAdded }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reviews", {
        provider: providerId,
        name,
        rating,
        comment,
      });

      alert("Review Submitted Successfully!");

      setName("");
      setRating(5);
      setComment("");

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error("Review Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    }
  };

  return (
    <div className="review-form">
      <h2>Leave a Review</h2>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
          <option value={4}>⭐⭐⭐⭐ (4)</option>
          <option value={3}>⭐⭐⭐ (3)</option>
          <option value={2}>⭐⭐ (2)</option>
          <option value={1}>⭐ (1)</option>
        </select>

        <textarea
          placeholder="Write your review..."
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;