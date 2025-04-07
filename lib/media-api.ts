// This is a mock API service that simulates fetching data from external APIs
// In a real application, you would replace these with actual API calls

// Mock data for movies
const movieData = [
  {
    id: "m1",
    title: "Everything Everywhere All at Once",
    creator: "Daniels",
    coverUrl: "/placeholder.svg?height=200&width=150&text=EEAAO",
  },
  {
    id: "m2",
    title: "The Grand Budapest Hotel",
    creator: "Wes Anderson",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TGBH",
  },
  {
    id: "m3",
    title: "Parasite",
    creator: "Bong Joon-ho",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Parasite",
  },
  {
    id: "m4",
    title: "Inception",
    creator: "Christopher Nolan",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Inception",
  },
  {
    id: "m5",
    title: "The Shawshank Redemption",
    creator: "Frank Darabont",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TSR",
  },
  {
    id: "m6",
    title: "Pulp Fiction",
    creator: "Quentin Tarantino",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Pulp+Fiction",
  },
  {
    id: "m7",
    title: "The Dark Knight",
    creator: "Christopher Nolan",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TDK",
  },
  {
    id: "m8",
    title: "Fight Club",
    creator: "David Fincher",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Fight+Club",
  },
]

// Mock data for books
const bookData = [
  {
    id: "b1",
    title: "The Midnight Library",
    creator: "Matt Haig",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TML",
  },
  {
    id: "b2",
    title: "Klara and the Sun",
    creator: "Kazuo Ishiguro",
    coverUrl: "/placeholder.svg?height=200&width=150&text=KATS",
  },
  {
    id: "b3",
    title: "To Kill a Mockingbird",
    creator: "Harper Lee",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TKAM",
  },
  { id: "b4", title: "1984", creator: "George Orwell", coverUrl: "/placeholder.svg?height=200&width=150&text=1984" },
  {
    id: "b5",
    title: "The Great Gatsby",
    creator: "F. Scott Fitzgerald",
    coverUrl: "/placeholder.svg?height=200&width=150&text=TGG",
  },
  {
    id: "b6",
    title: "Pride and Prejudice",
    creator: "Jane Austen",
    coverUrl: "/placeholder.svg?height=200&width=150&text=P%26P",
  },
  {
    id: "b7",
    title: "The Hobbit",
    creator: "J.R.R. Tolkien",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Hobbit",
  },
  {
    id: "b8",
    title: "Harry Potter and the Sorcerer's Stone",
    creator: "J.K. Rowling",
    coverUrl: "/placeholder.svg?height=200&width=150&text=HP",
  },
]

// Mock data for music
const musicData = [
  {
    id: "mu1",
    title: "Circles",
    creator: "Mac Miller",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Circles",
  },
  {
    id: "mu2",
    title: "After Hours",
    creator: "The Weeknd",
    coverUrl: "/placeholder.svg?height=200&width=150&text=After+Hours",
  },
  {
    id: "mu3",
    title: "Abbey Road",
    creator: "The Beatles",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Abbey+Road",
  },
  {
    id: "mu4",
    title: "Thriller",
    creator: "Michael Jackson",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Thriller",
  },
  {
    id: "mu5",
    title: "Dark Side of the Moon",
    creator: "Pink Floyd",
    coverUrl: "/placeholder.svg?height=200&width=150&text=DSOTM",
  },
  {
    id: "mu6",
    title: "Back to Black",
    creator: "Amy Winehouse",
    coverUrl: "/placeholder.svg?height=200&width=150&text=B2B",
  },
  {
    id: "mu7",
    title: "Nevermind",
    creator: "Nirvana",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Nevermind",
  },
  {
    id: "mu8",
    title: "Rumours",
    creator: "Fleetwood Mac",
    coverUrl: "/placeholder.svg?height=200&width=150&text=Rumours",
  },
]

// Function to simulate API search
export async function searchMedia(
  mediaType: "movie" | "book" | "music",
  query: string,
): Promise<Array<{ id: string; title: string; creator: string; coverUrl: string }>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let dataSource
  switch (mediaType) {
    case "movie":
      dataSource = movieData
      break
    case "book":
      dataSource = bookData
      break
    case "music":
      dataSource = musicData
      break
    default:
      dataSource = []
  }

  // Filter data based on query
  if (!query) return []

  const lowerCaseQuery = query.toLowerCase()
  return dataSource.filter(
    (item) => item.title.toLowerCase().includes(lowerCaseQuery) || item.creator.toLowerCase().includes(lowerCaseQuery),
  )
}

// In a real application, you would implement these API calls:
// For movies: TMDB API (https://developers.themoviedb.org/3)
// For books: Google Books API (https://developers.google.com/books)
// For music: Spotify API (https://developer.spotify.com/documentation/web-api/)

