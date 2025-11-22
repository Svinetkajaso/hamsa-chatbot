import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Send } from "lucide-react";
import { GlitterEffect } from "./GlitterEffect";
import { RainEffect } from "./RainEffect";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hej! Ställ mig en fråga så hjälper jag dig! Jag är bra på matte, svenska, NO, SO, engelska... och jag kan till och med lära dig hebreiska om du vill! 🦈",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [hamsaVisible, setHamsaVisible] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const rainInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerRain();
      }
    }, 20000);

    return () => clearInterval(rainInterval);
  }, []);

  const triggerRain = () => {
    setIsRaining(true);
    setHamsaVisible(false);

    const grumbles = [
      "Oj, regn! Jag simmar iväg en stund, för mycket vatten uppifrån! Snart tillbaka! 🌊",
      "Regn igen?! Jag tar en djupdykning, vi ses snart! 💦",
      "För blött även för en haj! Simmar ner lite, vänta här! 🌧️",
    ];

    const randomGrumble = grumbles[Math.floor(Math.random() * grumbles.length)];

    setMessages(prev => [...prev, {
      role: "assistant",
      content: randomGrumble,
    }]);

    setTimeout(() => {
      setIsRaining(false);
      setHamsaVisible(true);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Jag är tillbaka! Regnet slutade. Nu kan vi fortsätta - hade du någon fråga? Kanske om tuggummi? 😊",
      }]);
    }, 5000);
  };

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-hamsa`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        throw new Error("För många förfrågningar, vänta lite och försök igen.");
      }
      if (resp.status === 402) {
        throw new Error("Betalning krävs. Kontakta supporten.");
      }
      throw new Error("Kunde inte starta chatt-stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !hamsaVisible) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    if (newCount % 5 === 0 && Math.random() > 0.5) {
      setTimeout(() => triggerRain(), 2000);
    }

    try {
      await streamChat(userMessage);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Oj, något gick fel! Kanske för mycket ström i vattnet? Försök igen! 🦈",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-4 relative overflow-hidden">
      <GlitterEffect />
      <RainEffect isActive={isRaining} />
      
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-4 border-primary/30 overflow-hidden bg-card/95 backdrop-blur">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center relative">
            {hamsaVisible && (
              <div className="text-6xl mb-2 animate-wave">🦈</div>
            )}
            {!hamsaVisible && (
              <div className="text-6xl mb-2 opacity-30">💨</div>
            )}
            <h1 className="text-3xl font-bold text-primary-foreground">
              Hamsa Hammarhaj
            </h1>
            <p className="text-primary-foreground/90 mt-1">
              347 år gammal • Expert på allt • Tuggummifantast
            </p>
          </div>

          <ScrollArea ref={scrollRef} className="h-[500px] p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground border-2 border-primary/20"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground p-4 rounded-2xl shadow-lg border-2 border-primary/20">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="p-6 bg-muted/30 border-t-4 border-primary/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={hamsaVisible ? "Ställ en fråga till Hamsa..." : "Vänta, Hamsa simmar iväg..."}
                disabled={isLoading || !hamsaVisible}
                className="flex-1 bg-input border-2 border-primary/50 focus:border-primary shadow-inner"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !hamsaVisible}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {questionCount > 8 && (
            <div className="px-6 pb-4 text-center text-sm text-muted-foreground">
              Hamsa älskar att svara på frågor! Fråga om tuggummisamlingen också! 🦈
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
