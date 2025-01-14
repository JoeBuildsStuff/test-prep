"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Test } from "./schema"


export const columns: ColumnDef<Test>[] = [
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
    header: "Test ID", 
    cell: ({ row }) => {
      const testId = row.getValue("id") as string
      return (
        <Badge variant="outline" className="font-mono">
          {`${testId.slice(0, 3)}...${testId.slice(-3)}`}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string | null
      return (
        <div className="w-fit">
          {date ? format(new Date(date), "PPp") : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "completed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("completed_at") as string | null
      return (
        <div className="w-fit">
          {date ? format(new Date(date), "PPp") : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "total_questions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Questions" />
    ),
    cell: ({ row }) => <div className="w-fit"><Badge variant="outline">{row.getValue("total_questions")}</Badge></div>,
  },
  {
    accessorKey: "completed_questions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const completedQuestions = row.getValue("completed_questions") as number
      const testId = row.getValue("id") as string
      return (
        <div className="w-fit">
          <Link href={`/workspace/history?test_id=${testId}`}>
            <Badge variant="outline">{completedQuestions}</Badge>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "correct_answers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correct" />
    ),
    cell: ({ row }) => {
      const correctCount = row.getValue("correct_answers") as number
      const testId = row.getValue("id") as string
      return (
        <div className="w-fit">
          <Link href={`/workspace/history?test_id=${testId}&is_correct=true`}>
            <Badge variant="outline">{correctCount}</Badge>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "wrong_answers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wrong" />
    ),
    cell: ({ row }) => {
      const wrongCount = row.getValue("wrong_answers") as number
      const testId = row.getValue("id") as string
      return (
        <div className="w-fit">
          <Link href={`/workspace/history?test_id=${testId}&is_correct=false`}>
            <Badge variant="outline">{wrongCount}</Badge>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => {
      const score = row.getValue("score") as number
      const testId = row.getValue("id") as string
      return (
        <div className="w-fit">
          {score > 0 ? (
            <Link href={`/workspace/history?test_id=${testId}`}>
              <Badge variant={
                score >= 70 ? "green" : 
                score >= 50 ? "yellow" : 
                "red"
              }>
                {score}%
              </Badge>
            </Link>
          ) : null}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
