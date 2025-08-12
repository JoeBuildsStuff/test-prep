"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

import { UserResponse } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { format } from "date-fns"

function FavoriteCell({ row }: { row: Row<UserResponse> }) {
  const [isFavorited, setIsFavorited] = useState(row.getValue("favorite") as boolean)
  const questionId = row.original.question_id
  
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

export const columns: ColumnDef<UserResponse>[] = [
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
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string | null
      return (
        <div className="w-fit">
          {date ? format(new Date(date), "MMM dd @ h:mm a") : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "question_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.getValue("question_id")}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as string;
      const searchValue = Array.isArray(value) ? value[0] : value;
      return rowValue.toLowerCase().includes(String(searchValue).toLowerCase());
    },
  },
  {
    accessorKey: "test_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Test ID" />
    ),
    cell: ({ row }) => {
      const testId = row.getValue("test_id") as string | null
      return (
        <div className="w-fit">
          {testId ? (
            <Link href={`/workspace/tests?test_id=${testId}`}>
              <Badge variant="outline">
                {testId ? `${testId.slice(0, 3)}...${testId.slice(-3)}` : ""}
              </Badge>
            </Link>
          ) : "-"}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.question?.title_short || '',
    id: "question.title_short",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.original.question?.title_short || '-'}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.question?.section?.name || '',
    id: "question.section.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.original.question?.section?.name || '-'}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.question?.subsection?.name || '',
    id: "question.subsection.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subsection" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.original.question?.subsection?.name || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: "selected_answers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selected Answers" />
    ),
    cell: ({ row }) => {
      const answers = row.getValue("selected_answers") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {answers.map((answer, index) => (
            <Badge key={index} variant="secondary">
              {answer}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "is_correct",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Result" />
    ),
    cell: ({ row }) => {
      const isCorrect = row.getValue("is_correct") as boolean
      return (
        <div className="w-fit">
          <Badge variant={isCorrect ? "green" : "red"}>
            {isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as boolean
      return value.includes(String(cellValue))
    },
  },
  {
    accessorKey: "attempt_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attempts" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          {row.getValue("attempt_number")}
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