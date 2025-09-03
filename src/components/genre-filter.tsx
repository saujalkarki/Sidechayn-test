import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GenreFilterProps {
  allGenres: string[];
  selectedGenres: Set<string>;
  onToggleGenre: (genre: string) => void;
  onClearGenres: () => void;
}

export function GenreFilter({
  allGenres,
  selectedGenres,
  onToggleGenre,
  onClearGenres,
}: GenreFilterProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Genres</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearGenres}
          disabled={selectedGenres.size === 0}
        >
          Clear Filters
        </Button>
      </div>

      <div className="space-y-3">
        {allGenres.map((genre) => (
          <div key={genre} className="flex items-center space-x-2">
            <Checkbox
              id={genre}
              checked={selectedGenres.has(genre)}
              onCheckedChange={() => onToggleGenre(genre)}
            />
            <label
              htmlFor={genre}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {genre}
            </label>
          </div>
        ))}
      </div>

      {selectedGenres.size > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedGenres.size} genre{selectedGenres.size !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}
    </Card>
  );
}
