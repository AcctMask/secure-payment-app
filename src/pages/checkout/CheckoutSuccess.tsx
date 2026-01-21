import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CheckoutSuccess: React.FC = () => {
  const [status, setStatus] = useState<"verifying" | "ok" | "error">("verifying");
  const [message, setMessage] = useState<string>("Verifying your membership…");

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage("Missing session_id. Please contact support.");
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-checkout-session", {
          body: { sessionId },
        });

        if (error) throw error;

        if (data?.memberData) {
          // Store so AppContext can pick it up on the homepage
          localStorage.setItem("memberData", JSON.stringify(data.memberData));
        }

        // Optional: clean the URL
        url.search = "";
        window.history.replaceState({}, "", url.toString());

        setStatus("ok");
        setMessage("Membership verified. Redirecting…");

        // Send them into the app (member area/home)
        window.location.href = "/";
      } catch (e: any) {
        console.error("verify-checkout-session failed:", e);
        setStatus("error");
        setMessage(e?.message || "Failed to verify membership. Please try again.");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", color: "white" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Checkout Success</h1>
      <p style={{ opacity: 0.85 }}>{message}</p>
      {status === "error" && (
        <button
          style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10 }}
          onClick={() => (window.location.href = "/")}
        >
          Back to App
        </button>
      )}
    </div>
  );
};

export default CheckoutSuccess;

