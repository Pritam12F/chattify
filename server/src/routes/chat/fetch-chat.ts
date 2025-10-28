import { Router, type Request, type Response } from "express";
import prisma from "../../db";

export const fetchChatRouter: Router = Router();

fetchChatRouter.get("/", async (req: Request, res: Response) => {
  const { chatId } = req.body;

  if (!chatId) {
    res
      .json({
        message: "No chat ID provided",
      })
      .status(402);

    return;
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  res.json({ chat });
});
