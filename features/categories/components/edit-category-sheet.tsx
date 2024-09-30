import { useOpenCategory } from "@/features/categories/hooks/use-open-categories";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useConfirm } from "@/hooks/use-confirm";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { z } from "zod";
import { insertCategorySchema } from "@/db/schema";
import { Loader2 } from "lucide-react";

const FormSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof FormSchema>;

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const categoryQuery = useGetCategory(id);
  const editMutate = useEditCategory(id!);
  const deleteMutate = useDeleteCategory(id);
  const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You will perform to delete this category");

  const isLoading = editMutate.isPending || categoryQuery.isPending || deleteMutate.isPending;

  const onSubmit = (values: FormValues) => {
    console.log({ values });
    editMutate.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
    // mutate.mutate(values, {
    //     onSuccess: () => {
    //         onClose()
    //     }
    // })
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutate.mutate(undefined, {
        onSuccess: () => {
          onClose()
        }
      });
    }
  };

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm id={id} onSubmit={onSubmit} onDelete={handleDelete} disabled={isLoading} defaultValues={defaultValues} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditCategorySheet;
