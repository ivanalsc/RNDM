import Link from "next/link"
import { BookOpen, Film, Home, Music, User } from "lucide-react"

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2 font-serif text-xl font-medium text-gray-900">
        <span className="hidden sm:inline-block">RNDM</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center text-sm font-medium text-gray-900 transition-colors hover:text-gray-600">
          <Home className="mr-1 h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/movies"
          className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          <Film className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Movies</span>
        </Link>
        <Link
          href="/books"
          className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          <BookOpen className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Books</span>
        </Link>
        <Link
          href="/music"
          className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          <Music className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Music</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          <User className="mr-1 h-4 w-4" />
          <span className="hidden md:inline-block">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

