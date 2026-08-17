import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
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
      const { data } = await axios.get(
        "http://localhost:5000/api/providers"
      );

      const emergencyProviders = data.filter(
        (provider) =>
          provider.verified &&
          provider.availability === "Available Today"
      );

      setProviders(emergencyProviders);
    } catch (error) {
      console.log(error);
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

        {providers.map((provider) => (

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

            <p>
              ⭐ {provider.rating}
            </p>

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
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.area)}`}
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

        ))}

      </div>

    </div>
  );
}

export default EmergencyProviders;