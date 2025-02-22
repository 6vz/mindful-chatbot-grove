
import { format } from "date-fns";
import { Plane } from "lucide-react";

interface Airport {
  id: string;
  name: string;
  time: string;
}

interface Flight {
  airline: string;
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: number;
  flight_number: string;
}

interface FlightConnectionProps {
  flights: Flight[];
  price: number;
  total_duration: number;
  type: string;
}

const FlightConnection = ({ flights, price, total_duration, type }: FlightConnectionProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 text-white hover:translate-y-1 transition-transform duration-200 hover:bg-gray-900/70">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-voyagr">{type}</h2>
        <span className="text-lg font-bold">${price}</span>
      </div>

      <div className="space-y-3">
        {flights.map((flight, index) => (
          <div key={index} className="border-l border-voyagr pl-3">
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-voyagr font-medium">{flight.airline}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{flight.flight_number}</span>
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
              <div>
                <div className="font-medium text-sm">{flight.departure_airport.id}</div>
                <div className="text-xs text-gray-400">{formatDateTime(flight.departure_airport.time)}</div>
              </div>

              <div className="flex flex-col items-center px-2">
                <Plane className="w-3 h-3 text-voyagr rotate-90" />
                <div className="text-[10px] text-gray-400">{formatDuration(flight.duration)}</div>
              </div>

              <div>
                <div className="font-medium text-sm">{flight.arrival_airport.id}</div>
                <div className="text-xs text-gray-400">{formatDateTime(flight.arrival_airport.time)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-400">
        <div>
          Total: <span className="text-white">{formatDuration(total_duration)}</span>
        </div>
        <div>
          {flights.length} {flights.length === 1 ? 'flight' : 'flights'}
        </div>
      </div>
    </div>
  );
};

export default FlightConnection;
