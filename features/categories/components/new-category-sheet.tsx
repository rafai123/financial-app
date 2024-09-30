import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useNewCategory } from "@/features/categories/hooks/use-new-categories";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { z } from "zod";
import { insertCategorySchema } from "@/db/schema";

const FormSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof FormSchema>;

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const mutate = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    console.log({ values });

    mutate.mutate(values, {
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
            <SheetTitle>New Category</SheetTitle>
            <SheetDescription>Create a new category to track your transactions.</SheetDescription>
          </SheetHeader>
          <CategoryForm
            onSubmit={onSubmit}
            disabled={mutate.isPending}
            defaultValues={{
              name: "",
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NewCategorySheet;
