"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

import { Question } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

function FavoriteCell({ row }: { row: Row<Question> }) {
  const [isFavorited, setIsFavorited] = useState(row.getValue("favorite") as boolean)
  const questionId = row.getValue("id") as string
  
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const supabase = createClient()
    try {
      if (isFavorited) {
        const { error } = await supabase
          .schema('test_prep')
          .from('user_favorites')
          .delete()
          .eq('question_id', questionId)

        if (error) throw error
        setIsFavorited(false)
      } else {
        const { error } = await supabase
          .schema('test_prep')
          .from('user_favorites')
          .insert({
            question_id: questionId
          })

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="w-fit">
      <Flag 
        strokeWidth={0.75}
        className={cn(
          "h-5 w-5 cursor-pointer",
          isFavorited ? "fill-yellow-300/40 text-yellow-700/50 dark:text-yellow-200 dark:fill-yellow-400/20" : "text-gray-400"
        )}
        onClick={handleFavoriteToggle}
      />
    </div>
  )
}

export const columns: ColumnDef<Question>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" className="pl-2" />
    ),
    cell: ({ row }) => <div className="pl-2 w-fit">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as string;
      const searchValue = Array.isArray(value) ? value[0] : value;
      return rowValue.toLowerCase().includes(String(searchValue).toLowerCase());
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.getValue("title")}
        </div>
      )
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.getValue("section")}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "subsection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subsection" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.getValue("subsection")}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => {
      const tags = row.getValue("tags")
      const tagsArray = Array.isArray(tags) ? tags : tags ? String(tags).split(',') : []
      return (
        <div className="flex flex-wrap gap-1">
          {tagsArray.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "attempts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attempts" />
    ),
    cell: ({ row }) => {
      const attempts = row.getValue("attempts") as number
      const questionId = row.getValue("id")
      return (
        <div className="w-fit">
          {attempts > 0 ? (
            <Link href={`/workspace/history?question_id=${questionId}`}>
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">
                {attempts}
              </Badge>
            </Link>
          ) : (
            <Badge variant="outline">-</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "accuracy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accuracy" />
    ),
    cell: ({ row }) => {
      const attempts = row.getValue("attempts") as number
      const accuracy = row.getValue("accuracy") as number
      const questionId = row.getValue("id")
      return (
        <div className="w-fit">
          {attempts === 0 ? (
            "-"
          ) : (
            <Link href={`/workspace/history?question_id=${questionId}`}>
              <Badge 
                variant={accuracy >= 85 ? "green" : accuracy >= 70 ? "yellow" : "red"}
                className="cursor-pointer hover:opacity-80"
              >
                {accuracy}%
              </Badge>
            </Link>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "favorite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Flagged" />
    ),
    cell: ({ row }) => <FavoriteCell row={row} />,
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as boolean
      return value.includes(String(cellValue))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
