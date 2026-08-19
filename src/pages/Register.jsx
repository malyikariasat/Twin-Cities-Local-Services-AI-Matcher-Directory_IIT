import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    category: "",
    area: "",
    whatsapp: "",
    experience: "",
    price: "",
    availability: "Available Today",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      accountType === "provider" &&
      (!formData.category ||
        !formData.area ||
        !formData.price ||
        !formData.description)
    ) {
      setError(
        "Please fill in all required provider information."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...formData,
          role: accountType,
        }
      );

      alert(
        accountType === "provider"
          ? "Provider account created successfully! 🎉"
          : "Account created successfully! 🎉"
      );

      console.log(response.data);

      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-icon">🏠</div>

          <h1>Create Account</h1>

          <p>
            Join Twin Cities AI and find trusted local
            services easily.
          </p>
        </div>

        {/* Account Type */}
        <div className="account-type">
          <label>Account Type</label>

          <div className="account-type-buttons">

            <button
              type="button"
              className={
                accountType === "user"
                  ? "type-btn active"
                  : "type-btn"
              }
              onClick={() =>
                handleAccountTypeChange("user")
              }
            >
              👤 User
            </button>

            <button
              type="button"
              className={
                accountType === "provider"
                  ? "type-btn active"
                  : "type-btn"
              }
              onClick={() =>
                handleAccountTypeChange("provider")
              }
            >
              🛠️ Service Provider
            </button>

          </div>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="03XXXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          {/* Provider Information */}

          {accountType === "provider" && (
            <div className="provider-registration">

              <h3>🛠️ Provider Information</h3>

              <div className="form-group">
                <label>Service Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Service
                  </option>

                  <option value="Plumber">
                    Plumber
                  </option>

                  <option value="Electrician">
                    Electrician
                  </option>

                  <option value="Tutor">
                    Tutor
                  </option>

                  <option value="AC Technician">
                    AC Technician
                  </option>

                  <option value="Cleaner">
                    Cleaner
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Area / Location</label>

                <input
                  type="text"
                  name="area"
                  placeholder="e.g. G-11 Islamabad"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Number</label>

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="03XXXXXXXXX"
                  value={formData.whatsapp}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Experience</label>

                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 5 Years"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Starting Price (PKR)</label>

                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 2000"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability</label>

                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Available Today">
                    Available Today
                  </option>

                  <option value="Available Tomorrow">
                    Available Tomorrow
                  </option>

                  <option value="Available on Weekends">
                    Available on Weekends
                  </option>

                  <option value="Not Available">
                    Not Available
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Service Description</label>

                <textarea
                  name="description"
                  placeholder="Describe your services..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : accountType === "provider"
              ? "Create Provider Account"
              : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;