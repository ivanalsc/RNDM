import { BookOpen, Film, Music } from "lucide-react"

interface UserStatsProps {
  moviesCount: number
  booksCount: number
  musicCount: number
}

export function UserStats({ moviesCount, booksCount, musicCount }: UserStatsProps) {
  const totalCount = moviesCount + booksCount + musicCount

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="text-2xl font-medium">{totalCount}</p>
        <p className="text-sm text-muted-foreground">Total Entries</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
        <div className="flex items-center gap-1 mb-1">
          <Film className="h-4 w-4 text-purple-500" />
          <p className="text-2xl font-medium">{moviesCount}</p>
        </div>
        <p className="text-sm text-muted-foreground">Movies/TV</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
        <div className="flex items-center gap-1 mb-1">
          <BookOpen className="h-4 w-4 text-amber-500" />
          <p className="text-2xl font-medium">{booksCount}</p>
        </div>
        <p className="text-sm text-muted-foreground">Books</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
        <div className="flex items-center gap-1 mb-1">
          <Music className="h-4 w-4 text-teal-500" />
          <p className="text-2xl font-medium">{musicCount}</p>
        </div>
        <p className="text-sm text-muted-foreground">Music</p>
      </div>
    </div>
  )
}

