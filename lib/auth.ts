import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function credentialsMatch(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) throw new Error("Set ADMIN_USERNAME and ADMIN_PASSWORD.");
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

export function createSessionToken() {
  const payload = `${Date.now()}`;
  return `${payload}.${signature(payload)}`;
}

export async function hasAdminSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [timestamp, suppliedSignature, extra] = token.split(".");
  if (!timestamp || !suppliedSignature || extra) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_SECONDS * 1000 || issuedAt > Date.now() + 60_000) return false;
  try { return safeEqual(suppliedSignature, signature(timestamp)); } catch { return false; }
}

export function sessionCookie(token: string, maxAge = MAX_AGE_SECONDS) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export const expiredSessionCookie = () => sessionCookie("", 0);
