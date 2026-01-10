import React from "react";

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Privacy Policy</h1>

      <p>
        Secure Purchase is a secure payments platform focused on protecting
        customers from fraud while keeping payments simple and transparent.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>Information we collect</h2>
      <ul>
        <li><b>Account information:</b> name, email address, and membership status</li>
        <li><b>Payment status:</b> confirmation that a membership payment completed through Stripe</li>
        <li><b>Usage and diagnostic data:</b> basic analytics and error logs to improve reliability</li>
      </ul>

      <p>
        <b>We do not collect or store</b> full credit card numbers, CVC codes,
        PINs, or bank account details. All sensitive payment data is handled
        directly by Stripe.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>How payments work</h2>
      <ul>
        <li><b>Stripe Checkout</b> processes membership payments</li>
        <li><b>Stripe Webhooks</b> notify our backend of payment and transaction events</li>
        <li><b>Stripe Issuing</b> (when enabled) provisions secure virtual cards for protected purchases</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>How we use your information</h2>
      <ul>
        <li>Manage your membership and account</li>
        <li>Display account status and activity</li>
        <li>Operate fraud-prevention features</li>
        <li>Improve performance, security, and support</li>
      </ul>

      <p><b>We do not sell your data.</b></p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>Transaction history</h2>
      <p>
        When secure card transactions are enabled, we store transaction records
        such as amount, merchant name, date, and status for transparency.
        Reusable card numbers are never stored.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>Data security</h2>
      <p>
        We use encrypted connections (HTTPS), restricted access controls, and
        server-side Stripe API calls. Stripe handles all PCI-regulated payment data.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>Data retention</h2>
      <p>
        We retain account and transaction records only as long as necessary to
        provide services and meet legal requirements. Deletion may be requested
        where permitted by law.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 24 }}>Contact</h2>
      <p>
        Questions? Contact us at <b>support@sp4all.com</b>.
      </p>
    </div>
  );
}

