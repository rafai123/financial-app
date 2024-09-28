import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AccountForm } from "./account-form"
import { z } from "zod"
import { insertAccountSchema } from "@/db/schema"
import { useEditAccount } from "../api/use-edit-account"
import { Loader2 } from "lucide-react"
import { useDeleteAccount } from "../api/use-delete-account"
import { useConfirm } from "@/hooks/use-confirm"

const FormSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof FormSchema>

const EditAccountSheet = () => {
    const {isOpen, onClose, onOpen, id } = useOpenAccount()
    
    const accountQuery = useGetAccount(id)
    const editMutate = useEditAccount(id!)
    const deleteMutate = useDeleteAccount(id)
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You will perform to delete this account")
    
    const isLoading = editMutate.isPending || accountQuery.isPending || deleteMutate.isPending

    const onSubmit = (values: FormValues) => {
        console.log({values})
        editMutate.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
        // mutate.mutate(values, {
        //     onSuccess: () => {
        //         onClose()
        //     }
        // })
    }

    const handleDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutate.mutate()
            // onClose()
        }
    }

    const defaultValues = accountQuery.data ? {
        name : accountQuery.data.name
    } : {
        name: ""
    }

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" >
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-8 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                    <AccountForm 
                        id={id}
                        onSubmit={onSubmit}
                        onDelete={handleDelete}
                        disabled={isLoading}
                        defaultValues={defaultValues}
                    />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default EditAccountSheet