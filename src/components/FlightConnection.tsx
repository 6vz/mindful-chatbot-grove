
import { format, addMinutes } from "date-fns";
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
    return format(new Date(dateString), "HH:mm, MMM d");
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 text-white h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-voyagr">{type}</h2>
        <span className="text-xl font-bold">${price}</span>
      </div>

      <div className="space-y-6">
        {flights.map((flight, index) => (
          <div key={index} className="border-l-2 border-voyagr pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-voyagr font-medium">{flight.airline}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{flight.flight_number}</span>
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div>
                <div className="font-medium">{flight.departure_airport.id}</div>
                <div className="text-sm text-gray-400">{formatDateTime(flight.departure_airport.time)}</div>
                <div className="text-xs text-gray-500 truncate">{flight.departure_airport.name}</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <Plane className="w-4 h-4 text-voyagr rotate-90 mb-1" />
                <div className="text-xs text-gray-400">{formatDuration(flight.duration)}</div>
              </div>

              <div>
                <div className="font-medium">{flight.arrival_airport.id}</div>
                <div className="text-sm text-gray-400">{formatDateTime(flight.arrival_airport.time)}</div>
                <div className="text-xs text-gray-500 truncate">{flight.arrival_airport.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Total duration: <span className="text-white">{formatDuration(total_duration)}</span>
        </div>
        <div className="text-sm text-gray-400">
          {flights.length} {flights.length === 1 ? 'flight' : 'flights'}
        </div>
      </div>
    </div>
  );
};

export default FlightConnection;
