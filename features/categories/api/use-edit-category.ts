import { client } from "@/lib/hono"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"]

export const useEditCategory = (id:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"].$patch({ param: {id}, json })

            if (!response.ok) {
                throw new Error("error")
            }
            return response.json() // Return the response data

        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["category"]})
            queryClient.invalidateQueries({queryKey: ["categories"]})
            toast.success("Category name has been successfully changed")
        },
        onError: () => {
            toast.error("Unable to change the category name")
        }
    })

    return mutation
}