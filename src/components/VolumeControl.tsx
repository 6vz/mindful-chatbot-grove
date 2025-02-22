
import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-4 w-full max-w-[200px]">
      <Volume2 className="w-4 h-4 text-gray-500" />
      <Slider
        value={[volume]}
        onValueChange={onVolumeChange}
        max={1}
        step={0.1}
        className="cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;
