"use client";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { isOpen, onOpen, onClose } = useOpenTransaction()
  const [DialogConfirm, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction")
  const deleteMutate = useDeleteTransaction(id)

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutate.mutate()
    }
  }
  
  return (
    <>
    <DialogConfirm />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuItem
            disabled={deleteMutate.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutate.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
