"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Film, Heart, MessageSquare, Music, Share2, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Comments } from "@/components/comments"
import { toggleLike } from "@/lib/supabase"
import { toast } from "sonner"
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

// Importar ShareDialog dinámicamente solo en el cliente
const ShareDialog = dynamic(() => import("@/components/share-dialog").then(mod => mod.ShareDialog), { ssr: false })

interface FeedCardProps {
  id: string
  username: string
  mediaType: "movie" | "book" | "music"
  title: string
  creator: string
  comment: string
  likes: number
  isPublic: boolean
  timestamp: string
  coverUrl: string
  isLiked?: boolean
  currentUserId?: string
  onDelete?: (id: string) => void
  onLikeChange?: (id: string, isLiked: boolean) => void
}

export function FeedCard({
  id,
  username,
  mediaType,
  title,
  creator,
  comment,
  likes,
  isPublic,
  timestamp,
  coverUrl,
  isLiked: initialIsLiked = false,
  currentUserId,
  onDelete,
  onLikeChange,
}: FeedCardProps) {
  const [liked, setLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [shareOpen, setShareOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Asegurarse de que estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setLikeCount(likes)
  }, [likes])

  useEffect(() => {
    setLiked(initialIsLiked)
  }, [initialIsLiked])

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("You need to be logged in to like entries")
      return
    }

    try {
      const isLiked = await toggleLike(id, currentUserId)
      setLiked(isLiked)
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1)
      
      if (onLikeChange) {
        onLikeChange(id, isLiked)
      }
      
      toast.success(isLiked ? "Liked successfully" : "Unliked successfully")
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    }
  }

  const handleDelete = async () => {
    if (!currentUserId) return
    
    setDeleting(true)
    try {
      if (onDelete) {
        onDelete(id)
        toast.success("Entry deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    } finally {
      setDeleting(false)
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

  // Asegurarse de que username no sea undefined
  const safeUsername = username || "anonymous"

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={`@${safeUsername}`} />
            <AvatarFallback className="bg-gray-100 text-gray-900">{safeUsername.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link href="/profile" className="font-medium text-gray-900 hover:underline">
              @{safeUsername}
            </Link>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isPublic && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                Private
              </Badge>
            )}
            {currentUserId && username === currentUserId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    disabled={deleting}
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
                      onClick={handleDelete}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative min-w-[100px] h-[150px] rounded-md overflow-hidden">
            <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-2 flex items-center gap-1 bg-gray-100 text-gray-700">
              {getMediaIcon()}
              <span className="capitalize">{mediaType}</span>
            </Badge>
            <h3 className="text-lg font-medium font-serif text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mb-2">by {creator}</p>
            <p className="text-sm text-gray-700">{comment}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 text-gray-700 hover:text-red-500 hover:bg-gray-50 ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-700 hover:bg-gray-50"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)} className="text-gray-700 hover:bg-gray-50">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>

      {showComments && currentUserId && (
        <div className="px-4 pb-4 border-t pt-4">
          <Comments entryId={id} currentUserId={currentUserId} />
        </div>
      )}

      {isClient && (
        <ShareDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          title={title}
          creator={creator}
          mediaType={mediaType}
          comment={comment}
          username={safeUsername}
          coverUrl={coverUrl}
        />
      )}
    </Card>
  )
}

