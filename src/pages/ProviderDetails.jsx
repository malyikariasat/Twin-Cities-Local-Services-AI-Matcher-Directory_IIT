import { useState, useEffect } from "react";

import {
  FaWhatsapp,
  FaArrowLeft,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaBolt,
  FaCheckCircle,
  FaStar,
  FaRobot,
  FaAward,
  FaClock
} from "react-icons/fa";

import { useParams, Link } from "react-router-dom";

import axios from "axios";

import ReviewForm from "../components/ReviewForm";

import "./ProviderDetails.css";
function ProviderDetails() {

const { id } = useParams();

const [provider,setProvider]=useState(null);

const [reviews,setReviews]=useState([]);

const [similarProviders,setSimilarProviders]=useState([]);

const [loading,setLoading]=useState(true);
const fetchProvider = async () => {

try{

const {data}=await axios.get(
`http://localhost:5000/api/providers/${id}`
);

setProvider(data);

}catch(error){

console.log(error);

}

};

const fetchReviews = async () => {

try{

const {data}=await axios.get(
`http://localhost:5000/api/reviews/${id}`
);

setReviews(data);

}catch(error){

console.log(error);

}

};

const fetchSimilarProviders = async()=>{

try{

const {data}=await axios.get(
"http://localhost:5000/api/providers"
);

const filtered=data.filter(
item=>item._id!==id
);

setSimilarProviders(filtered.slice(0,3));

}catch(error){

console.log(error);

}

};
useEffect(()=>{

const loadData=async()=>{

setLoading(true);

await Promise.all([

fetchProvider(),

fetchReviews(),

fetchSimilarProviders()

]);

setLoading(false);

};

loadData();

},[id]);
if(loading){

return(

<div className="loading-page">

<h2>

Loading Provider...

</h2>

</div>

);

}
if(!provider){

return(

<div className="provider-details">

<h1>

Provider Not Found

</h1>

<Link to="/providers">

<button className="back-btn">

<FaArrowLeft/>

Back

</button>

</Link>

</div>

);

}
const getEstimatedDistance = (area) => {
  const distances = {
    "G-6 Islamabad": "5.2 km",
    "G-7 Islamabad": "4.6 km",
    "G-8 Islamabad": "3.8 km",
    "G-9 Islamabad": "3.2 km",
    "G-10 Islamabad": "2.7 km",
    "G-11 Islamabad": "2.1 km",
    "F-6 Islamabad": "6.4 km",
    "F-7 Islamabad": "5.8 km",
    "F-10 Islamabad": "2.9 km",
    "I-8 Islamabad": "4.3 km",
    "Bahria Town": "12.5 km",
    "DHA Phase 2": "14.2 km",
    "Gulberg Greens": "10.8 km",
    "Saddar Rawalpindi": "11.4 km",
    "Chaklala Scheme 3": "13.1 km",
  };

  return distances[area] || "Nearby";
};
const message=`Hello ${provider.name},

I found your profile on Twin Cities Local Services.

I need ${provider.category} service.

Please let me know your availability.

Thank you.`;
return(

<div className="provider-details">

<div className="details-card">

<div className="top-badge">

<FaAward/>

AI Top Recommendation

</div>

<div className="match-score">

<span>

95%

</span>

<small>

AI Match

</small>

</div>

<div className="details-header">

<div>

<h1>

{provider.name}

</h1>

{provider.verified && (

<span className="verified">

<FaCheckCircle/>

Verified Provider

</span>

)}

</div>
</div>
{/* Information Grid */}

<div className="info-grid">

  <div className="info-box">
    <FaMapMarkerAlt />
    <div>
      <h4>Location</h4>
      <p>{provider.area}</p>
    </div>
  </div>

  <div className="info-box">
    <FaMoneyBillWave />
    <div>
      <h4>Starting Price</h4>
      <p>Rs. {provider.price}</p>
    </div>
  </div>

  <div className="info-box">
    <FaBolt />
    <div>
      <h4>Response Time</h4>
      <p>{provider.responseTime}</p>
    </div>
  </div>

  <div className="info-box">
    <FaClock />
    <div>
      <h4>Availability</h4>
      <p>{provider.availability}</p>
    </div>
  </div>

</div>
<div className="info-box">
  📍
  <div>
    <h4>Distance</h4>
    <p>{getEstimatedDistance(provider.area)} away</p>
  </div>
</div>

{/* Provider Meta */}

<div className="provider-meta">

  <span>
    <FaStar />
    {provider.rating}
  </span>

  <span>
    {provider.reviews} Reviews
  </span>

  <span>
    {provider.experience}
  </span>

  <span>
    {provider.category}
  </span>

</div>

{/* AI Recommendation */}

<div className="ai-box">

  <h3>

    <FaRobot />

    Why AI Recommended?

  </h3>

  <p>

    This provider has one of the highest ratings,
    is verified, responds quickly and matches your
    requested location and budget.
    AI selected this provider because it offers
    the best overall value.

  </p>

</div>

{/* Description */}

<div className="description-box">

<h3>

About Provider

</h3>

<p>

{provider.description}

</p>

</div>

{/* Action Buttons */}

<div className="action-buttons">

<a

href={`https://wa.me/${provider.whatsapp}?text=${encodeURIComponent(message)}`}

target="_blank"

rel="noreferrer"

className="whatsapp-btn"

>

<FaWhatsapp />

WhatsApp

</a>

<a

href={`tel:${provider.phone}`}

className="call-btn"

>

<FaPhoneAlt />

Call

</a>
<a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    provider.area
  )}`}
  target="_blank"
  rel="noreferrer"
  className="map-btn"
>
  <FaMapMarkedAlt />
  Open in Google Maps
</a>

<Link

to="/providers"

className="back-btn"

>

<FaArrowLeft />

Back

</Link>

</div>

<hr/>

{/* Review Form */}

<ReviewForm

providerId={provider._id}

onReviewAdded={fetchReviews}

/>

<hr/>

{/* Customer Reviews */}

<div className="reviews-section">

<h2>

⭐ Customer Reviews

</h2>

{reviews.length===0?(

<div className="no-reviews">

No reviews yet.

</div>

):(

<div className="reviews-grid">

{reviews.map(review=>(

<div

className="review-card"

key={review._id}

>

<div className="review-top">

<h4>

{review.name}

</h4>

<span>

⭐ {review.rating}/5

</span>

</div>

<p>

{review.comment}

</p>

</div>

))}

</div>

)}

</div>

<hr/>

{/* Similar Providers */}

<div className="similar-section">

<h2>

You May Also Like

</h2>

<div className="similar-grid">

{similarProviders.map(item=>(

<div

className="similar-card"

key={item._id}

>

<div className="similar-top">

<h3>

{item.name}

</h3>

</div>

<p>

📍 {item.area}

</p>

<p>

⭐ {item.rating}

</p>

<p>

Rs. {item.price}

</p>

<Link

to={`/providers/${item._id}`}

>

<button>

View Details

</button>

</Link>

</div>

))}

</div>

</div>

</div>

</div>

);

}

export default ProviderDetails;