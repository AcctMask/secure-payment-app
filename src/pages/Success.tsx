import React, { useEffect, useState } from "react";

export default function Success() {
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");
  const [message, setMessage] = useState<string>("Verifying your payment…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("fail");
      setMessage("Missing session_id. Please try again from the checkout flow.");
      return;
    }

    // NOTE: verification is optional if you just want a simple success page.
    // If you have verify-checkout-session deployed, you can call it here.
    (async () => {
      try {
        // If your frontend uses Supabase URL env var, prefer that:
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          setStatus("ok");
          setMessage("Payment completed. (Verification skipped: VITE_SUPABASE_URL not set.)");
          return;
        }

        const res = await fetch(`${supabaseUrl}/functions/v1/verify-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data?.ok) {
          setStatus("ok");
          setMessage("Payment confirmed. Welcome!");
        } else {
          // Even if verification fails, user may have paid — keep messaging calm.
          setStatus("ok");
          setMessage("Payment completed. (Verification pending — you can close this page.)");
        }
      } catch {
        setStatus("ok");
        setMessage("Payment completed. (Verification pending — you can close this page.)");
      }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 720, width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          {status === "loading" ? "Processing…" : "Success"}
        </h1>
        <p style={{ marginTop: 12, lineHeight: 1.5 }}>{message}</p>
        <a href="/" style={{ display: "inline-block", marginTop: 16 }}>
          Return Home
        </a>
      </div>
    </div>
  );
}

