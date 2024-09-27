"use client"

import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"

const AccountPage = () => {

    const {onOpen} = useNewAccount()
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []
    const deleteAccount = useBulkDeleteAccounts()

    const isDisabled = accountsQuery.isLoading || deleteAccount.isPending

    if (accountsQuery.isLoading) {
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
                            Accounts Page
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
                            data={accounts} 
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteAccount.mutate({ids})
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