import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"
import { useCreateAccount } from "@/features/accounts/hooks/use-create-account"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { insertAccountSchema } from "@/db/schema"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const formSchema = insertAccountSchema.pick({
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

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const  mutate = useCreateAccount()
    const {isOpen, onClose} = useNewAccount()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    const handleSubmit = (values: FormValues) => {
        // console.log(values)
        // onSubmit(values)
        mutate.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
        // onClose()
    }

    const  handleDelete = () => {
        onDelete?.()
    }

    return (
        <>
            <Form {...form} >
                <form 
                    onSubmit={form.handleSubmit(handleSubmit)} 
                    className="space-y-4 pt-4 gap-4  grid"
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
                    <Button className="w-full m-4" disabled={mutate.isPending} >
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
        </>
    )
}