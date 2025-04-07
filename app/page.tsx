import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedCard } from "@/components/feed-card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export default function Home() {
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-serif font-medium">Your Feed</h1>
            <Button asChild>
              <Link href="/add">Add New Entry</Link>
            </Button>
          </div>
          <Tabs defaultValue="public" className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="public">Public Feed</TabsTrigger>
              <TabsTrigger value="personal">My Collection</TabsTrigger>
            </TabsList>
            <TabsContent value="public" className="mt-6 space-y-6">
              <FeedCard
                username="maria_reads"
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
                username="cinephile42"
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
                username="tune_explorer"
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
            <TabsContent value="personal" className="mt-6 space-y-6">
              <FeedCard
                username="you"
                mediaType="book"
                title="Klara and the Sun"
                creator="Kazuo Ishiguro"
                comment="Private note: Need to finish this by next week for book club."
                likes={0}
                isPublic={false}
                timestamp="1 week ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
              <FeedCard
                username="you"
                mediaType="movie"
                title="The Grand Budapest Hotel"
                creator="Wes Anderson"
                comment="Private note: Rewatch this for the visual aesthetics study."
                likes={0}
                isPublic={false}
                timestamp="2 weeks ago"
                coverUrl="/placeholder.svg?height=200&width=150"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

