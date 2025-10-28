"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type Personality = "elon"|"jordan"|"mrbeast";

interface ChatInterfaceProps {
  personality: Personality;
  onBack: () => void;
}

export function ChatInterface({ personality, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<
    { id: string; role: "USER" | "SYSTEM"; content: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        personality: personality,
        userQuery: inputRef.current?.value,
      }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      setMessages((prev) => [...prev, {id:}]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current?.value;
    if (!input?.trim()) return;
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:bg-secondary"
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
          {messages.length === 0 && (
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

          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.role === "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "USER"
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

          {status === "in_progress" && (
            <div className="mb-4 flex justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={`Message ${personality.name}...`}
              disabled={status === "in_progress"}
              className="flex-1 bg-background text-foreground"
            />
            <Button
              type="submit"
              disabled={status === "in_progress"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {status === "in_progress" ? (
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
