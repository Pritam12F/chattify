"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const useMessages = ({
  personality,
}: {
  personality: "elon" | "mrbeast" | "jordan";
}) => {
  const [messages, setMessages] = useState<
    { id: string; type: any; content: string; chatId: string }[]
  >([]);

  useEffect(() => {
    const fetchMessages = async () => {
      // alert(personality);
      const res = await axios.post("/api/get-messages", {
        personality,
      });

      setMessages(res.data.messages);
    };

    fetchMessages();
  }, [personality]);

  return { messages };
};
