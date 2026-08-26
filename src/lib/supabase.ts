const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://whsrmezqiguwkjltonox.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_lxHolYzkSfx_MFm6PAPSOQ_pgy3TDYq";

async function insert(table: string, payload: Record<string, unknown>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed: ${response.status}`);
  }
}

export function saveDemoAccount(data: {
  email: string;
  phone: string;
  displayName?: string;
}) {
  return insert("demo_accounts", {
    email: data.email,
    phone: data.phone,
    display_name: data.displayName || null,
  });
}

export function createArtistInquiry(data: {
  artistId: string;
  artistName: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  message: string;
}) {
  return insert("artist_inquiries", {
    artist_id: data.artistId,
    artist_name: data.artistName,
    requester_name: data.requesterName,
    requester_email: data.requesterEmail,
    requester_phone: data.requesterPhone,
    message: data.message,
  });
}
