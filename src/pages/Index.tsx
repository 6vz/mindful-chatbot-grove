
import { useState } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import ConversationStatus from "@/components/ConversationStatus";
import VolumeControl from "@/components/VolumeControl";

const Index = () => {
  const [volume, setVolume] = useState(1);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/90 shadow-lg border-0">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Conversational AI</h1>
            <p className="text-sm text-gray-500">Click the microphone to start talking</p>
          </div>

          <ConversationStatus status={conversation.status} isSpeaking={conversation.isSpeaking} />
          
          <div className="flex flex-col items-center gap-6">
            <Button
              variant={conversation.status === "connected" ? "destructive" : "default"}
              size="lg"
              className="rounded-full w-16 h-16 transition-all duration-300 hover:scale-105"
              onClick={
                conversation.status === "connected"
                  ? handleEndConversation
                  : handleStartConversation
              }
            >
              {conversation.status === "connected" ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
