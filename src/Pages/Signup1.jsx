import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation
import axios from "axios";
import "./CSS/Signup1.css"; // Import styles

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    organization_name: "",
    street_address: "",
    postal_zip: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form Data Before Sending:", formData); // Debugging
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register-user", formData);
      console.log("Response from API:", response);
  } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
  }
};
  

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-subtitle">
          By signing up, you agree to the Terms of Service.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" placeholder="Your name" onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" placeholder="Your email" onChange={handleChange} required />

          <label>Password</label>
          <div className="password-group">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Repeat" onChange={handleChange} required />
          </div>

          <label>Phone Number</label>
          <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />

          <h3 className="restaurant-title">Restaurant Details</h3>

          <label>Organization Name*</label>
          <input type="text" name="organization_name" placeholder="Organization Name" onChange={handleChange} required />

          <label>Street Address*</label>
          <input type="text" name="street_address" placeholder="Street Address" onChange={handleChange} required />

          <label>Postal / ZIP</label>
          <input type="text" name="postal_zip" placeholder="ZIP Code" onChange={handleChange} />

          <label>City</label>
          <input type="text" name="city" placeholder="City" onChange={handleChange} />

          <label>Country</label>
          <input type="text" name="country" placeholder="Country" onChange={handleChange} />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="social-text">OR</p>
        <div className="social-icons">
          <span className="icon facebook">F</span>
          <span className="icon twitter">T</span>
          <span className="icon google">G+</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
