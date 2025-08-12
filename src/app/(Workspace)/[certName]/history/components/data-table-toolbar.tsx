"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const sections = [
  {
    value: "Domain 1: Data Preparation for Machine Learning (ML)",
    label: "Data Preparation for Machine Learning (ML)",
  },
  {
    value: "Domain 2: ML Model Development",
    label: "ML Model Development",
  },
  {
    value: "Domain 3: Deployment and Orchestration of ML Workflows",
    label: "Deployment and Orchestration of ML Workflows",
  },
  {
    value: "Domain 4: ML Solution Monitoring, Maintenance, and Security",
    label: "ML Solution Monitoring, Maintenance, and Security",
  },
]

const subsections = [
  {
    value: "Task Statement 1.1: Ingest and store data",
    label: "Ingest and store data",
  },
  {
    value: "Task Statement 1.2: Transform data and perform feature engineering",
    label: "Transform data and perform feature engineering",
  },
  {
    value: "Task Statement 1.3: Ensure data integrity and prepare data for modeling",
    label: "Ensure data integrity and prepare data for modeling",
  },
  {
    value: "Task Statement 2.1: Choose a modeling approach",
    label: "Choose a modeling approach",
  },
  {
    value: "Task Statement 2.2: Train and refine models",
    label: "Train and refine models",
  },
  {
    value: "Task Statement 2.3: Analyze model performance",
    label: "Analyze model performance",
  },
  // ... rest of the subsections ...
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Question ID..."
          value={(table.getColumn("question_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("question_id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px]"
        />
        {table.getColumn("test_id") && (
          <Input
            placeholder="Filter by Test ID..."
            value={(table.getColumn("test_id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("test_id")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px]"
          />
        )}
        <Input
          placeholder="Search by topic..."
          value={(table.getColumn("question.title_short")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("question.title_short")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("question.section.name") && (
          <DataTableFacetedFilter
            column={table.getColumn("question.section.name")}
            title="Section"
            options={sections}
          />
        )}
        {table.getColumn("question.subsection.name") && (
          <DataTableFacetedFilter
            column={table.getColumn("question.subsection.name")}
            title="Subsection"
            options={subsections}
          />
        )}
        {table.getColumn("is_correct") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_correct")}
            title="Result"
            options={[
              { value: "true", label: "Correct" },
              { value: "false", label: "Incorrect" },
            ]}
          />
        )}
        {table.getColumn("favorite") && (
          <DataTableFacetedFilter
            column={table.getColumn("favorite")}
            title="Favorites"
            options={[
              { value: "true", label: "Favorited" },
              { value: "false", label: "Not Favorited" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
