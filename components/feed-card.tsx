"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Film, Heart, MessageSquare, Music, Share2 } from "lucide-react"
import { ShareDialog } from "@/components/share-dialog"

interface FeedCardProps {
  username: string
  mediaType: "movie" | "book" | "music"
  title: string
  creator: string
  comment: string
  likes: number
  isPublic: boolean
  timestamp: string
  coverUrl: string
}

export function FeedCard({
  username,
  mediaType,
  title,
  creator,
  comment,
  likes,
  isPublic,
  timestamp,
  coverUrl,
}: FeedCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    setLikeCount(likes)
  }, [likes])

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
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
    <Card className="overflow-hidden border-none shadow-md bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={`@${username}`} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link href="/profile" className="font-medium hover:underline">
              @{username}
            </Link>
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
          {!isPublic && (
            <Badge variant="outline" className="ml-auto">
              Private
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative min-w-[100px] h-[150px] rounded-md overflow-hidden">
            <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-2 flex items-center gap-1">
              {getMediaIcon()}
              <span className="capitalize">{mediaType}</span>
            </Badge>
            <h3 className="text-lg font-medium font-serif">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">by {creator}</p>
            <p className="text-sm">{comment}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={title}
        creator={creator}
        mediaType={mediaType}
        comment={comment}
        username={username}
        coverUrl={coverUrl}
      />
    </Card>
  )
}

