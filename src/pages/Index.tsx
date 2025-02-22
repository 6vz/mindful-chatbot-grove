
import { useState } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ConversationStatus from "@/components/ConversationStatus";
import VolumeControl from "@/components/VolumeControl";
import ConversationHistory from "@/components/ConversationHistory";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [volume, setVolume] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Connected",
        description: "Ready to start conversation",
      });
    },
    onError: (error) => {
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
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: messageContent
      }]);
    },
    onSpeechStart: () => {
      // Optional: Add any specific handling when the user starts speaking
    },
    onSpeechEnd: (transcript) => {
      if (transcript) {
        setMessages(prev => [...prev, { 
          role: "user", 
          content: typeof transcript === 'object' ? JSON.stringify(transcript) : transcript 
        }]);
      }
    },
  });

  const handleStartConversation = async () => {
    try {
      await conversation.startSession({
        agentId: "jnvvXwb0VcfpApNQH9mK",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    await conversation.setVolume({ volume: newVolume });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Control Panel */}
      <div className="w-1/3 bg-voyagr p-6 flex flex-col">
        <h1 className="font-pixelify text-4xl text-white mb-8">Voyagr</h1>
        
        <div className="flex-1 flex flex-col justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-20 h-20 bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 mb-6"
            onClick={
              conversation.status === "connected"
                ? handleEndConversation
                : handleStartConversation
            }
          >
            {conversation.status === "connected" ? (
              <MicOff className="w-8 h-8 text-voyagr" />
            ) : (
              <Mic className="w-8 h-8 text-voyagr" />
            )}
          </Button>
        </div>

        <div className="mt-auto space-y-4">
          <ConversationStatus 
            status={conversation.status === "disconnecting" ? "disconnected" : conversation.status} 
            isSpeaking={conversation.isSpeaking} 
          />
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>

      {/* Right Side - Conversation */}
      <div className="w-2/3 bg-black p-6">
        <ConversationHistory messages={messages} />
      </div>
    </div>
  );
};

export default Index;
