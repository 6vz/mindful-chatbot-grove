import { Hotel, Star, Wifi, Car, Dumbbell, Coffee, Bus } from "lucide-react";
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
  price: {
    per_night: string;
    per_night_value: number;
    total: string;
    total_value: number;
  };
  nearby_places: NearbyPlace[];
  overall_rating: number;
}

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase();
  if (lowerAmenity.includes('wifi')) return <Wifi className="w-3 h-3" />;
  if (lowerAmenity.includes('coffee') || lowerAmenity.includes('breakfast')) return <Coffee className="w-3 h-3" />;
  if (lowerAmenity.includes('parking')) return <Car className="w-3 h-3" />;
  if (lowerAmenity.includes('fitness') || lowerAmenity.includes('gym')) return <Dumbbell className="w-3 h-3" />;
  return null;
};

const HotelCard = ({
  name,
  hotel_class,
  amenities,
  check_in_time,
  check_out_time,
  price,
  nearby_places,
  overall_rating,
}: HotelProps) => {
  const stars = parseInt(hotel_class);

  return (
    <div className="bg-gray-900/50 w-full backdrop-blur-sm rounded-lg p-3 text-white h-full flex flex-col hover:translate-y-1 transition-transform duration-200 hover:bg-gray-900/70">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hotel className="w-4 h-4 text-voyagr" />
            <h2 className="text-base font-semibold text-white truncate">{name}</h2>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-voyagr fill-voyagr" />
            ))}
            <span className="ml-1 text-xs text-gray-400">
              ({overall_rating.toFixed(1)})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-2 text-xs">
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
        <ScrollArea className="h-[100px] w-full pr-4">
          <div className="flex flex-wrap gap-1.5">
            {amenities.map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              return (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 flex items-center gap-1 text-[11px] px-2 py-0.5 h-5 whitespace-nowrap"
                >
                  {icon}
                  {amenity}
                </Badge>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-700/50">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-xs text-voyagr hover:underline">
              Nearby places
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="w-80 bg-gray-900/95 border-gray-800">
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

      <div className="text-right mt-1">
        <div className="text-base font-bold text-voyagr">{price.per_night}</div>
        <div className="text-[10px] text-gray-400">per night</div>
        <div className="text-xs text-gray-400">{price.total} total</div>
      </div>
    </div>
  );
};

export default HotelCard;
