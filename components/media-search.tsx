"use client"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Film, BookOpen, Music, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchMedia } from "@/lib/api"
import Image from "next/image"

interface MediaSearchProps {
  mediaType: "movie" | "book" | "music"
  onSelect: (media: { title: string; creator: string; coverUrl: string }) => void
}

export function MediaSearch({ mediaType, onSelect }: MediaSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; title: string; creator: string; coverUrl: string }>>([])
  const [selectedItem, setSelectedItem] = useState<{
    id: string
    title: string
    creator: string
    coverUrl: string
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset selected item when media type changes
  useEffect(() => {
    setSelectedItem(null)
  }, [mediaType])

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  // Fetch results when search query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await searchMedia(mediaType, searchQuery)
        console.log("Search results:", data)
        setResults(data)
      } catch (error) {
        console.error("Error searching media:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, mediaType])

  const handleSelect = (item: { id: string; title: string; creator: string; coverUrl: string }) => {
    console.log("Selected item:", item)
    
    // Update local state
    setSelectedItem(item)
    
    // Notify parent component
    onSelect({
      title: item.title,
      creator: item.creator,
      coverUrl: item.coverUrl
    })
    
    // Close popover
    setOpen(false)
    
    // Clear search query
    setSearchQuery("")
  }

  const getPlaceholder = () => {
    switch (mediaType) {
      case "movie":
        return "Search for a movie or TV show..."
      case "book":
        return "Search for a book..."
      case "music":
        return "Search for an album or song..."
    }
  }

  const getMediaIcon = () => {
    switch (mediaType) {
      case "movie":
        return <Film className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? (
            <div className="flex items-center gap-2">
              <Image
                src={selectedItem.coverUrl}
                alt={selectedItem.title}
                width={24}
                height={24}
                className="rounded-sm object-cover"
              />
              <span className="truncate">{selectedItem.title}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{getPlaceholder()}</span>
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="py-6 text-center text-sm">Searching...</div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-sm">No results found.</div>
            ) : (
              <div className="p-1">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                    onClick={() => handleSelect(item)}
                  >
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="rounded-sm object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.creator}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

