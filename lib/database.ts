export type Visit = { id: string; created_at: string; country: string | null; region: string | null; city: string | null };

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return { url: url.replace(/\/$/, ""), key };
}

export async function addVisit(fields: Omit<Visit, "id" | "created_at">) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/visitor_logs`, {
    method: "POST",
    // New Supabase secret keys are not JWTs. Send only as the apikey header.
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(fields),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database insert failed (${response.status}).`);
}

export async function getVisits(): Promise<Visit[]> {
  const { url, key } = config();
  const query = new URLSearchParams({ select: "id,created_at,country,region,city", order: "created_at.desc", limit: "500" });
  const response = await fetch(`${url}/rest/v1/visitor_logs?${query}`, {
    headers: { apikey: key },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database query failed (${response.status}).`);
  return response.json();
}
