
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationStatusProps {
  status: "connected" | "disconnected" | "connecting";
  isSpeaking: boolean;
}

const ConversationStatus = ({ status, isSpeaking }: ConversationStatusProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Badge
        variant="outline"
        className={cn(
          "transition-all duration-300 border-white text-white",
          status === "connected"
            ? "bg-white/10"
            : status === "connecting"
            ? "bg-white/5"
            : "bg-white/5"
        )}
      >
        {status === "connected" 
          ? "Connected" 
          : status === "connecting"
          ? "Connecting..."
          : "Disconnected"}
      </Badge>
      {status === "connected" && (
        <Badge
          variant="outline"
          className={cn(
            "transition-all duration-300 border-white text-white",
            isSpeaking
              ? "bg-white/10"
              : "bg-white/5"
          )}
        >
          {isSpeaking ? "Speaking" : "Listening"}
        </Badge>
      )}
    </div>
  );
};

export default ConversationStatus;
