import Link from "next/link"
import { BookOpen, Film, Home, Music, User } from "lucide-react"

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2 font-serif text-xl font-medium">
        <span className="hidden sm:inline-block">RNDM</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
          <Home className="mr-1 h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/movies"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Film className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Movies</span>
        </Link>
        <Link
          href="/books"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <BookOpen className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Books</span>
        </Link>
        <Link
          href="/music"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Music className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Music</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <User className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

