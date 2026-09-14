import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma/client";

const updateStatusSchema = z.object({
  id: z.string().min(1, "id wajib diisi"),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid request body.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id, status } = parsed.data;

  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: { status: status as ListingStatus },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("[api/admin/update-status] failed to update listing:", error);
    return NextResponse.json({ success: false, message: "Listing not found or update failed." }, { status: 404 });
  }
}
