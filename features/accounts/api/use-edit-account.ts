import { client } from "@/lib/hono"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"]

export const useEditAccount = (id:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"].$patch({ param: {id}, json })

            if (!response.ok) {
                throw new Error("error")
            }
            return response.json() // Return the response data

        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["account"]})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
            toast.success("Account name has been successfully changed")
        },
        onError: () => {
            toast.error("Unable to change the account name")
        }
    })

    return mutation
}