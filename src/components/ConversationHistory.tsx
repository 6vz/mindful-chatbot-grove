
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
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
            className={`flex items-start gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div 
              className={cn(
                "w-2 h-2 mt-2 rounded-full",
                message.role === "user" 
                  ? "bg-white" 
                  : "bg-voyagr animate-pulse"
              )} 
            />
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-white/10 text-white"
                  : "bg-voyagr/10 text-white"
              }`}
            >
              <p className="text-sm">
                <span className="font-semibold text-xs opacity-50 block mb-1">
                  {message.role === "user" ? "You" : "Assistant"}
                </span>
                {message.content}
              </p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            Your conversation will appear here
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationHistory;
