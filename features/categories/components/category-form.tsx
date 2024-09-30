import { useNewCategory } from "@/features/categories/hooks/use-new-categories"
import { useCreateCategory } from "@/features/categories/api/use-create-category"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { insertCategorySchema } from "@/db/schema"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (values: FormValues) => void
    onDelete?: () => void
    disabled?: boolean
}

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const  mutate = useCreateCategory()
    const {isOpen, onClose} = useNewCategory()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    // const handleSubmit = (values: FormValues) => {
    //     // console.log(values)
    //     // onSubmit(values)
    //     mutate.mutate(values, {
    //         onSuccess: () => {
    //             onClose()
    //         }
    //     })
    //     // onClose()
    // }

    const  handleDelete = () => {
        onDelete?.()
    }

    return (
        <div className="pt-2">
            <Form {...form} >
                <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-4 gap-4  grid"
                > 
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={disabled}
                                        placeholder="e.g. Food, Game, Travel, etc."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full m-4" disabled={ mutate.isPending || disabled } >
                        {id ? "Save Changes" : "Create Category"}
                    </Button>
                    {!!id && (
                        <Button
                            className="w-full gap-x-2"
                            type="button"
                            variant={"outline"}
                            onClick={handleDelete}
                            disabled={disabled}

                        >
                            <Trash2 className="size-4 mr-4 inline-block" />
                            <p className="ml-4">Delete Category</p>
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}