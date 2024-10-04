import { client } from "@/lib/hono"
import { convertAmountFromMiliunits, formatterAmount } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const useGetTransactions = () => {
    const param = useSearchParams()
    const from = param.get("from") || ""
    const to = param.get("to") || ""
    const accountId = param.get("userId") || ""

    const query = useQuery({
        // TODO: check if params needed in the key
        queryKey: ["transactions", {from, to, accountId}],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch transactions")
            }

            const { data } = await response.json()
            return data.map((transaction) => ({
                ...transaction,
                // originalAmount: transaction.amount,
                // If want to using USD or something
                // amount: convertAmountFromMiliunits(transaction.amount)
            }))
        }
    })

    return query
}