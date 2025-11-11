import React from 'react';

export const PatentClaims = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-12 font-serif">
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-6">CLAIMS</h2>
        
        {/* Independent Claim 1 */}
        <div className="mb-6">
          <p className="font-bold mb-2">1. A method for generating rotating virtual payment card credentials, comprising:</p>
          <div className="ml-6 space-y-2">
            <p>(a) establishing a cryptographic link between a virtual payment card and a master funding account;</p>
            <p>(b) generating a first set of payment credentials including a card number, expiration date, and card verification value (CVV);</p>
            <p>(c) assigning a predetermined time-based expiration interval to said first set of credentials;</p>
            <p>(d) monitoring elapsed time since credential generation;</p>
            <p>(e) automatically generating a second set of payment credentials upon expiration of said predetermined interval;</p>
            <p>(f) invalidating said first set of credentials concurrent with generation of said second set;</p>
            <p>(g) repeating steps (c) through (f) continuously during card lifecycle.</p>
          </div>
        </div>

        {/* Dependent Claims */}
        <div className="mb-4">
          <p><strong>2.</strong> The method of claim 1, wherein said predetermined time-based expiration interval is between 30 and 60 seconds.</p>
        </div>

        <div className="mb-4">
          <p><strong>3.</strong> The method of claim 1, further comprising locking said virtual payment card to a specific merchant identifier, preventing use at unauthorized merchants.</p>
        </div>

        <div className="mb-4">
          <p><strong>4.</strong> The method of claim 1, wherein said card verification value (CVV) is dynamically generated using a time-based cryptographic algorithm.</p>
        </div>

        <div className="mb-4">
          <p><strong>5.</strong> The method of claim 1, further comprising real-time validation of credentials against a secure validation server prior to transaction authorization.</p>
        </div>

        {/* Independent Claim 2 */}
        <div className="mb-6 mt-8">
          <p className="font-bold mb-2">6. A system for preventing payment card fraud through dynamic credential rotation, comprising:</p>
          <div className="ml-6 space-y-2">
            <p>(a) a credential generation module configured to create time-limited virtual card numbers;</p>
            <p>(b) a rotation engine configured to automatically expire and regenerate credentials at predetermined intervals;</p>
            <p>(c) a merchant locking module configured to restrict card usage to specified vendors;</p>
            <p>(d) a validation server configured to authenticate credentials in real-time;</p>
            <p>(e) a fraud detection module configured to monitor transaction patterns and block suspicious activity.</p>
          </div>
        </div>

        <div className="mb-4">
          <p><strong>7.</strong> The system of claim 6, wherein said rotation engine operates without requiring user intervention.</p>
        </div>

        <div className="mb-4">
          <p><strong>8.</strong> The system of claim 6, wherein expired credentials are permanently invalidated and cannot be reactivated.</p>
        </div>

        <div className="mb-4">
          <p><strong>9.</strong> The system of claim 6, further comprising a user interface displaying current valid credentials and time remaining until rotation.</p>
        </div>

        <div className="mb-4">
          <p><strong>10.</strong> The system of claim 6, wherein said system maintains backward compatibility with existing payment card networks.</p>
        </div>

        {/* Independent Claim 3 */}
        <div className="mb-6 mt-8">
          <p className="font-bold mb-2">11. A non-transitory computer-readable medium storing instructions that, when executed by a processor, cause the processor to:</p>
          <div className="ml-6 space-y-2">
            <p>(a) link a virtual payment card to a master account;</p>
            <p>(b) generate time-limited payment credentials;</p>
            <p>(c) automatically rotate said credentials at predetermined intervals;</p>
            <p>(d) validate credentials in real-time during transactions;</p>
            <p>(e) prevent use of expired credentials.</p>
          </div>
        </div>

        <div className="mb-4">
          <p><strong>12.</strong> The computer-readable medium of claim 11, wherein credential rotation occurs every 30-60 seconds.</p>
        </div>

        <div className="mb-4">
          <p><strong>13.</strong> The computer-readable medium of claim 11, further comprising instructions to lock credentials to specific merchant identifiers.</p>
        </div>

        <div className="mb-4">
          <p><strong>14.</strong> The computer-readable medium of claim 11, wherein said instructions implement cryptographic algorithms for secure credential generation.</p>
        </div>

        <div className="mb-4">
          <p><strong>15.</strong> The computer-readable medium of claim 11, further comprising instructions to log all credential rotations for audit purposes.</p>
        </div>
      </section>
    </div>
  );
};
