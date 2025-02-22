
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  role: "user" | "assistant" | "api";
  content: string;
}

interface ConversationHistoryProps {
  messages: Message[];
}

const ConversationHistory = ({ messages }: ConversationHistoryProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-3rem)] w-full p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                message.role === "user" 
                  ? "bg-white" 
                  : message.role === "api" 
                  ? "bg-purple-500" 
                  : "bg-voyagr"
              )} />
              <span className="text-xs text-gray-500">
                {format(new Date(), "HH:mm:ss")}
              </span>
              <div className={cn(
                "flex-1 text-sm px-4 py-2 rounded-lg transition-all duration-300",
                message.role === "user" 
                  ? "bg-white/5 text-white" 
                  : message.role === "api"
                  ? "bg-purple-500/5 text-purple-300 font-mono" 
                  : "bg-voyagr/5 text-voyagr"
              )}>
                {message.role === "api" ? (
                  <pre className="whitespace-pre-wrap break-words">
                    {message.content}
                  </pre>
                ) : (
                  message.content
                )}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm animate-pulse">
            Your conversation log will appear here
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationHistory;
