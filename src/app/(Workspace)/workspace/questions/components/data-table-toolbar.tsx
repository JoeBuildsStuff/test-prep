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
  {
    value: "Task Statement 3.1: Select deployment infrastructure based on existing architecture and requirements",
    label: "Select deployment infrastructure based on existing architecture and requirements",
  },
  {
    value: "Task Statement 3.2: Create and script infrastructure based on existing architecture and requirements",
    label: "Create and script infrastructure based on existing architecture and requirements",
  },
  {
    value: "Task Statement 3.3: Use automated orchestration tools to set up continuous integration and continuous delivery (CI/CD) pipelines",
    label: "Use automated orchestration tools to set up continuous integration and continuous delivery (CI/CD) pipelines",
  },
  {
    value: "Task Statement 4.1: Monitor model inference",
    label: "Monitor model inference",
  },
  {
    value: "Task Statement 4.2: Monitor and optimize infrastructure and costs",
    label: "Monitor and optimize infrastructure and costs",
  },
  {
    value: "Task Statement 4.3: Secure AWS resources",
    label: "Secure AWS resources",
  },
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by topic..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("section") && (
          <DataTableFacetedFilter
            column={table.getColumn("section")}
            title="Section"
            options={sections}
          />
        )}
        {table.getColumn("subsection") && (
          <DataTableFacetedFilter
            column={table.getColumn("subsection")}
            title="Subsection"
            options={subsections}
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
