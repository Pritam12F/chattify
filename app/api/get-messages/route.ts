import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip");

  try {
    const body = await req.json();

    const messages = await prisma.chat.findFirst({
      where: {
        personality:
          body.personality === "elon"
            ? "ELON"
            : body.personality === "mrbeast"
            ? "MR_BEAST"
            : "JORDAN",
        userId: ip!,
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (e) {
    console.error(e);

    return NextResponse.json({
      error: e instanceof Error ? e.message : "Error fetching messages",
    });
  }
}
