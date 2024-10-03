import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { insertAccountSchema, insertTransactionSchema } from "@/db/schema"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const formSchema = z.object({
    amount: z.string(),
    payee: z.string(),
    notes: z.string().nullable().optional(),
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (values: ApiFormValues) => void
    onDelete?: () => void
    disabled?: boolean
    accountOptions: { label: string, value: string }[]
    categoryOptions: { label: string, value: string }[]
    onCreateAccount: (name: string) => void
    onCreateCategory: (name: string) => void
}

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const  mutate = useCreateAccount()
    const {isOpen, onClose} = useNewAccount()

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
                                        placeholder="e.g. Cash, Bank, Credit Card"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full m-4" disabled={ mutate.isPending || disabled } >
                        {id ? "Save Changes" : "Create Account"}
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
                            <p className="ml-4">Delete Account</p>
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}