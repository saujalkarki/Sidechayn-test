import { usePlayer } from "@/hooks/use-player";
import { GenreFilter } from "@/components/genre-filter";
import { NowPlaying } from "@/components/now-playing";
import { QueueList } from "@/components/queue-list";
import { HistoryList } from "@/components/history-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

function App() {
  const {
    selectedGenres,
    current,
    queue,
    history,
    isLoading,
    lowSongWarning,
    allGenres,
    toggleGenre,
    clearGenres,
    next,
    back,
    removeFromQueue,
    jumpTo,
  } = usePlayer();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading Music Library...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Preparing your queue
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">
            Music Player Queue System
          </h1>
        </div>

        {lowSongWarning && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Not enough songs match these filters; showing all available songs
              in the queue.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <GenreFilter
              allGenres={allGenres}
              selectedGenres={selectedGenres}
              onToggleGenre={toggleGenre}
              onClearGenres={clearGenres}
            />

            <HistoryList history={history} />
          </div>

          <div>
            <NowPlaying
              current={current}
              onNext={next}
              onBack={back}
              canGoBack={history.length > 0}
            />
          </div>

          <div>
            <QueueList
              queue={queue}
              onRemove={removeFromQueue}
              onJumpTo={jumpTo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
