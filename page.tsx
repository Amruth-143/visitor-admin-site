"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [showConsent, setShowConsent] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState("");

  useEffect(() => {
    const choice = localStorage.getItem("visitor-consent");
    if (choice === "accepted" && !sessionStorage.getItem("visit-recorded")) {
      void recordVisit(true);
    } else if (!choice) {
      setShowConsent(true);
    }
  }, []);

  async function recordVisit(showResult = false) {
    try {
      const response = await fetch("/api/visit", { method: "POST" });
      if (response.ok) {
        sessionStorage.setItem("visit-recorded", "yes");
        if (showResult) setTrackingMessage("Thanks — your visit was recorded.");
      } else if (showResult) {
        const result = await response.json().catch(() => ({}));
        setTrackingMessage(result.error || "Your visit could not be recorded. The site owner should check the database setup.");
      }
    } catch {
      if (showResult) setTrackingMessage("Your visit could not be recorded. Check your connection and try again.");
    }
  }

  function choose(accepted: boolean) {
    localStorage.setItem("visitor-consent", accepted ? "accepted" : "declined");
    setShowConsent(false);
    if (accepted) void recordVisit(true);
    else setTrackingMessage("No visit was recorded.");
  }

  return <>
    <header className="topbar"><a href="/admin">Admin</a></header>
    <main className="blank" />
    {trackingMessage && <div className="consent" role="status">{trackingMessage}</div>}
    {showConsent && <aside className="consent" aria-label="Visitor statistics consent">
      <p>May this site save one visit with an approximate country, region, and city based on your IP address? It does not save your IP address or use GPS. Your choice is stored in this browser.</p>
      <div className="actions">
        <button onClick={() => choose(true)}>Allow</button>
        <button className="secondary" onClick={() => choose(false)}>Decline</button>
      </div>
    </aside>}
  </>;
}
