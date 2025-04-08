"use client"

import { useState, useEffect } from "react"
import { MediaComment, getComments, addComment, deleteComment } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Importar AlertDialog dinámicamente solo en el cliente
const AlertDialog = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialog), { ssr: false })
const AlertDialogAction = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogAction), { ssr: false })
const AlertDialogCancel = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogCancel), { ssr: false })
const AlertDialogContent = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogContent), { ssr: false })
const AlertDialogDescription = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogDescription), { ssr: false })
const AlertDialogFooter = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogFooter), { ssr: false })
const AlertDialogHeader = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogHeader), { ssr: false })
const AlertDialogTitle = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogTitle), { ssr: false })

interface CommentsProps {
  entryId: string
  currentUserId: string
}

export function Comments({ entryId, currentUserId }: CommentsProps) {
  const [comments, setComments] = useState<MediaComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Asegurarse de que estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    loadComments()
  }, [entryId])

  const loadComments = async () => {
    try {
      const data = await getComments(entryId)
      setComments(data)
    } catch (error) {
      console.error("Error loading comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const comment = await addComment(entryId, currentUserId, newComment)
      if (comment) {
        setComments([...comments, comment])
        setNewComment("")
        toast.success("Comment added successfully")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    
    try {
      await deleteComment(deletingId, currentUserId)
      setComments(comments.filter(comment => comment.id !== deletingId))
      toast.success("Comment deleted successfully")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    } finally {
      setDeletingId(null)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-white border-gray-200 text-gray-900"
        />
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          {submitting ? "Posting..." : "Post"}
        </Button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback className="bg-gray-100 text-gray-900">
                  {comment.user_id ? comment.user_id.substring(0, 2).toUpperCase() : "AN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.user_id ? `User ${comment.user_id.substring(0, 4)}` : "Anonymous"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {comment.user_id === currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isClient && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Delete Comment
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-700">
                Are you sure you want to delete this comment? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white text-gray-700 border-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
} 