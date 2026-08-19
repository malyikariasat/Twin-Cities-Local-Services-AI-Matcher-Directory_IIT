import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    role: "user",

    category: "",
    whatsapp: "",
    area: "",
    price: "",
    experience: "",
    availability: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert(
        formData.role === "provider"
          ? "Provider account created successfully! 🎉"
          : "Account created successfully! 🎉"
      );

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
            Join Twin Cities AI and connect with trusted local services.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Account Type */}
          <div className="form-group">
            <label>Account Type</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">
                Customer
              </option>

              <option value="provider">
                Service Provider
              </option>
            </select>
          </div>

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

          {formData.role === "provider" && (
            <>
              <div className="provider-section">
                <h3>Service Provider Information</h3>

                <p>
                  Add your service details so customers can find and
                  contact you.
                </p>
              </div>

              <div className="form-group">
                <label>Service Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a category
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
                <label>WhatsApp Number</label>

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="03XXXXXXXXX"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Area / Sector</label>

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
                <label>Starting Price</label>

                <input
                  type="text"
                  name="price"
                  placeholder="e.g. Rs. 2000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Experience</label>

                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 5 years"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability</label>

                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select availability
                  </option>

                  <option value="Available Today">
                    Available Today
                  </option>

                  <option value="Available Now">
                    Available Now
                  </option>

                  <option value="Available on Weekdays">
                    Available on Weekdays
                  </option>

                  <option value="Available on Weekends">
                    Available on Weekends
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Service Description</label>

                <textarea
                  name="description"
                  placeholder="Describe your services and experience..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : formData.role === "provider"
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