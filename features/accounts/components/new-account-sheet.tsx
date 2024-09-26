import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AccountForm } from "./account-form"
import { z } from "zod"
import { insertAccountSchema } from "@/db/schema"

const FormSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof FormSchema>

const NewAccountSheet = () => {
    const {isOpen, onClose, onOpen} = useNewAccount()

    const onSubmit = (values: FormValues) => {
        console.log({values})
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" >
                    <SheetHeader>
                        <SheetTitle>
                            New Account
                        </SheetTitle>
                        <SheetDescription>
                            Create a new accountt to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    <AccountForm 
                        onSubmit={onSubmit}
                        disabled={false}
                        defaultValues={{
                            name: ""
                        }}
                    />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default NewAccountSheet