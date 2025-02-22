
import { useState } from "react";
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
      
      // Check if the message is an API response
      const isApiResponse = typeof message === 'object' && 
        ('apiResponse' in message || 'rawResponse' in message);
      
      console.log(isApiResponse ? "API Response:" : "Assistant message:", messageContent);
      
      setMessages(prev => [...prev, { 
        role: isApiResponse ? "api" : "assistant", 
        content: isApiResponse ? JSON.stringify(message, null, 2) : messageContent
      }]);
    },
    onSpeechStart: () => {
      console.log("Speech started");
    },
    onSpeechEnd: (transcript) => {
      if (transcript) {
        const messageContent = typeof transcript === 'object' 
          ? JSON.stringify(transcript) 
          : transcript;
        
        console.log("User message:", messageContent);
        
        setMessages(prev => [...prev, { 
          role: "user", 
          content: messageContent
        }]);
      }
    },
  });

  const handleStartConversation = async () => {
    try {
      console.log("Starting conversation session...");
      await conversation.startSession({
        agentId: "jnvvXwb0VcfpApNQH9mK",
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
      <div className="w-2/5 bg-voyagr p-6 flex flex-col relative">
        <div className="flex justify-between items-start">
          <h1 className="font-pixelify text-4xl text-white mb-8">Voyagr</h1>
          <div className="flex items-end">
            <ConversationStatus 
              status={conversation.status === "disconnecting" ? "disconnected" : conversation.status} 
              isSpeaking={conversation.isSpeaking} 
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center">
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
        </div>

        <div className="mt-auto">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>

      {/* Right Side - Conversation */}
      <div className="w-3/5 bg-black p-6">
        <ConversationHistory messages={messages} />
      </div>
    </div>
  );
};

export default Index;
