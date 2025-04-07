"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { MediaSearch } from "@/components/media-search"
import Image from "next/image"
import { createMediaEntry } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AddEntryPage() {
  const router = useRouter()
  const [mediaType, setMediaType] = useState<"movie" | "book" | "music">("movie")
  const [selectedMedia, setSelectedMedia] = useState<{
    title: string
    creator: string
    coverUrl: string
  } | null>(null)
  const [comment, setComment] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset selected media when media type changes
  useEffect(() => {
    setSelectedMedia(null)
  }, [mediaType])

  const handleMediaSelect = (media: { title: string; creator: string; coverUrl: string }) => {
    console.log("Media selected in AddEntryPage:", media)
    
    // Verificar que los datos no estén vacíos
    if (media.title && media.creator && media.coverUrl) {
      setSelectedMedia(media)
    } else {
      console.error("Received empty media data:", media)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMedia) {
      toast.error("Please select a media item")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // En un entorno real, obtendrías el ID del usuario de la sesión
      const userId = "user-123" // Esto debería venir de tu sistema de autenticación
      
      // Crear la entrada en Supabase
      await createMediaEntry({
        user_id: userId,
        media_type: mediaType,
        title: selectedMedia.title,
        creator: selectedMedia.creator,
        cover_url: selectedMedia.coverUrl,
        comment,
        is_public: isPublic
      })
      
      toast.success("Entry saved successfully!")
      
      // Redirigir a la página principal
      router.push("/")
    } catch (error) {
      console.error("Error saving entry:", error)
      toast.error("Failed to save entry. Please try again.")
    } finally {
      setIsSubmitting(false)
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
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-medium">Add New Entry</h1>
            <p className="text-muted-foreground mt-2">Record what you've watched, read, or listened to</p>
          </div>

          <Card className="max-w-2xl mx-auto border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle className="font-serif">New Entry</CardTitle>
              <CardDescription>Fill in the details about your media experience</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <RadioGroup
                    value={mediaType}
                    onValueChange={(value) => setMediaType(value as "movie" | "book" | "music")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="movie" id="movie" />
                      <Label htmlFor="movie">Movie/TV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="book" id="book" />
                      <Label htmlFor="book">Book</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="music" id="music" />
                      <Label htmlFor="music">Music</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <MediaSearch
                    mediaType={mediaType}
                    onSelect={handleMediaSelect}
                  />
                </div>

                {selectedMedia && (
                  <div className="flex gap-4 items-start p-4 bg-muted/20 rounded-md">
                    <div className="relative w-24 h-36 rounded overflow-hidden">
                      <Image
                        src={selectedMedia.coverUrl}
                        alt={selectedMedia.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{selectedMedia.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMedia.creator}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Your Thoughts</Label>
                  <Textarea
                    placeholder="Share your thoughts about this..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Make this entry public</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={!selectedMedia || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

