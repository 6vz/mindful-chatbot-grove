
import { Hotel, Star } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

interface NearbyPlace {
  name: string;
  transportations: {
    duration: string;
    type: string;
  }[];
}

interface HotelProps {
  name: string;
  hotel_class: string;
  amenities: string[];
  check_in_time: string;
  check_out_time: string;
  price: {
    lowest: string;
    extracted_lowest: number;
  };
  nearby_places: NearbyPlace[];
  overall_rating: number;
}

const HotelCard = ({ name, hotel_class, amenities, check_in_time, check_out_time, price, nearby_places, overall_rating }: HotelProps) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 text-white h-full flex flex-col hover:translate-y-1 transition-transform duration-200 hover:bg-gray-900/70">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-voyagr" />
          <h2 className="text-lg font-semibold text-white">{name}</h2>
        </div>
        <span className="text-lg font-bold text-voyagr">{price.lowest}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(parseInt(hotel_class.split('-')[0]))].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <span className="text-sm text-gray-400">({overall_rating}/5)</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="text-gray-400">Check-in:</span> {check_in_time}
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Check-out:</span> {check_out_time}
        </div>
      </div>

      <div className="flex-1">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-sm text-voyagr hover:underline">
              View {amenities.length} amenities
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
            <ScrollArea className="h-[200px] w-full pr-4">
              <div className="space-y-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    • {amenity}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-sm text-voyagr hover:underline">
              Nearby places
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
            <ScrollArea className="h-[200px] w-full pr-4">
              <div className="space-y-3">
                {nearby_places.map((place, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-white">{place.name}</div>
                    <div className="text-gray-400 text-xs space-y-1">
                      {place.transportations.map((transport, i) => (
                        <div key={i}>
                          {transport.type}: {transport.duration}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default HotelCard;
