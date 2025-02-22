import { useState } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ConversationStatus from "@/components/ConversationStatus";
import VolumeControl from "@/components/VolumeControl";
import ConversationHistory from "@/components/ConversationHistory";
import FlightConnection from "@/components/FlightConnection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "api";
  content: string;
}

const Index = () => {
  const [volume, setVolume] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const flightData = [{
    flights: [
      {
        airline: "Finnair",
        departure_airport: {
          id: "WAW",
          name: "Warsaw Frederic Chopin",
          time: "2025-04-02 13:00"
        },
        arrival_airport: {
          id: "HEL",
          name: "Helsinki Airport",
          time: "2025-04-02 15:40"
        },
        duration: 100,
        flight_number: "AY 1144"
      },
      {
        airline: "Finnair",
        departure_airport: {
          id: "HEL",
          name: "Helsinki Airport",
          time: "2025-04-02 17:15"
        },
        arrival_airport: {
          id: "JFK",
          name: "John F. Kennedy International Airport",
          time: "2025-04-02 19:05"
        },
        duration: 530,
        flight_number: "AY 15"
      }
    ],
    price: 629,
    total_duration: 725,
    type: "Round trip"
  },
  {
    flights: [
      {
        airline: "Finnair",
        departure_airport: {
          id: "WAW",
          name: "Warsaw Frederic Chopin",
          time: "2025-04-03 10:00"
        },
        arrival_airport: {
          id: "JFK",
          name: "John F. Kennedy International Airport",
          time: "2025-04-03 14:30"
        },
        duration: 510,
        flight_number: "AY 123"
      }
    ],
    price: 549,
    total_duration: 510,
    type: "Direct"
  }];

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
      console.error(message)
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
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Control Panel */}
      <div className="w-1/5 bg-voyagr p-6 flex flex-col">
        <div>
          <h1 className="font-pixelify text-4xl text-white mb-8">Voyagr</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
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
      <div className="w-4/5 flex flex-col bg-black">
        {/* Upper part - Flight Connections */}
        <div className="h-1/2 border-b border-gray-800">
          <div className="relative h-full p-4">
            {flightData.map((flight, index) => (
              <div
                key={index}
                className="absolute inset-x-4 transform transition-all duration-300 ease-in-out"
                style={{
                  top: `${index * 8}px`,
                  zIndex: flightData.length - index,
                }}
              >
                <FlightConnection {...flight} />
              </div>
            ))}
          </div>
        </div>

        {/* Lower part - Transcription */}
        <div className="h-1/2 border-t border-gray-800 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ConversationHistory messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
