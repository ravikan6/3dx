import React from "react";

const GiftPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "3rem", color: "#ff6347" }}>🎁 Surprise Gift Just for You! 🎁</h1>
      <p style={{ fontSize: "1.5rem", margin: "20px 0", color: "#555" }}>
        Thank you for visiting! We have a special gift waiting for you.
      </p>
      <button
        style={{
          padding: "15px 30px",
          fontSize: "1.2rem",
          color: "#fff",
          backgroundColor: "#0070f3",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => alert("Your gift is on its way!")}
      >
        Claim Your Gift
      </button>
    </div>
  );
};

export default GiftPage;
