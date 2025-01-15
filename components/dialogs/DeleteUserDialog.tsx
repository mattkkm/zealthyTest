'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { userService } from '@/lib/services/api/userService'

interface DeleteUserDialogProps {
  userId: string
  userEmail: string
  onDelete: () => void
}

export function DeleteUserDialog({ userId, userEmail, onDelete }: DeleteUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {

        const data = await userService.deleteUser(userId)
    //   const res = await fetch(`/api/users/${userId}`, {
    //     method: 'DELETE',
    //   })
      
    //   console.log('Delete response status:', res.status)
    //   console.log('Delete response statusText:', res.statusText)
      
    //   if (!res.ok) {
    //     const errorData = await res.json()
    //     console.error('Error response:', errorData)
    //     throw new Error(`Failed to delete user: ${res.statusText}`)
    //   }
      
    //   const data = await res.json()
      console.log('Delete success:', data)
      
      toast({
        title: "Success",
        description: "User has been deleted",
      })
      onDelete()
      setIsOpen(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete user</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the user {userEmail}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 