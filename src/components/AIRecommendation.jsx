import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./AIRecommendation.css";

import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaMoneyBillWave,
  FaCheckCircle,
  FaRobot,
  FaPhone,
  FaBolt,
  FaAward,
} from "react-icons/fa";

function AIRecommendation() {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateScore = (provider) => {
    let score = 70;

    score += (provider.rating || 0) * 4;

    if (provider.verified) {
      score += 5;
    }

    if (
      provider.availability &&
      provider.availability.toLowerCase().includes("today")
    ) {
      score += 3;
    }

    if (
      provider.responseTime &&
      provider.responseTime.includes("15")
    ) {
      score += 3;
    }

    return Math.min(Math.round(score), 99);
  };

  const getRecommendation = async () => {
    if (!query.trim()) {
      alert("Please enter your requirement.");
      return;
    }

    try {
      setLoading(true);
      setProvider(null);
      setReason("");

      // Uses API service instead of localhost
      const { data } = await API.post("/recommendation", {
        query,
      });

      setProvider(data.provider);
      setReason(data.reason);
    } catch (error) {
      console.error("AI Recommendation Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to get recommendation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">

      <h2>
        🤖 AI Powered Service Recommendation
      </h2>

      <p className="subtitle">
        Describe your problem naturally and our AI will recommend
        the most suitable verified service provider.
      </p>

      <input
        type="text"
        placeholder="Example: Need an affordable electrician in G-11 under Rs.3000 today"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            getRecommendation();
          }
        }}
      />

      <button
        className="recommend-btn"
        onClick={getRecommendation}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loader"></span>
            Finding Best Match...
          </>
        ) : (
          "✨ Get AI Recommendation"
        )}
      </button>

      {provider && (
        <div className="ai-card">

          <div className="top-badge">
            <FaAward />
            TOP RECOMMENDED
          </div>

          <div className="score-circle">
            <span>{calculateScore(provider)}%</span>
            <small>AI Match</small>
          </div>

          <div className="card-header">

            <div>
              <h3>{provider.name}</h3>

              {provider.verified && (
                <span className="verified">
                  <FaCheckCircle />
                  Verified
                </span>
              )}
            </div>

          </div>

          <div className="badges">

            <span>
              <FaStar />
              {provider.rating || 0}
            </span>

            <span>
              <FaMapMarkerAlt />
              {provider.area}
            </span>

            <span>
              <FaMoneyBillWave />
              Rs. {provider.price}
            </span>

            <span>
              <FaBolt />
              {provider.responseTime || "30 mins"}
            </span>

          </div>

          <p>
            <strong>Category:</strong>{" "}
            {provider.category}
          </p>

          <div className="reason-box">

            <h4>
              <FaRobot />
              Why AI Recommended?
            </h4>

            <p>
              {reason}
            </p>

          </div>

          <div className="action-buttons">

            <a
              className="whatsapp-btn"
              href={`https://wa.me/${provider.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
              WhatsApp
            </a>

            <a
              className="call-btn"
              href={`tel:${provider.phone}`}
            >
              <FaPhone />
              Call
            </a>

          </div>

          <Link
            to={`/providers/${provider._id || provider.id}`}
            className="details-link"
          >
            View Full Profile →
          </Link>

        </div>
      )}

    </div>
  );
}

export default AIRecommendation;