import { addVisit } from "@/lib/database";

export const runtime = "nodejs";

function header(request: Request, name: string) {
  const value = request.headers.get(name)?.trim();
  if (!value || value.length > 120) return null;
  try { return decodeURIComponent(value); } catch { return value; }
}

export async function POST(request: Request) {
  // The UI calls this endpoint only after the visitor clicks Allow.
  if (request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ error: "Request rejected." }, { status: 403 });
  try {
    await addVisit({
      country: header(request, "x-vercel-ip-country"),
      region: header(request, "x-vercel-ip-country-region"),
      city: header(request, "x-vercel-ip-city"),
    });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not save visitor log:", error);
    return Response.json({ error: "Could not save the visit." }, { status: 503 });
  }
}
