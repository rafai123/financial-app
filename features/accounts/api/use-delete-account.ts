import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>

export const useDeleteAccount = (id?:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"].$delete({param: {id}})
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["account", {id}]})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
            toast.success("Account has been successfully deleted")
        },
        onError: () => {
            toast.error("Unnable to delete the account")
        }
    })

    return mutation
}