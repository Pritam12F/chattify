import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers["authorization"];

  if (!authToken) {
    res.json({ message: "Auth token not provided" }).status(403);

    return;
  }

  try {
    const userData = jwt.verify(authToken, process.env.JWT_SECRET!) as any;

    req.headers["userId"] = userData.userId;
    next();
  } catch (e) {
    console.error(e);

    res.json({ message: "Invalid token" });
  }
};
