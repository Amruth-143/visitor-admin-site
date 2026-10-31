"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Visit } from "@/lib/database";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);

  async function loadLogs(): Promise<boolean> {
    const response = await fetch("/api/logs", { cache: "no-store" });
    if (response.status === 401) { setAuthenticated(false); return false; }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load logs.");
    setVisits(data.visits);
    return true;
  }

  useEffect(() => {
    loadLogs().then((ok) => setAuthenticated(ok)).catch((problem) => {
      setAuthenticated(true);
      setError(problem instanceof Error ? problem.message : "Could not load logs.");
    }).finally(() => setChecking(false));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Login failed."); return; }
    setAuthenticated(true); setPassword("");
    try {
      const loaded = await loadLogs();
      if (!loaded) setAuthenticated(false);
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Could not load logs."); }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false); setVisits([]);
  }

  return <>
    <header className="topbar"><a href="/">Admin</a></header>
    <main className="admin-wrap">
      {checking ? <p className="muted">Loading…</p> : authenticated ? <>
        <div className="toolbar"><div><h1>Visitor logs</h1><div className="muted">{visits.length} most recent consented visits</div></div><button className="secondary" onClick={logout}>Log out</button></div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="table-wrap"><table><thead><tr><th>Time</th><th>Country</th><th>Region</th><th>City</th></tr></thead><tbody>
          {visits.map((visit) => <tr key={visit.id}><td>{new Date(visit.created_at).toLocaleString()}</td><td>{visit.country || "—"}</td><td>{visit.region || "—"}</td><td>{visit.city || "—"}</td></tr>)}
          {!visits.length && <tr><td colSpan={4} className="muted">No visits recorded yet.</td></tr>}
        </tbody></table></div>
      </> : <form className="login-card" onSubmit={login}>
        <h1>Admin login</h1>
        <label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Log in</button>
      </form>}
    </main>
  </>;
}
