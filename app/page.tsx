"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { personalities, Personality } from "@/constants/personality";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Home() {
  const navigate = useRouter();

  useEffect(() => {
    const addUser = async () => {
      const res = await axios.post("/api/add-user");

      if (res.status === 200) {
        toast.success("User has been added!");
      } else {
        toast.info("User found!");
      }
    };

    addUser();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="font-sans text-5xl font-bold tracking-tight text-foreground">
              Chattify
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Chat with AI personalities of history's greatest minds. Select a
            personality below to start your conversation.
          </p>
        </div>

        {/* Personality Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personalities.map((personality: Personality) => (
            <Card
              key={personality.id}
              className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              onClick={() => {
                navigate.push(`/chat?type=${personality.id}`);
              }}
            >
              <CardHeader>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl">
                    {personality.avatar}
                  </div>
                  <CardTitle className="text-xl text-card-foreground">
                    {personality.name}
                  </CardTitle>
                </div>
                <CardDescription className="leading-relaxed text-muted-foreground">
                  {personality.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Sparkles className="h-4 w-4" />
                  <span>Start chatting</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
