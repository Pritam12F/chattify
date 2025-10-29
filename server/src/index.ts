import express from "express";
import cors from "cors";
import { chatRouter } from "./routes/chat/chat";
import { createChatRouter } from "./routes/chat/create-chat";
import { fetchChatRouter } from "./routes/chat/fetch-chat";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello, Express Boilerplate!");
});

app.use("/api/chat", chatRouter);
app.use("/api/chat/create", createChatRouter);
app.use("/api/chat/fetch", fetchChatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
