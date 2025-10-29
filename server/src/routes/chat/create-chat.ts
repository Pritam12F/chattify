import { Router, type Request, type Response } from "express";
import { client } from "../../open-ai";
import { chatTitlePrompt } from "../../constants/chat-title";
import prisma from "../../db";

export const createChatRouter: Router = Router();

createChatRouter.post("/", async (req: Request, res: Response) => {
  const { initialPrompt } = req.body;

  if (!initialPrompt) {
    res
      .json({
        messaage: "No initial prompt provided",
      })
      .status(402);

    return;
  }

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: chatTitlePrompt },
      {
        role: "user",
        content: initialPrompt,
      },
    ],
  });

  const chat = await prisma.chat.create({
    data: {
      title: response.choices[0].message.content ?? "",
      userId: req.headers["userId"] as string,
    },
  });

  return res.json({
    message: "Chat was created!",
    chat,
  });
});
