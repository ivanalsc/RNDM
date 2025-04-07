interface MediaResult {
  id: string
  title: string
  creator: string
  coverUrl: string
}

export async function searchMedia(type: "movie" | "book" | "music", query: string): Promise<MediaResult[]> {
  switch (type) {
    case "movie":
      return searchMovies(query)
    case "book":
      return searchBooks(query)
    case "music":
      return searchMusic(query)
  }
}

async function searchMovies(query: string): Promise<MediaResult[]> {
  try {
    // Usamos la API de TMDb con una clave gratuita para desarrollo
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=1f54bd990f1cdfb230adb312546d765d&query=${encodeURIComponent(query)}&include_adult=false`
    )
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return []
    }

    return data.results
      .filter((result: any) => result.media_type === "movie" || result.media_type === "tv")
      .map((result: any) => ({
        id: result.id.toString(),
        title: result.title || result.name,
        creator: result.media_type === "movie" ? result.release_date?.split("-")[0] : "TV Series",
        coverUrl: result.poster_path 
          ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
          : "/placeholder.svg?height=200&width=150"
      }))
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

async function searchBooks(query: string): Promise<MediaResult[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
    )
    const data = await response.json()
    
    return data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      creator: item.volumeInfo.authors?.[0] || "Unknown Author",
      coverUrl: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=200&width=150"
    })) || []
  } catch (error) {
    console.error("Error searching books:", error)
    return []
  }
}

async function searchMusic(query: string): Promise<MediaResult[]> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=5`
    )
    const data = await response.json()
    
    return data.results?.map((album: any) => ({
      id: album.collectionId.toString(),
      title: album.collectionName,
      creator: album.artistName,
      coverUrl: album.artworkUrl100 || "/placeholder.svg?height=200&width=150"
    })) || []
  } catch (error) {
    console.error("Error searching music:", error)
    return []
  }
} 