import { hasAdminSession } from "@/lib/auth";
import { getVisits } from "@/lib/database";

export const runtime = "nodejs";

export async function GET() {
  if (!(await hasAdminSession())) return Response.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    return Response.json({ visits: await getVisits() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not load visitor logs:", error);
    return Response.json({ error: "Could not load logs. Check the database configuration." }, { status: 503 });
  }
}
