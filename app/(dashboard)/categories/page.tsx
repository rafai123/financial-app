"use client"

import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"

import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useNewCategory } from "@/features/categories/hooks/use-new-categories"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories"

const AccountPage = () => {

    const {onOpen} = useNewCategory()
    const categoriesQuery = useGetCategories()
    const categories = categoriesQuery.data || []
    const deleteCategories = useBulkDeleteCategories()

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending

    if (categoriesQuery.isLoading) {
        return (
            <div className="max-2-screen-2xl w-full mx-auto pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 lg:size-12 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            <div className="mx-auto max-w-screen-2xl w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm ">
                    <CardHeader className="flex gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="text-xl line-clamp-1">
                            Categories Page
                        </CardTitle>
                        <Button
                            size="sm"
                            onClick={onOpen}
                        >
                            <Plus className="size-4 mr-2" />
                            Add new
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            filterKey="name"
                            columns={columns} 
                            data={categories} 
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteCategories.mutate({ids})
                            }}
                            disabled={isDisabled}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default AccountPage