import type { Song } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkipBack, SkipForward } from "lucide-react";

interface NowPlayingProps {
  current: Song | null;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function NowPlaying({
  current,
  onNext,
  onBack,
  canGoBack,
}: NowPlayingProps) {
  if (!current) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">No song selected</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={current.coverImage || "/placeholder.svg"}
            alt={`${current.album} cover`}
            className="object-cover"
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-balance">{current.title}</h2>
          <p className="text-lg text-muted-foreground">{current.artist}</p>
          <p className="text-sm text-muted-foreground">{current.album}</p>
          <span className="inline-block px-2 py-1 text-xs bg-secondary rounded-full">
            {current.genre}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            disabled={!canGoBack}
            className="h-12 px-8"
          >
            Pre
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button onClick={onNext} size="lg" className="h-12 px-8">
            <SkipForward className="h-5 w-5 mr-2" />
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
