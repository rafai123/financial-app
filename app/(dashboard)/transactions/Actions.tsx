"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { isOpen, onOpen, onClose } = useOpenAccount()
  const [DialogConfirm, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction")
  const deleteMutate = useDeleteAccount(id)

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