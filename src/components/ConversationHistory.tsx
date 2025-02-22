
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <div className={`w-2 h-2 mt-2 rounded-full ${
              message.role === "user" ? "bg-white" : "bg-voyagr"
            }`} />
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-white/10 text-white"
                  : "bg-voyagr/10 text-white"
              }`}
            >
              <p className="text-sm">{message.content}</p>
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
