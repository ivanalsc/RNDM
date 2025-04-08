"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { FeedCard } from "@/components/feed-card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getMediaEntries, deleteMediaEntry, getCurrentUser, MediaEntry } from "@/lib/supabase"

export default function MoviesPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push("/login")
        return
      }
      setCurrentUserId(user.id)
    }
    loadUser()
  }, [router])

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      setLoading(true)
      const data = await getMediaEntries("movie")
      setEntries(data)
    } catch (error) {
      console.error("Error loading entries:", error)
      toast.error("Failed to load entries")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId)
  }

  const handleDeleteConfirm = async () => {
    if (!entryToDelete || !currentUserId) return

    try {
      setIsDeleting(true)
      await deleteMediaEntry(entryToDelete, currentUserId)
      setEntries(entries.filter(entry => entry.id !== entryToDelete))
      toast.success("Entry deleted successfully")
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    } finally {
      setIsDeleting(false)
      setEntryToDelete(null)
    }
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
          <h1 className="text-3xl font-serif font-medium mb-6">Movies</h1>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No movies shared yet</div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="relative">
                  <FeedCard
                    username={entry.username}
                    mediaType="movie"
                    title={entry.title}
                    creator={entry.creator}
                    comment={entry.comment}
                    likes={entry.likes_count}
                    isPublic={true}
                    timestamp={new Date(entry.created_at).toLocaleDateString()}
                    coverUrl={entry.coverUrl}
                  />
                  {currentUserId === entry.username && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteClick(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
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
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 