import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategory = (id?:string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.categories[":id"].$delete({param: {id}})
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["category", {id}]})
            queryClient.invalidateQueries({queryKey: ["categories"]})
            toast.success("Category has been successfully deleted")
        },
        onError: () => {
            toast.error("Unnable to delete the category")
        }
    })

    return mutation
}