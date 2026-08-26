const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

async function insert(table: string, payload: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase environment variables are not configured.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error((await response.text()) || `Supabase request failed: ${response.status}`);
}

async function insertWithFallback(table: string, payload: Record<string, unknown>, fallbackKey: string) {
  try {
    await insert(table, payload);
    return { persisted: true };
  } catch {
    try {
      const current = JSON.parse(localStorage.getItem(fallbackKey) || "[]");
      current.push({ ...payload, savedLocallyAt: new Date().toISOString() });
      localStorage.setItem(fallbackKey, JSON.stringify(current));
    } catch {}
    return { persisted: false };
  }
}

export function saveDemoAccount(data: { email: string; phone: string; displayName?: string }) {
  return insertWithFallback("demo_accounts", { email: data.email, phone: data.phone, display_name: data.displayName || null }, "artistas-demo-accounts-pending");
}

export function subscribeNewsletter(email: string) {
  return insertWithFallback("newsletter_subscribers", { email: email.trim().toLowerCase() }, "artistas-newsletter-pending");
}

export function createArtistInquiry(data: { artistId: string; artistName: string; requesterName: string; requesterEmail: string; requesterPhone: string; message: string }) {
  return insertWithFallback("artist_inquiries", { artist_id: data.artistId, artist_name: data.artistName, requester_name: data.requesterName, requester_email: data.requesterEmail, requester_phone: data.requesterPhone, message: data.message }, "artistas-inquiries-pending");
}
