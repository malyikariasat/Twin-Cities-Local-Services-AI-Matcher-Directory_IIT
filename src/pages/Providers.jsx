import { useState, useEffect } from "react";

import ProviderCard from "../components/ProviderCard";
import Filters from "../components/Filters";
import API from "../services/api";
import "./Providers.css";

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [rating, setRating] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchProviders();
  }, [search, category, location, rating]);

  const fetchProviders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search);
      }

      if (category !== "All") {
        params.set("category", category);
      }

      if (location !== "All") {
        params.set("area", location);
      }

      if (rating !== "All") {
        params.set("rating", rating);
      }

      const { data } = await API.get(`/providers?${params.toString()}`);

      setProviders(data);
    } catch (error) {
      console.error("Fetch Providers Error:", error);

      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Backend already filtered the data
  let filteredProviders = [...providers];

  // Frontend Sorting
  switch (sortBy) {
    case "rating":
      filteredProviders.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    case "lowPrice":
      filteredProviders.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "highPrice":
      filteredProviders.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name":
      filteredProviders.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    default:
      break;
  }

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Loading Providers...
      </h2>
    );
  }

  return (
    <div className="providers-page">

      <div className="providers-header">

        <h1>Service Providers</h1>

        <p>
          Find trusted and verified professionals in
          Islamabad & Rawalpindi.
        </p>

      </div>

      <div className="providers-layout">

        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
          rating={rating}
          setRating={setRating}
        />

        <div className="providers-content">

          <div className="results-header">

            <h3>
              {filteredProviders.length} Providers Found
            </h3>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="default">
                Sort By
              </option>

              <option value="rating">
                Highest Rating
              </option>

              <option value="lowPrice">
                Lowest Price
              </option>

              <option value="highPrice">
                Highest Price
              </option>

              <option value="name">
                A - Z
              </option>

            </select>

          </div>

          <div className="providers-grid">

            {filteredProviders.length > 0 ? (

              filteredProviders.map((provider) => (

                <ProviderCard
                  key={provider._id}
                  provider={provider}
                />

              ))

            ) : (

              <h2 className="no-result">
                No providers found.
              </h2>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Providers;