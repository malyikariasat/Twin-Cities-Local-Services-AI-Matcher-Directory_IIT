import { Link } from "react-router-dom";
import "./EmergencyBanner.css";

function EmergencyBanner() {
  return (
    <section className="emergency">
      <div className="emergency-content">

        <div>
          <h2>🚨 Need Help Urgently?</h2>

          <p>
            Find verified plumbers, electricians, AC technicians and other
            emergency service providers available near your area.
          </p>
        </div>

        <Link to="/emergency">
          <button className="emergency-btn">
            Emergency Services
          </button>
        </Link>

      </div>
    </section>
  );
}

export default EmergencyBanner;