"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MediaEntry as SupabaseMediaEntry, getMediaEntries, deleteMediaEntry, toggleLike, createMediaEntry } from "@/lib/supabase"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Trash2, Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Comments } from "@/components/comments"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareDialog } from "@/components/share-dialog"
import { BookOpen, Film, Music } from "lucide-react"
import { FeedCard } from "@/components/feed-card"

type MediaType = "movie" | "book" | "music"

interface MediaEntry {
  id: string
  title: string
  creator: string
  type: MediaType
  comment: string
  coverUrl: string
  username: string
  likes_count?: number
  is_liked?: boolean
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<MediaType>("movie")
  const [title, setTitle] = useState("")
  const [creator, setCreator] = useState("")
  const [comment, setComment] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<MediaEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // En un entorno real, esto vendría de tu sistema de autenticación
  const currentUserId = "user-123"

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      // Obtener todas las entradas públicas
      const data = await getMediaEntries(currentUserId, true)
      
      // Transformar los datos para que sean compatibles con la interfaz MediaEntry de la página
      const transformedData = data.map(entry => ({
        id: entry.id || '',
        title: entry.title,
        creator: entry.creator,
        type: entry.media_type,
        comment: entry.comment,
        coverUrl: entry.cover_url,
        username: entry.user_id || 'anonymous',
        likes_count: entry.likes_count || 0,
        is_liked: entry.is_liked || false,
      }))
      
      setEntries(transformedData)
    } catch (error) {
      console.error("Error loading entries:", error)
      toast.error("Failed to load entries")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    try {
      setDeletingId(entryId)
      await deleteMediaEntry(entryId, currentUserId)
      setEntries(entries.filter(entry => entry.id !== entryId))
      toast.success("Entry deleted successfully")
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    } finally {
      setDeletingId(null)
    }
  }

  const handleLike = async (entry: MediaEntry) => {
    if (!currentUserId || !entry.id) return
    setLikingId(entry.id)
    try {
      const isLiked = await toggleLike(entry.id, currentUserId)
      
      // Actualizar el estado local
      setEntries(entries.map(e => {
        if (e.id === entry.id) {
          return {
            ...e,
            is_liked: isLiked,
            likes_count: isLiked 
              ? (e.likes_count || 0) + 1 
              : Math.max(0, (e.likes_count || 0) - 1)
          }
        }
        return e
      }))
      
      toast.success(isLiked ? "Liked successfully" : "Unliked successfully")
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    } finally {
      setLikingId(null)
    }
  }

  const handleLikeChange = (entryId: string, isLiked: boolean) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          is_liked: isLiked,
          likes_count: isLiked 
            ? (entry.likes_count || 0) + 1 
            : Math.max(0, (entry.likes_count || 0) - 1)
        }
      }
      return entry
    }))
  }

  const toggleComments = (entryId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUserId) {
      toast.error("You need to be logged in to add entries")
      return
    }
    
    try {
      const newEntry = {
        user_id: currentUserId,
        media_type: activeTab,
        title,
        creator,
        cover_url: coverUrl,
        comment,
        is_public: true
      }
      
      const createdEntry = await createMediaEntry(newEntry)
      
      // Transformar la entrada creada para que coincida con la interfaz MediaEntry de la página
      const transformedEntry = {
        id: createdEntry.id || '',
        title: createdEntry.title,
        creator: createdEntry.creator,
        type: createdEntry.media_type,
        comment: createdEntry.comment,
        coverUrl: createdEntry.cover_url,
        username: currentUserId,
        likes_count: 0,
        is_liked: false
      }
      
      setEntries([transformedEntry, ...entries])
      setTitle("")
      setCreator("")
      setComment("")
      setCoverUrl("")
      setIsAddDialogOpen(false)
      toast.success("Entry added successfully")
    } catch (error) {
      console.error("Error adding entry:", error)
      toast.error("Failed to add entry")
    }
  }

  const handleShare = (entry: MediaEntry) => {
    setSelectedEntry(entry)
    setShareDialogOpen(true)
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5f2]">
      <header className="sticky top-0 z-10 border-b bg-[#f8f5f2]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-medium">Your Feed</h1>
              <p className="text-muted-foreground mt-2">See what your friends are watching, reading, and listening to</p>
            </div>
            <Button asChild>
              <Link href="/add">Add New Entry</Link>
            </Button>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No entries yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gray-900 text-white hover:bg-gray-800">
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <FeedCard
                  key={entry.id}
                  id={entry.id}
                  username={entry.username}
                  mediaType={entry.type}
                  title={entry.title}
                  creator={entry.creator}
                  comment={entry.comment}
                  likes={entry.likes_count || 0}
                  isPublic={true}
                  timestamp="Just now"
                  coverUrl={entry.coverUrl}
                  isLiked={entry.is_liked}
                  currentUserId={currentUserId}
                  onDelete={handleDelete}
                  onLikeChange={handleLikeChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add New Entry</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as MediaType)} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger 
                  value="movie" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    Movie
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="book" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Book
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="music" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Music
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-gray-700">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                      required
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="creator" className="text-gray-700">
                      {activeTab === "movie" ? "Director" : activeTab === "book" ? "Author" : "Artist"}
                    </Label>
                    <Input
                      id="creator"
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                      placeholder={`Enter ${activeTab === "movie" ? "director" : activeTab === "book" ? "author" : "artist"}`}
                      required
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cover" className="text-gray-700">Cover URL</Label>
                    <Input
                      id="cover"
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Enter cover image URL"
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comment" className="text-gray-700">Comment</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      required
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400 min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Share
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {selectedEntry && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          title={selectedEntry.title}
          creator={selectedEntry.creator}
          mediaType={selectedEntry.type}
          comment={selectedEntry.comment}
          username={selectedEntry.username}
          coverUrl={selectedEntry.coverUrl}
        />
      )}
    </div>
  )
}

