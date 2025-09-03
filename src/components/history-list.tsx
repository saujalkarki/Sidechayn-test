import type { Song } from "@/types/music";
import { Card } from "@/components/ui/card";

interface HistoryListProps {
  history: Song[];
}

export function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">No recent history</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Recently Played ({history.length})
      </h3>

      <div className="space-y-2">
        {history.map((song, index) => (
          <div
            key={`${song.id}-${index}`}
            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30"
          >
            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={song.coverImage || "/placeholder.svg"}
                alt={`${song.album} cover`}
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-sm">{song.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {song.artist}
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                {song.genre}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
