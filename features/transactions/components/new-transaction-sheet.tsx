import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { TransactionForm } from "@/features/transactions/components/transactions-form";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Loader2 } from "lucide-react";

const FormSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof FormSchema>;

const NewTransactionSheet = () => {
  const { isOpen, onClose, onOpen } = useNewTransaction();
  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoriesOptions = (categoryQuery.data || []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountsOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending = createMutation.isPending ||
                    categoryMutation.isPending ||
                    accountMutation.isPending

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading

  const onSubmit = (values: FormValues) => {
    console.log({ values });

    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
    // console.log("test submit")
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Transaction</SheetTitle>
            <SheetDescription>Create a new transaction to track your transactions.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <>
                <TransactionForm 
                    onSubmit={onSubmit}
                    disabled={isPending}
                    categoryOptions={categoriesOptions}
                    onCreateCategory={onCreateCategory}
                    accountOptions={accountsOptions}
                    onCreateAccount={onCreateAccount}
                />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NewTransactionSheet;
