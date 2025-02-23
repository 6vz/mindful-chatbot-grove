
import { useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ConversationStatus from "@/components/ConversationStatus";
import VolumeControl from "@/components/VolumeControl";
import ConversationHistory from "@/components/ConversationHistory";
import FlightConnection from "@/components/FlightConnection";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "api";
  content: string;
}

interface Flight {
  airline: string;
  departure_airport: {
    id: string;
    name: string;
    time: string;
  };
  arrival_airport: {
    id: string;
    name: string;
    time: string;
  };
  duration: number;
  flight_number: string;
}

interface FlightData {
  flights: Flight[];
  price: number;
  total_duration: number;
  type: string;
}

interface ApiResponse {
  flights: FlightData[];
  selected_flights: FlightData[];
}

const Index = () => {
  const [volume, setVolume] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchFlights = async () => {
      if (!conversationId) return;

      try {
        const response = await fetch(`https://11.azpekt.dev/get-conversation?conversation_id=${conversationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }

        const data: ApiResponse = await response.json();

        if (data.selected_flights && data.selected_flights.length > data.flights.length) {
          setFlightData(data.selected_flights);
        } else if (data.flights && data.flights.length > 0) {
          setFlightData(data.flights);
        } else {
          setFlightData([]);
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    if (conversationId) {
      fetchFlights();
      intervalId = setInterval(fetchFlights, 7000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [conversationId]);

  const conversation = useConversation({
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
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

      // If it's an assistant message and we have speech capabilities, start speaking
      if (message.source === "assistant" && conversation.status === "connected") {
        conversation.startSpeaking(); // Use startSpeaking instead of speak
      }
    },
    onSpeechStart: () => {
      console.log("Speech started");
    },
    onUserStartSpeaking: () => {
      console.log("User started speaking, pausing AI audio");
      if (conversation.isSpeaking) {
        conversation.stopSpeaking(); // Use stopSpeaking instead of pauseSpeaking
      }
    },
    onUserStopSpeaking: () => {
      console.log("User stopped speaking");
      // Speech will automatically resume for new messages via onMessage
    },
  });

  const getConversationId = async () => {
    try {
      const response = await fetch('https://11.azpekt.dev/open-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get conversation ID');
      }

      const data = await response.json();
      setConversationId(data.conversation_id);
      return data.conversation_id;
    } catch (error) {
      console.error('Error getting conversation ID:', error);
      toast({
        title: "Error",
        description: "Failed to get conversation ID",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleStartConversation = async () => {
    try {
      console.log("Starting conversation session...");
      const conversationId = await getConversationId();
      
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
        dynamicVariables: {
          conversation_id: conversationId
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
        <p className="text-xs text-CA4E1C font-pixelify mt-5">Session ID:<br />{conversationId}</p>
      </div>

      {/* Right Side - Split View */}
      <div className="w-4/5 flex flex-col bg-black">
        {/* Upper part - Flight Connections */}
        <div className="h-1/2 border-b border-gray-800">
          <ScrollArea className="h-full w-full">
            {flightData.length > 0 ? (
              <div className="flex h-full p-4 gap-4">
                {flightData.map((flight, index) => (
                  <div
                    key={`${flight.flights[0].flight_number}-${index}`}
                    className="w-[300px] h-full flex-none"
                  >
                    <FlightConnection {...flight} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-center italic">
               Calculating the force of impact on the runway of your Ryanair flight...<br />
               Please stay with us. We are working on it, admittedly slowly - but we are working.
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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
