# Music Player Queue System

A simple TypeScript utility for managing a music playback queue.  
It supports shuffling, filtering by genre, queue refilling, skipping, and navigating backward/forward between songs.  
The queue and history can also be persisted in `localStorage`.

## How to Install and Run

1. **Clone the repository** (or copy the source files into your project):

   git clone https://github.com/saujalkarki/Sidechayn-test.git
   cd Sidechayn-test

2. **Install dependencies** :

   npm install

3. **Build and run**:

   npm run dev

## Assumptions Made

- Each **song** has the following structure (defined in `Song` type):

  ```ts
  type Song = {
    id: string | number;
    title: string;
    artist: string;
    genre: string;
  };
  ```

- Genres are represented as strings, and filtering uses a `Set<string>` for efficient lookups.

- A **queue length target of 10 songs** is maintained at all times, unless fewer songs are available.

- **History length is capped at 3** songs (oldest songs get removed when limit is exceeded).

- When refilling:
  - Duplicate songs (present in current, history, or queue) are excluded.

## Bonus Features Implemented

- **Skip directly to a future song in the queue**  
  Allows users to jump forward without sequentially skipping.

- **Persist queue and history in localStorage**  
  Ensures that playback state is not lost across page reloads.
