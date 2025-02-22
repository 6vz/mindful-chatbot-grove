
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationStatusProps {
  status: "connected" | "disconnected";
  isSpeaking: boolean;
}

const ConversationStatus = ({ status, isSpeaking }: ConversationStatusProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Badge
        variant="outline"
        className={cn(
          "transition-all duration-300",
          status === "connected"
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-gray-50 text-gray-700 border-gray-300"
        )}
      >
        {status === "connected" ? "Connected" : "Disconnected"}
      </Badge>
      {status === "connected" && (
        <Badge
          variant="outline"
          className={cn(
            "transition-all duration-300",
            isSpeaking
              ? "bg-blue-50 text-blue-700 border-blue-300"
              : "bg-gray-50 text-gray-700 border-gray-300"
          )}
        >
          {isSpeaking ? "Speaking" : "Listening"}
        </Badge>
      )}
    </div>
  );
};

export default ConversationStatus;
