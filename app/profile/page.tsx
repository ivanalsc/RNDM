"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { FeedCard } from "@/components/feed-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"

interface MediaEntry {
  id: string
  title: string
  creator: string
  type: string
  comment: string
  coverUrl: string
  username: string
  userId: string
  likes_count: number
  is_liked: boolean
  created_at: string
  is_public: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadUserAndEntries = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error:", sessionError)
          toast.error("Authentication error. Please log in again.")
          router.push("/login")
          return
        }
        
        if (!session) {
          console.error("No active session")
          router.push("/login")
          return
        }

        setCurrentUserId(session.user.id)

        // Consulta para obtener las entradas del usuario actual
        const { data: userEntries, error: entriesError } = await supabase
          .from('media_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (entriesError) {
          console.error("Error fetching user entries:", entriesError)
          toast.error("Failed to load your entries")
          setLoading(false)
          return
        }

        if (!userEntries || userEntries.length === 0) {
          setEntries([])
          setLoading(false)
          return
        }

        // Formatear las entradas para el componente FeedCard
        const formattedEntries = userEntries.map(entry => ({
          id: entry.id,
          title: entry.title,
          creator: entry.creator,
          type: entry.media_type || entry.type,
          comment: entry.comment,
          coverUrl: entry.cover_url,
          username: "You",
          userId: entry.user_id,
          likes_count: 0,
          is_liked: false,
          created_at: entry.created_at,
          is_public: entry.is_public || true
        }))

        setEntries(formattedEntries)
      } catch (error: any) {
        console.error("Error loading entries:", error)
        toast.error("Failed to load your entries")
      } finally {
        setLoading(false)
      }
    }

    loadUserAndEntries()
  }, [router])

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId)
  }

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('media_entries')
        .delete()
        .eq('id', entryToDelete)

      if (error) throw error

      setEntries(entries.filter(entry => entry.id !== entryToDelete))
      toast.success("Entry deleted successfully")
    } catch (error: any) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    } finally {
      setIsDeleting(false)
      setEntryToDelete(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5f2]">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-serif">👤</span>
            </div>
            <h1 className="text-2xl font-serif">Your Profile</h1>
            <Button variant="outline">Edit Profile</Button>
          </div>
          
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center">Loading your entries...</div>
            ) : entries.length === 0 ? (
              <div className="text-center">You haven't shared any media yet.</div>
            ) : (
              entries.map((entry) => (
                <FeedCard
                  key={entry.id}
                  id={entry.id}
                  username={entry.username}
                  userId={entry.userId}
                  mediaType={entry.type as "movie" | "book" | "music"}
                  title={entry.title}
                  creator={entry.creator}
                  comment={entry.comment}
                  likes={entry.likes_count}
                  isPublic={entry.is_public}
                  timestamp={formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  coverUrl={entry.coverUrl}
                  isLiked={entry.is_liked}
                  currentUserId={currentUserId || undefined}
                  onDelete={handleDeleteClick}
                />
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
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

