import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedCard } from "@/components/feed-card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { UserStats } from "@/components/user-stats"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
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
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="@username" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-serif font-medium">username</h1>
                <p className="text-muted-foreground">Joined January 2023</p>
              </div>
              <Button variant="outline" className="ml-auto">
                Edit Profile
              </Button>
            </div>

            <UserStats moviesCount={42} booksCount={17} musicCount={86} />
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6 space-y-6">
              <FeedCard
                username="username"
                mediaType="book"
                title="The Midnight Library"
                creator="Matt Haig"
                comment="A beautiful story about the infinite possibilities of life. Highly recommend!"
                likes={24}
                isPublic={true}
                timestamp="2 hours ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
              <FeedCard
                username="username"
                mediaType="movie"
                title="Everything Everywhere All at Once"
                creator="Daniels"
                comment="Mind-blowing and emotional. One of the most creative films I've seen in years."
                likes={56}
                isPublic={true}
                timestamp="Yesterday"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
              <FeedCard
                username="username"
                mediaType="music"
                title="Circles"
                creator="Mac Miller"
                comment="This album feels like a warm hug. Perfect for rainy days."
                likes={18}
                isPublic={true}
                timestamp="3 days ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
            </TabsContent>
            <TabsContent value="movies" className="mt-6 space-y-6">
              <FeedCard
                username="username"
                mediaType="movie"
                title="Everything Everywhere All at Once"
                creator="Daniels"
                comment="Mind-blowing and emotional. One of the most creative films I've seen in years."
                likes={56}
                isPublic={true}
                timestamp="Yesterday"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
            </TabsContent>
            <TabsContent value="books" className="mt-6 space-y-6">
              <FeedCard
                username="username"
                mediaType="book"
                title="The Midnight Library"
                creator="Matt Haig"
                comment="A beautiful story about the infinite possibilities of life. Highly recommend!"
                likes={24}
                isPublic={true}
                timestamp="2 hours ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
            </TabsContent>
            <TabsContent value="music" className="mt-6 space-y-6">
              <FeedCard
                username="username"
                mediaType="music"
                title="Circles"
                creator="Mac Miller"
                comment="This album feels like a warm hug. Perfect for rainy days."
                likes={18}
                isPublic={true}
                timestamp="3 days ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

