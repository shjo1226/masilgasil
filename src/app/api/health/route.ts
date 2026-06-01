import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/server/storage";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: isSupabaseConfigured() ? "supabase" : "mock",
    timestamp: new Date().toISOString(),
  });
}
