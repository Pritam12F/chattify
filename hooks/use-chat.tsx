"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const useChat = ({
  personalityId,
  userInput,
}: {
  personalityId: "elon" | "jordan" | "mrbeast";
  userInput: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchReply = async () => {
      if (!userInput) return;

      try {
        setIsLoading(true);
        const res = await axios.post("/api/chat", { userInput, personalityId });
        setIsLoading(false);
        setReply(res.data.reply);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    fetchReply();
  }, [personalityId, userInput]);

  return { isLoading, reply };
};
