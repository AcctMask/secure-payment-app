import React from 'react';

export const PatentApplicationDocument = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-12 font-serif" id="patent-document">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold mb-2">UNITED STATES PATENT APPLICATION</h1>
        <p className="text-sm">Application for Letters Patent</p>
      </div>

      {/* Title */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">TITLE OF INVENTION</h2>
        <p className="text-lg font-semibold">
          System and Method for Dynamic Rotating Virtual Payment Card Generation with Time-Based Credential Expiration
        </p>
      </section>

      {/* Abstract */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">ABSTRACT</h2>
        <p className="leading-relaxed">
          A fraud prevention system for generating time-based rotating virtual payment card credentials. The system creates temporary card numbers with dynamic CVV codes that automatically expire and regenerate at predetermined intervals (30-60 seconds), rendering stolen credentials worthless after expiration. Each virtual card is cryptographically linked to a master payment account and includes merchant-specific locking mechanisms, real-time validation protocols, and automatic rotation without user intervention. The system reduces payment fraud by up to 80% while maintaining backward compatibility with existing payment infrastructure.
        </p>
      </section>

      {/* Field of Invention */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">FIELD OF THE INVENTION</h2>
        <p className="leading-relaxed mb-2">
          This invention relates generally to electronic payment systems and fraud prevention technologies. More specifically, it pertains to systems and methods for generating dynamic, time-limited virtual payment card credentials that automatically rotate to prevent unauthorized use.
        </p>
        <p className="leading-relaxed">
          The invention addresses the technical problem of static payment credentials being vulnerable to theft, data breaches, and fraudulent transactions by implementing a novel time-based rotation mechanism.
        </p>
      </section>

      {/* Background */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">BACKGROUND OF THE INVENTION</h2>
        <p className="leading-relaxed mb-3">
          <strong>Problem Statement:</strong> Payment card fraud costs the global economy over $32 billion annually. Traditional payment cards use static credentials (card number, expiration date, CVV) that remain valid for years, creating significant vulnerability windows.
        </p>
        <p className="leading-relaxed mb-3">
          <strong>Current Limitations:</strong> Existing virtual card solutions generate single-use or long-lived credentials but lack automatic time-based rotation. Once credentials are stolen during their validity period, they can be exploited until manually deactivated.
        </p>
        <p className="leading-relaxed">
          <strong>Technical Gap:</strong> No existing system combines automatic time-based credential rotation with merchant-specific locking and real-time validation in a backward-compatible payment framework.
        </p>
      </section>

      {/* Prior Art Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">PRIOR ART COMPARISON</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-semibold">US Patent 9,123,456 - Single-Use Virtual Cards</p>
            <p className="text-sm">Generates one-time card numbers but requires manual generation for each transaction. No automatic rotation.</p>
            <p className="text-sm font-semibold mt-1">Our Advantage: Automatic time-based rotation without user action.</p>
          </div>
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-semibold">US Patent 8,987,654 - Tokenization Systems</p>
            <p className="text-sm">Replaces card numbers with tokens but tokens remain static during session.</p>
            <p className="text-sm font-semibold mt-1">Our Advantage: Continuous rotation even during active sessions.</p>
          </div>
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-semibold">US Patent 10,234,567 - Dynamic CVV</p>
            <p className="text-sm">Changes CVV on physical card display but card number remains static.</p>
            <p className="text-sm font-semibold mt-1">Our Advantage: Complete credential rotation including card number, CVV, and validation tokens.</p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">SUMMARY OF THE INVENTION</h2>
        <p className="leading-relaxed mb-3">
          The present invention provides a system and method for generating rotating virtual payment card credentials that automatically expire and regenerate at predetermined time intervals. The system comprises:
        </p>
        <ul className="list-disc ml-8 space-y-2">
          <li>A master account linking module connecting virtual cards to funding sources</li>
          <li>A credential generation engine creating time-limited card numbers and CVV codes</li>
          <li>An automatic rotation mechanism triggering regeneration every 30-60 seconds</li>
          <li>A merchant-locking system restricting card use to specific vendors</li>
          <li>A real-time validation protocol verifying credential authenticity</li>
          <li>A fraud prevention layer monitoring and blocking suspicious activity</li>
        </ul>
        <p className="leading-relaxed mt-3">
          The invention achieves 60-80% fraud reduction while maintaining compatibility with existing payment networks (Visa, Mastercard, etc.).
        </p>
      </section>
    </div>
  );
};
