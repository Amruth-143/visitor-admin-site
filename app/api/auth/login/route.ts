import { createSessionToken, credentialsMatch, sessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (typeof username !== "string" || typeof password !== "string" || !credentialsMatch(username, password)) {
      return Response.json({ error: "Invalid username or password." }, { status: 401 });
    }
    return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(createSessionToken()), "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Admin login configuration error:", error);
    return Response.json({ error: "Admin login is not configured." }, { status: 500 });
  }
}
