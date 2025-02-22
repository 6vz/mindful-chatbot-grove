
import { useState, useRef, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ConversationStatus from "@/components/ConversationStatus";
import VolumeControl from "@/components/VolumeControl";
import ConversationHistory from "@/components/ConversationHistory";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "api";
  content: string;
}

const Index = () => {
  const [volume, setVolume] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const transcriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [messages]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to conversation");
      toast({
        title: "Connected",
        description: "Ready to start conversation",
      });
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onMessage: (message) => {
      const messageContent = typeof message === 'object' 
        ? message.message || JSON.stringify(message)
        : String(message);
      
      console.log(`${message.role} message:`, messageContent);
      
      setMessages(prev => [...prev, { 
        role: message.source === "user" ? "user" : "assistant", 
        content: messageContent
      }]);
    },
    onSpeechStart: () => {
      console.log("Speech started");
    },
  });

  const handleStartConversation = async () => {
    try {
      console.log("Starting conversation session...");
      await conversation.startSession({
        agentId: "jnvvXwb0VcfpApNQH9mK",
        dynamicVariables: {
          user_name: "Aleksander Nawalny",
        }
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  const handleEndConversation = async () => {
    console.log("Ending conversation session...");
    await conversation.endSession();
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    console.log("Volume changed to:", newVolume);
    setVolume(newVolume);
    await conversation.setVolume({ volume: newVolume });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Control Panel */}
      <div className="w-1/4 bg-voyagr p-6 flex flex-col relative">
        <div className="mb-8">
          <h1 className="font-pixelify text-4xl text-white">Voyagr</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "rounded-full w-20 h-20 bg-white hover:bg-gray-100",
              "transition-all duration-500 ease-in-out transform hover:scale-110",
              "shadow-lg hover:shadow-xl",
              conversation.status === "connected" && !conversation.isSpeaking && "animate-pulse-subtle",
              conversation.status === "connected" && conversation.isSpeaking && [
                "shadow-[0_0_30px_#FF6122]",
                "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
              ]
            )}
            onClick={
              conversation.status === "connected"
                ? handleEndConversation
                : handleStartConversation
            }
          >
            <div className={cn(
              "transition-transform duration-500 ease-in-out",
              conversation.status === "connected" && "hover:rotate-180"
            )}>
              {conversation.status === "connected" ? (
                <MicOff className="w-8 h-8 text-voyagr" />
              ) : (
                <Mic className="w-8 h-8 text-voyagr" />
              )}
            </div>
          </Button>

          <ConversationStatus 
            status={conversation.status === "disconnecting" ? "disconnected" : conversation.status} 
            isSpeaking={conversation.isSpeaking} 
          />
        </div>

        <div className="mt-auto">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>

      {/* Right Side - Split View */}
      <div className="w-3/4 flex flex-col bg-black">
        {/* Upper part - Planes placeholder */}
        <div className="flex-1 p-6 border-b border-gray-800">
          <div className="h-full flex items-center justify-center text-gray-500">
            planes here :333
          </div>
        </div>

        {/* Lower part - Transcription */}
        <div className="h-1/6 border-t border-gray-800">
          <div ref={transcriptionRef} className="h-full overflow-y-auto">
            <ConversationHistory messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
