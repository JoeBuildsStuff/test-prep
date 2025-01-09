"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" className="pl-2" />
    ),
    cell: ({ row }) => <div className="pl-2 w-fit">{row.getValue("id")}</div>,
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
    cell: ({ row }) => <div className="w-fit">{row.getValue("total_questions")}</div>,
  },
  {
    accessorKey: "completed_questions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("completed_questions")}</div>,
  },
  {
    accessorKey: "correct_answers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correct" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("correct_answers")}</div>,
  },
  {
    accessorKey: "wrong_answers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wrong" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.getValue("wrong_answers")}</div>,
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => {
      const score = row.getValue("score") as number
      return (
        <div className="w-fit">
          {score > 0 ? (
            <Badge variant={
              score >= 70 ? "green" : 
              score >= 50 ? "yellow" : 
              "red"
            }>
              {score}%
            </Badge>
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
