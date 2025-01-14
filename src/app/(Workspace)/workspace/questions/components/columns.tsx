"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { Question } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
