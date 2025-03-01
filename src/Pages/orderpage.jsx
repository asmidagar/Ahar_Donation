import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./CSS/orderpage.css"; // Ensure your CSS file is correctly located

const socket = io("http://localhost:5000");

const DeliveryOrders = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Fetch initial deliveries
    const fetchDeliveries = async () => {
      const response = await fetch("http://localhost:5000/api/deliveries");
      const data = await response.json();
      setDeliveries(data);
    };

    fetchDeliveries();

    // Listen for new delivery updates
    socket.on("newDelivery", (newDelivery) => {
      setDeliveries((prevDeliveries) => [...prevDeliveries, newDelivery]);
    });

    return () => {
      socket.off("newDelivery");
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div onClick={closeMenu}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          {/* Hamburger Button */}
          <div className="hamburger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="logo">Delivery Orders</div>
        </div>

        {/* Right side (Profile) */}
        <div className="nav-right">
          <div className="menu-container">
            <img
              src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
              alt="Profile"
              className="profile-pic"
            />
          </div>
        </div>
      </nav>

      {/* Dropdown Menu for Hamburger */}
      <div className={`hamburger-menu ${menuOpen ? "show" : ""}`}>
        <button className="menu-btn">Help</button>
        <button className="menu-btn">History</button>
        <button className="menu-btn">Logout</button>
      </div>

      {/* Orders Section */}
      <div className="orders-container">
        {deliveries.map((delivery) => (
          <div className="order-card" key={delivery.id}>
            <h3 className="restaurant-name">Delivery #{delivery.id}</h3>
            <p className="order-details">
              <strong>Status:</strong>
              <span className={`status ${delivery.status.toLowerCase()}`}>
                {delivery.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOrders;
