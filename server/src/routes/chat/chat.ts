import { Router, type Request, type Response } from "express";
import { client } from "../../open-ai";
import { personalities } from "../../constants/personality";
import prisma from "../../db";

export const chatRouter: Router = Router();

chatRouter.post("/", (req: Request, res: Response) => {
  const { personalityId, chatId, latestMessage, existingMessages } = req.body;

  const personality = personalities.find((p) => p.id === personalityId);

  if (!personality && (!existingMessages || existingMessages.length === 0)) {
    res
      .json({
        message: "Personality ID not provided for new chat",
      })
      .status(402);

    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.flushHeaders?.();

  const response = client.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages:
      existingMessages && existingMessages.length > 0
        ? [...existingMessages, { role: "user", content: latestMessage }]
        : [
            { role: "system", content: personality?.systemPrompt },
            { role: "user", content: latestMessage },
          ],
  });

  response.then(async (chunk) => {
    let totalContent = "";

    for await (const c of chunk.toReadableStream()) {
      const content = JSON.parse(new TextDecoder().decode(c)).choices[0].delta
        .content;

      res.write(content);

      if (/^[.,!?;:]$/.test(content)) {
        totalContent += content;
      } else {
        totalContent += " " + content;
      }
    }

    await prisma.$transaction(async (t) => {
      t.message.create({
        data: {
          chatId: chatId as string,
          content: latestMessage,
          role: "USER",
        },
      });

      t.message.create({
        data: {
          chatId: chatId as string,
          content: totalContent,
          role: "ASSISSTANT",
        },
      });
    });

    res.end();
  });
});
