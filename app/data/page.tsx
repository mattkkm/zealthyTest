'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Search, Download, MoreHorizontal, Eye } from 'lucide-react'
import { userService } from '@/lib/services/api/userService'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ColumnSelector } from '@/components/dialogs/ColumnSelector'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteUserDialog } from "@/components/dialogs/DeleteUserDialog"

interface User {
  id: string
  email: string
  current_step: number
  about_me?: string
  street_address?: string
  birthdate?: string
  created_at: string
}

export default function DataPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedColumns, setSelectedColumns] = useState(['email', 'current_step', 'created_at'])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProgressColor = (step: number) => {
    if (step >= 3) return 'bg-green-500'
    if (step === 2) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getStatusBadge = (step: number) => {
    if (step >= 3) return <Badge className="bg-green-500">Complete</Badge>
    if (step === 2) return <Badge className="bg-yellow-500">In Progress</Badge>
    return <Badge>New</Badge>
  }

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    )
  }

  const renderCellContent = (user: User, key: string) => {
    switch (key) {
      case 'email':
        return user.email
      case 'current_step':
        return (
          <div className="space-y-1">
            {getStatusBadge(user.current_step)}
            <div className="flex items-center gap-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(user.current_step)}`}
                  style={{ width: `${(user.current_step / 3) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {Math.round((user.current_step / 3) * 100)}%
              </span>
            </div>
          </div>
        )
      case 'about_me':
        return user.about_me || '-'
      case 'street_address':
        return user.street_address || '-'
      case 'birthdate':
        return user.birthdate || '-'
      case 'created_at':
        return new Date(user.created_at).toLocaleDateString()
      default:
        return '-'
    }
  }

  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredUsers.map(user => {
      const rowData: { [key: string]: any } = {}
      selectedColumns.forEach(column => {
        switch (column) {
          case 'current_step':
            rowData[column] = `${Math.round((user.current_step / 3) * 100)}% Complete`
            break
          case 'created_at':
            rowData[column] = new Date(user.created_at).toLocaleDateString()
            break
          default:
            rowData[column] = user[column as keyof User] || '-'
        }
      })
      return rowData
    })

    // Convert to CSV
    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `user-data-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-0">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl md:text-2xl font-bold">
              User Data {!loading && `(${users.length})`}
            </CardTitle>
            <div className="flex gap-2">
              <ColumnSelector 
                selectedColumns={selectedColumns}
                onColumnToggle={handleColumnToggle}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-10 bg-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="relative rounded-lg border">
              <div className="overflow-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {selectedColumns.map((column) => (
                          <TableHead 
                            key={column} 
                            className="whitespace-nowrap"
                            style={{ minWidth: column === 'current_step' ? '200px' : '150px' }}
                          >
                            {column.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          {selectedColumns.map((column) => (
                            <TableCell 
                              key={column} 
                              className="truncate"
                              style={{ minWidth: column === 'current_step' ? '200px' : '150px' }}
                            >
                              {renderCellContent(user, column)}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details (Coming soon!)
                                </DropdownMenuItem>
                                <DeleteUserDialog 
                                  userId={user.id}
                                  userEmail={user.email}
                                  onDelete={() => handleUserDeleted(user.id)}
                                />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}