
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
    <ScrollArea className="h-[200px] w-full rounded-md border bg-white p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            Your conversation will appear here
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationHistory;
