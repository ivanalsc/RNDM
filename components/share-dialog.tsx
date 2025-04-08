"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
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
import { BookOpen, Copy, Download, Film, Music, Twitter, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Importar html-to-image dinámicamente solo en el cliente
const htmlToImage = dynamic(() => import("html-to-image").then(mod => mod.toPng), { ssr: false })

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
  const [isClient, setIsClient] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Asegurarse de que estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

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
    if (shareCardRef.current && isClient && htmlToImage) {
      try {
        const dataUrl = await htmlToImage(shareCardRef.current, { cacheBust: true })
        const link = document.createElement("a")
        link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error("Error generating image:", error)
      }
    }
  }

  const handleTwitterShare = () => {
    const text = `Check out "${title}" by ${creator} on RNDM!`
    const url = `https://rndm.app/share/${username}/${title.replace(/\s+/g, "-").toLowerCase()}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Share Entry</DialogTitle>
          <DialogDescription className="text-gray-700">
            Share this entry with your friends
          </DialogDescription>
        </DialogHeader>
        
        <div ref={shareCardRef} className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative h-24 w-16 overflow-hidden rounded-md">
              <Image
                src={coverUrl || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-100 text-gray-900 border-gray-200">
                  {getMediaIcon()}
                  <span className="ml-1 capitalize">{mediaType}</span>
                </Badge>
              </div>
              <h4 className="text-sm font-medium text-gray-900">{title}</h4>
              <p className="text-sm text-gray-500">by {creator}</p>
              <p className="text-sm text-gray-700">{comment}</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="link" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
              Link
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
              Image
            </TabsTrigger>
            <TabsTrigger value="twitter" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
              Twitter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={`https://rndm.app/share/${username}/${title.replace(/\s+/g, "-").toLowerCase()}`}
                  readOnly
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="px-3 bg-gray-900 text-white hover:bg-gray-800"
                onClick={handleCopyLink}
              >
                <span className="sr-only">Copy link</span>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <div className="flex justify-center">
              <Button
                onClick={handleDownloadImage}
                className="bg-gray-900 text-white hover:bg-gray-800"
                disabled={!isClient}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter" className="mt-4">
            <div className="flex justify-center">
              <Button
                onClick={handleTwitterShare}
                className="bg-[#1DA1F2] text-white hover:bg-[#1a8cd8]"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

