import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>

export const useDeleteTransaction = (id?:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.transactions[":id"].$delete({param: {id}})
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
            queryClient.invalidateQueries({queryKey: ["transaction"]})
            toast.success("Transaction has been successfully deleted")
        },
        onError: () => {
            toast.error("Unnable to delete the transaction")
        }
    })

    return mutation
}