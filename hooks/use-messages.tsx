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
      const res = await axios.get("/api/get-messages", {
        data: {
          personality,
        },
      });

      setMessages(res.data.messages);
    };

    fetchMessages();
  }, [personality]);

  return { messages };
};
