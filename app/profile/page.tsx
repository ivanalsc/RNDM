"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedCard } from "@/components/feed-card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { UserStats } from "@/components/user-stats"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserMediaEntries, getCurrentUser, MediaEntry } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const loadUserAndEntries = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }
        setCurrentUser(user)
        
        const userEntries = await getUserMediaEntries(user.id)
        setEntries(userEntries)
      } catch (error) {
        console.error("Error loading user data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadUserAndEntries()
  }, [router])

  const filteredEntries = entries.filter(entry => {
    if (activeTab === "all") return true
    return entry.media_type === activeTab
  })

  const stats = {
    moviesCount: entries.filter(e => e.media_type === "movie").length,
    booksCount: entries.filter(e => e.media_type === "book").length,
    musicCount: entries.filter(e => e.media_type === "music").length
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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser?.user_metadata?.avatar_url || "/placeholder.svg?height=80&width=80"} alt={currentUser?.email || "User"} />
                <AvatarFallback>{currentUser?.email?.slice(0, 2).toUpperCase() || "UN"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-serif font-medium">{currentUser?.email || "Loading..."}</h1>
                <p className="text-muted-foreground">Joined {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Loading..."}</p>
              </div>
              <Button variant="outline" className="ml-auto">
                Edit Profile
              </Button>
            </div>

            <UserStats moviesCount={stats.moviesCount} booksCount={stats.booksCount} musicCount={stats.musicCount} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movie">Movies</TabsTrigger>
              <TabsTrigger value="book">Books</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6 space-y-6">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No entries found</div>
              ) : (
                filteredEntries.map((entry) => (
                  <FeedCard
                    key={entry.id}
                    id={entry.id || ""}
                    username={currentUser?.email || ""}
                    mediaType={entry.media_type}
                    title={entry.title}
                    creator={entry.creator}
                    comment={entry.comment}
                    likes={entry.likes_count || 0}
                    isPublic={entry.is_public}
                    timestamp={entry.created_at ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true }) : ""}
                    coverUrl={entry.cover_url}
                    currentUserId={currentUser?.id}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

