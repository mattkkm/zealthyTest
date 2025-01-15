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
      await userService.deleteUser(userId)
      toast({
        title: "Success",
        description: "User has been deleted",
      })
      onDelete()
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete User
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