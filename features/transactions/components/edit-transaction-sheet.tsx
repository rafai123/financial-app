import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionForm } from "./transactions-form";
import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { useEditTransaction } from "../api/use-edit-transaction";
import { Loader2 } from "lucide-react";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetTransactions } from "../api/use-get-transactions";
import { useGetTransaction } from "../api/use-get-transaction";

const FormSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof FormSchema>;

const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You will perform to delete this transaction");

  const transactionQuery = useGetTransaction(id!)
  const editMutate = useEditTransaction(id!);
  const deleteMutate = useDeleteTransaction(id);

  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
  const categoriesOptions = (categoryQuery.data || []).map(category => ({
    label: category.name,
    value: category.id,
  }))

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({ name })
  const accountsOptions = (accountQuery.data || []).map(account => ({
    label: account.name,
    value: account.id,
  }))

  const isLoading = 
    editMutate.isPending || 
    transactionQuery.isPending || 
    deleteMutate.isPending ||
    categoryQuery.isLoading ||
    accountQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const isPending = accountMutation.isPending || categoryMutation.isPending || editMutate.isPending

  const onSubmit = (values: FormValues) => {
    console.log({ values });
    editMutate.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutate.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? {
        // id: transactionQuery.data.id,
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
      }
    : {
        amount: "",
        payee: "",
        notes: "",
        date: new Date(),
        accountId: "",
        categoryId: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm 
              id={id} 
              onSubmit={onSubmit} 
              categoryOptions={categoriesOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountsOptions}
              onCreateAccount={onCreateAccount}
              onDelete={handleDelete} 
              disabled={isLoading} 
              defaultValues={defaultValues} 
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;
