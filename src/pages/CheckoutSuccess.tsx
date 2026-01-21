import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAppContext } from "@/contexts/AppContext";

const CheckoutSuccess: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setMemberData } = useAppContext();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-checkout-session", {
          body: { sessionId },
        });

        if (error) throw error;

        if (data?.memberData) {
          setMemberData(data.memberData);
        }

        navigate("/member", { replace: true });
      } catch (e) {
        console.error("Failed to verify checkout session:", e);
        navigate("/", { replace: true });
      }
    })();
  }, [params, navigate, setMemberData]);

  return (
    <div style={{ padding: 24, color: "white" }}>
      <h1>Finalizing your membership…</h1>
      <p>Please wait.</p>
    </div>
  );
};

export default CheckoutSuccess;

