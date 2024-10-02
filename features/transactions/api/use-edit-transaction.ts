import { client } from "@/lib/hono"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"]

export const useEditTransaction = (id:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"].$patch({ param: {id}, json })

            if (!response.ok) {
                throw new Error("error")
            }
            return response.json() // Return the response data

        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transaction", { id }]})
            queryClient.invalidateQueries({queryKey: ["transactions"]})
            // TODO: invalidate summary
            toast.success("Transaction name has been successfully changed")
        },
        onError: () => {
            toast.error("Unable to change the transaction name")
        }
    })

    return mutation
}