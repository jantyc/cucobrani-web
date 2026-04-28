import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchYearWithDataById } from "@/lib/fetch-years";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createPublicClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const year = await fetchYearWithDataById(supabase, supabaseUrl, id);
  if (!year) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(year, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
