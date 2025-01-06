'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useTransition } from "react"
import { deleteTest } from "@/actions/test"

interface DeleteButtonProps {
    testId: string
}

export function DeleteButton({ testId }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => {
                        startTransition(() => deleteTest(testId))
                    }}
                >
                    Delete Test
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}