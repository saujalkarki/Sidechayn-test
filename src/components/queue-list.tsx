import type { Song } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QueueListProps {
  queue: Song[];
  onRemove: (songId: string | number) => void;
  onJumpTo: (songId: string | number) => void;
}

export function QueueList({ queue, onRemove, onJumpTo }: QueueListProps) {
  if (queue.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">Queue is empty</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Up Next ({queue.length} songs)
      </h3>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {queue.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => onJumpTo(song.id)}
            >
              <div className="w-6 text-sm text-muted-foreground text-center">
                {index + 1}
              </div>

              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={song.coverImage || "/placeholder.svg"}
                  alt={`${song.album} cover`}
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{song.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {song.artist}
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {song.genre}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(song.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
