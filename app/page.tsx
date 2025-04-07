"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MediaEntry, getMediaEntries, deleteMediaEntry, toggleLike } from "@/lib/supabase"
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

export default function HomePage() {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  // En un entorno real, esto vendría de tu sistema de autenticación
  const currentUserId = "user-123"

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      // Obtener todas las entradas públicas
      const data = await getMediaEntries(currentUserId, true)
      setEntries(data)
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

  const toggleComments = (entryId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
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
              <h1 className="text-3xl font-serif font-medium">Your Media Journey</h1>
              <p className="text-muted-foreground mt-2">Track and share your experiences</p>
            </div>
            <Button asChild>
              <Link href="/add">Add New Entry</Link>
            </Button>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No entries yet</p>
              <Button asChild>
                <Link href="/add">Add Your First Entry</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user_id || 'default'}`} />
                          <AvatarFallback>
                            {entry.user_id?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{entry.user_id || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.created_at ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true }) : ''}
                          </p>
                        </div>
                      </div>
                      {entry.user_id === currentUserId && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              disabled={deletingId === entry.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your entry.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(entry.id!)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                        {entry.media_type}
                      </span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-24 h-36 rounded overflow-hidden">
                        <Image
                          src={entry.cover_url}
                          alt={entry.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground">{entry.creator}</p>
                      </div>
                    </div>
                    {entry.comment && (
                      <p className="text-sm mb-4">{entry.comment}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-2 ${entry.is_liked ? 'text-red-500' : 'text-muted-foreground hover:text-primary'}`}
                          onClick={() => entry.id && handleLike(entry)}
                          disabled={likingId === entry.id}
                        >
                          <Heart
                            className={`h-4 w-4 ${entry.is_liked ? 'fill-current' : ''}`}
                          />
                          <span className="text-xs">{entry.likes_count || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => entry.id && toggleComments(entry.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{entry.comments_count || 0}</span>
                          {entry.id && expandedComments[entry.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Sección de comentarios expandible */}
                  {entry.id && expandedComments[entry.id] && (
                    <div className="border-t p-4 bg-muted/30">
                      <Comments
                        entryId={entry.id}
                        currentUserId={currentUserId}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

