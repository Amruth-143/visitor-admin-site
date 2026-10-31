"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem("visitor-consent");
    if (choice === "accepted" && !sessionStorage.getItem("visit-recorded")) {
      recordVisit();
    } else if (!choice) {
      setShowConsent(true);
    }
  }, []);

  async function recordVisit() {
    try {
      const response = await fetch("/api/visit", { method: "POST" });
      if (response.ok) sessionStorage.setItem("visit-recorded", "yes");
    } catch { /* Analytics should not affect the blank page. */ }
  }

  function choose(accepted: boolean) {
    localStorage.setItem("visitor-consent", accepted ? "accepted" : "declined");
    setShowConsent(false);
    if (accepted) void recordVisit();
  }

  return <>
    <header className="topbar"><a href="/admin">Admin</a></header>
    <main className="blank" />
    {showConsent && <aside className="consent" aria-label="Visitor statistics consent">
      <p>May this site save one visit with an approximate country, region, and city based on your IP address? It does not save your IP address or use GPS. Your choice is stored in this browser.</p>
      <div className="actions">
        <button onClick={() => choose(true)}>Allow</button>
        <button className="secondary" onClick={() => choose(false)}>Decline</button>
      </div>
    </aside>}
  </>;
}
