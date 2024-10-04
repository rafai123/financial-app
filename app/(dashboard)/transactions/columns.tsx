"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Actions } from "./Actions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { formatterAmount } from "@/lib/utils"
import { AccountColumn } from "./Account-Column"
import { CategoryColumn } from "./Category-Column"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]

export const columns: ColumnDef<ResponseType>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <p>{format(row.original.date, "dd MMMM yyyy")}</p>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
            >
              Category
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <CategoryColumn id={row.original.id} category={row.original.category} categoryId={row.original.categoryId} />
      )
    }
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
            >
              Payee
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <p>{row.original.payee}</p>
      )
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {

      const amount = parseFloat(row.getValue("amount"))
      
      console.log({amount})
      console.log(row.original.amount)
      return (
        <>
          <Badge
            variant={(amount < 0) ? "destructive" : "primary"}
            >
            {formatterAmount(amount)}
            {/* {(amount > 0 ) ? "true" : "false" } */}
            {/* {(typeof row.original.amount) === "string" ? row.original.amount : row.original.amount.toFixed(2)} */}
          </Badge>
        </>
      )
    }
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
            >
              Account
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <AccountColumn account={row.original.account} accountId={row.original.accountId} />
      )
    }
  },
  {
    accessorKey: "Edit",
    header: ({column}) => {
      return (
        <p>Action</p>
      )
    
    },
    cell: ({row}) => {
      return (
        <Actions id={row.original.id} />
      )
    }
  },
]
