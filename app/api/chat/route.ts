import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/open-ai";
import prisma from "@/lib/prisma";
import { personalities } from "@/constants/personality";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip");

  const { userInput, personalityId } = await req.json();

  try {
    const existingMessages = await prisma.chat.findFirst({
      where: {
        userId: ip!,
        personality:
          personalityId === "elon"
            ? "ELON"
            : personalityId === "mrbeast"
              ? "MR_BEAST"
              : "JORDAN",
      },
      include: {
        messages: true,
      },
    });

    if (!existingMessages) {
      const chatCreated = await prisma.chat.create({
        data: {
          userId: ip!,
          personality:
            personalityId === "elon"
              ? "ELON"
              : personalityId === "jordan"
                ? "JORDAN"
                : "MR_BEAST",
        },
      });

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: personalities.find((p) => p.id === personalityId)!
              .systemPrompt,
          },
          { role: "user", content: userInput },
        ],
      });

      await prisma.message.create({
        data: {
          chatId: chatCreated?.id,
          type: "USER",
          content: userInput as string,
        },
      });

      await prisma.message.create({
        data: {
          chatId: chatCreated?.id,
          type: "ASSISSTANT",
          content: chatCompletion!.choices[0].message.content!,
        },
      });

      return NextResponse.json({
        message: "Chat was successful",
        reply: chatCompletion?.choices[0].message.content,
      });
    }

    const existingMessagesWithRoles: {
      role: "user" | "assistant";
      content: string;
    }[] = existingMessages!.messages
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((m) => ({
        role: m.type === "USER" ? "user" : "assistant",
        content: m.content,
      }))!;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: personalities.find((p) => p.id === personalityId)!
            .systemPrompt,
        },
        ...(existingMessagesWithRoles ?? []),
        { role: "user", content: userInput },
      ],
    });

    await prisma.message.create({
      data: {
        chatId: existingMessages!.id,
        type: "USER",
        content: userInput as string,
      },
    });

    await prisma.message.create({
      data: {
        chatId: existingMessages!.id,
        type: "ASSISSTANT",
        content: chatCompletion!.choices[0].message.content!,
      },
    });

    return NextResponse.json({
      message: "Chat was successful",
      reply: chatCompletion?.choices[0].message.content,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Error chatting with LLM",
      },
      { status: 500 },
    );
  }
}
