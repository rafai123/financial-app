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
import { Select } from "@/components/Select"
import { DatePicker } from "@/components/Date-Picker"
import { Textarea } from "@/components/ui/textarea"
import { AmountInput } from "@/components/Amount-input"
import { convertAmountToMiliunits } from "@/lib/utils"

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

    const handleSubmit = (values: FormValues) => {
        // If want to push with dollar or euro or miliunits currency
        // const Amount = parseFloat(values.amount)
        // const parsedAmount = convertAmountToMiliunits(Amount) 

        // console.log(values)
        const parsedAmount = parseFloat(values.amount)
        onSubmit({
            ...values,
            amount: parsedAmount,
        })
    }

    const  handleDelete = () => {
        onDelete?.()
    }

    return (
        <div className="pt-2">
            <Form {...form} >
                <form 
                    onSubmit={form.handleSubmit(handleSubmit)} 
                    className="space-y-4 gap-4  grid"
                >
                    <FormField 
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker 
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Account 
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placehoder="Select an account"
                                        disabled={disabled}
                                        onCreate={onCreateAccount}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={accountOptions}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placehoder="Select an category"
                                        disabled={disabled}
                                        onCreate={onCreateCategory}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={categoryOptions}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="payee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Payee
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Add a payee"
                                        disabled={disabled}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Amount
                                </FormLabel>
                                <FormControl>
                                    <AmountInput 
                                        {...field}
                                        disabled={disabled}
                                        placeholder="0"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Notes
                                </FormLabel>
                                <FormControl>
                                    <Textarea 
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="optional notes"
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full m-4" disabled={ mutate.isPending || disabled } >
                        {id ? "Save Changes" : "Create Transaction"}
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
                            <p className="ml-4">Delete Transaction</p>
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}