"use client";

import { ChatInterface } from "@/components/chat-ui";
import { personalities } from "@/constants/personality";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function ChatUI() {
  const searchParams = useSearchParams();
  const personalityId = searchParams.get("type");

  const personality = useMemo(
    () => personalities.find((p) => p.id === personalityId),
    [personalityId, searchParams],
  );

  if (!personality) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-medium">
        No personality found
      </div>
    );
  }

  return <ChatInterface personality={personality} />;
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatUI />
    </Suspense>
  );
}
