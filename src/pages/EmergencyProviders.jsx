import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";

import {
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import "./EmergencyProviders.css";

function EmergencyProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyProviders();
  }, []);

  const fetchEmergencyProviders = async () => {
    try {
      const { data } = await API.get("/providers");

      const emergencyProviders = data.filter(
        (provider) =>
          provider.verified &&
          provider.availability === "Available Today"
      );

      setProviders(emergencyProviders);
    } catch (error) {
      console.error("Emergency Providers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Loading Emergency Providers...
      </h2>
    );
  }

  return (
    <div className="emergency-page">
      <h1>🚨 Emergency Service Providers</h1>

      <p className="subtitle">
        Verified professionals available today.
      </p>

      <div className="emergency-grid">
        {providers.length > 0 ? (
          providers.map((provider) => (
            <div
              className="emergency-card"
              key={provider._id}
            >
              <div className="top">
                <h3>{provider.name}</h3>

                <span className="verified">
                  <FaCheckCircle />
                  Verified
                </span>
              </div>

              <p>⭐ {provider.rating}</p>

              <p>
                📍 {provider.area}
              </p>

              <p>
                Rs. {provider.price}
              </p>

              <div className="buttons">
                <a
                  href={`https://wa.me/${provider.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>

                <a href={`tel:${provider.phone}`}>
                  <FaPhone />
                  Call
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    provider.area
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaMapMarkerAlt />
                  Maps
                </a>
              </div>

              <Link
                to={`/providers/${provider._id}`}
                className="profile-btn"
              >
                View Profile
              </Link>
            </div>
          ))
        ) : (
          <h2>No emergency providers available.</h2>
        )}
      </div>
    </div>
  );
}

export default EmergencyProviders;