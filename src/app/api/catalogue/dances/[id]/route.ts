import { NextRequest, NextResponse } from "next/server";
import { updateDance } from "@/catalogue";
import { EDITOR, getLinedanceDb } from "@/server/write";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const { status, ...result } = await updateDance(await getLinedanceDb(), id, body, EDITOR);
  return NextResponse.json(result, { status });
}
