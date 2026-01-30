import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ip = (
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  ).split(",")[0];

  try {
    const user = await prisma.user.findFirst({ where: { id: ip } });

    if (user) {
      throw new Error("User already exists");
    }

    const createdUser = await prisma.user.create({ data: { id: ip } });

    return NextResponse.json({ createdUser });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
