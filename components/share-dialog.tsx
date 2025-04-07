"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Copy, Download, Film, Music, Twitter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  creator: string
  mediaType: "movie" | "book" | "music"
  comment: string
  username: string
  coverUrl: string
}

export function ShareDialog({
  open,
  onOpenChange,
  title,
  creator,
  mediaType,
  comment,
  username,
  coverUrl,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://rndm.app/share/${username}/${title.replace(/\s+/g, "-").toLowerCase()}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadImage = async () => {
    if (shareCardRef.current) {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true })
      const link = document.createElement("a")
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this entry</DialogTitle>
          <DialogDescription>Share your media experience with others</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="image" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">As Image</TabsTrigger>
            <TabsTrigger value="link">As Link</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-4">
            <div className="flex flex-col items-center gap-4">
              <div ref={shareCardRef} className="w-full max-w-sm p-6 bg-[#f8f5f2] rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-xl font-serif font-bold">RNDM</div>
                  <Badge variant="secondary" className="flex items-center gap-1 ml-2">
                    {getMediaIcon()}
                    <span className="capitalize">{mediaType}</span>
                  </Badge>
                  <div className="ml-auto text-sm text-muted-foreground">@{username}</div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="relative min-w-[80px] h-[120px] rounded-md overflow-hidden">
                    <img src={coverUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-medium mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {creator}</p>
                    <p className="text-sm italic">"{comment}"</p>
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="font-medium">RNDM</div>
                  <div className="ml-auto">rndm.app</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownloadImage} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Share to Twitter
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-muted rounded-md text-sm font-mono break-all">
                https://rndm.app/share/{username}/{title.replace(/\s+/g, "-").toLowerCase()}
              </div>

              <Button onClick={handleCopyLink} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

