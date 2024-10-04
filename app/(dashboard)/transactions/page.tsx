"use client"

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"

import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"

const TransactionsPage = () => {

    const {onOpen} = useNewTransaction()
    const transactionsQuery = useGetTransactions()
    const transactions = transactionsQuery.data || []
    const deleteTransactions = useBulkDeleteTransactions()

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

    if (transactionsQuery.isLoading) {
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
                            Last 30 days transactions history
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
                            data={transactions} 
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id)
                                deleteTransactions.mutate({ids})
                            }}
                            disabled={isDisabled}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default TransactionsPage