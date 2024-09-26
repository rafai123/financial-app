"use client"

import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"

// async function getData(): Promise<Payment[]> {
//     // Fetch data from your API here.
//     return [
//       {
//         id: "728ed52f",
//         amount: 100,
//         status: "pending",
//         email: "m@example.com",
//       },
//       // ...
//     ]
//   }

// const data: Payment[] = [
//     {
//         id: "728ed52f",
//         amount: 100,
//         status: "pending",
//         email: "m@example.com",
//     },
//     {
//         id: "728ed52f",
//         amount: 100,
//         status: "pending",
//         email: "rafaimhd123@gmail.com",
//     },
//     {
//         id: "728ed52f",
//         amount: 100,
//         status: "success",
//         email: "kitaIkuyo@anim.com",
//       // ...
//     }
// ]

const AccountPage = () => {

    const {onOpen} = useNewAccount()
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []

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
                            onDelete={() => {}}
                            disabled={false}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default AccountPage