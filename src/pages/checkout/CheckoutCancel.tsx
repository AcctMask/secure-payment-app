import React from "react";

const CheckoutCancel: React.FC = () => {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", color: "white" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Checkout Canceled</h1>
      <p style={{ opacity: 0.85 }}>
        No worries — you weren’t charged. You can return to the app and try again anytime.
      </p>
      <button
        style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10 }}
        onClick={() => (window.location.href = "/")}
      >
        Back to App
      </button>
    </div>
  );
};

export default CheckoutCancel;

