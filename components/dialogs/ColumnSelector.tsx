'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Columns } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Column {
  key: string
  label: string
}

const availableColumns: Column[] = [
  { key: 'email', label: 'Email' },
  { key: 'current_step', label: 'Progress' },
  { key: 'about_me', label: 'About' },
  { key: 'street_address', label: 'Address' },
  { key: 'birthdate', label: 'Birthdate' },
  { key: 'created_at', label: 'Join Date' },
]

interface ColumnSelectorProps {
  selectedColumns: string[]
  onColumnToggle: (column: string) => void
}

export function ColumnSelector({ selectedColumns, onColumnToggle }: ColumnSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Columns className="w-4 h-4" />
          Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Table Columns</DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[300px] px-4">
          <div className="space-y-4">
            {availableColumns.map((column) => (
              <div 
                key={column.key} 
                className="flex items-center space-x-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
              >
                <Checkbox 
                  id={column.key}
                  checked={selectedColumns.includes(column.key)}
                  onCheckedChange={() => onColumnToggle(column.key)}
                />
                <label 
                  htmlFor={column.key}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 