
import { Hotel, Star, Wifi, Car, Pool, Dumbbell, Coffee, Bus } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transportation {
  duration: string;
  type: string;
}

interface NearbyPlace {
  name: string;
  transportations: Transportation[];
}

interface HotelProps {
  name: string;
  hotel_class: string;
  amenities: string[];
  check_in_time: string;
  check_out_time: string;
  rate_per_night: {
    lowest: string;
    extracted_lowest: number;
  };
  nearby_places: NearbyPlace[];
  overall_rating: number;
  eco_certified?: boolean;
}

const HotelCard = ({
  name,
  hotel_class,
  amenities,
  check_in_time,
  check_out_time,
  rate_per_night,
  nearby_places,
  overall_rating,
  eco_certified
}: HotelProps) => {
  const stars = parseInt(hotel_class);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 text-white h-full flex flex-col hover:translate-y-1 transition-transform duration-200 hover:bg-gray-900/70">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hotel className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white truncate">{name}</h2>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-400">
              ({overall_rating.toFixed(1)})
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-yellow-400">{rate_per_night.lowest}</div>
          <div className="text-xs text-gray-400">per night</div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Check-in:</span>
          <span>{check_in_time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Check-out:</span>
          <span>{check_out_time}</span>
        </div>
      </div>

      <div className="flex-1">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-sm text-yellow-400 hover:underline">
              View amenities
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
            <ScrollArea className="h-[200px] w-full pr-4">
              <div className="space-y-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    {amenity}
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
            <button className="text-sm text-yellow-400 hover:underline">
              Nearby places
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-900/95 border-gray-800">
            <ScrollArea className="h-[200px] w-full pr-4">
              <div className="space-y-4">
                {nearby_places.map((place, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-white mb-1">{place.name}</div>
                    <div className="space-y-1">
                      {place.transportations.map((transport, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-400">
                          {transport.type === "Walking" ? (
                            <span>🚶‍♂️</span>
                          ) : transport.type === "Public transport" ? (
                            <Bus className="w-3 h-3" />
                          ) : (
                            <Car className="w-3 h-3" />
                          )}
                          {transport.duration}
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

      {eco_certified && (
        <Badge className="mt-3 bg-green-600/20 text-green-400 hover:bg-green-600/30 w-fit">
          Eco Certified
        </Badge>
      )}
    </div>
  );
};

export default HotelCard;
