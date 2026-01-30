"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Personality } from "@/constants/personality";
import { useMessages } from "@/hooks/use-messages";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useRouter } from "next/navigation";

interface ChatInterfaceProps {
  personality: Personality;
}

export function ChatInterface({ personality }: ChatInterfaceProps) {
  const [userInput, setUserInput] = useState("");
  const [actualUserInput, setActualUserInput] = useState("");
  const [newMessages, setNewMessages] = useState<
    { id?: string; type: "USER" | "ASSISSTANT"; content: string }[]
  >([]);
  const router = useRouter();

  const { messages: existingMessages } = useMessages({
    personality: personality.id,
  });

  const allMessages = useMemo(() => {
    let temp;

    if (existingMessages?.length > 0) {
      return [...existingMessages, ...newMessages];
    }
    return [...newMessages];
  }, [newMessages, existingMessages]);

  const { isLoading, reply } = useChat({
    personalityId: personality.id,
    userInput: actualUserInput,
  });

  useEffect(() => {
    if (!reply) return;

    setNewMessages((prev) => [...prev, { content: reply, type: "ASSISSTANT" }]);
  }, [reply]);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-secondary cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xl">
              {personality.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">
                {personality.name}
              </h2>
              <p className="text-sm text-muted-foreground">AI Personality</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {allMessages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
                {personality.avatar}
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Start a conversation with {personality.name}
                </h3>
                <p className="text-balance text-muted-foreground">
                  {personality.description}
                </p>
              </div>
            </div>
          )}

          {allMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.type === "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.type === "USER"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && allMessages?.length > 0 && (
            <div className="mb-4 flex justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <form className="flex gap-2">
            <Input
              placeholder={`Message ${personality.name}...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setActualUserInput(userInput);
                  setNewMessages((prev) => [
                    ...prev,
                    { content: userInput, type: "USER" },
                  ]);
                  setUserInput("");
                }
              }}
              type={"text"}
              className="flex-1 bg-background text-foreground"
            />
            <Button
              type="button"
              onClick={() => {
                setActualUserInput(userInput);
                setNewMessages((prev) => [
                  ...prev,
                  { content: userInput, type: "USER" },
                ]);
                setUserInput("");
              }}
              disabled={isLoading && allMessages?.length > 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading && allMessages?.length > 0 ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
