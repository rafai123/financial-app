import { useOpenCategory } from "@/features/categories/hooks/use-open-categories"
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"

type Props = {
    id : string
    category: string | null
    categoryId: string | null
}

export const CategoryColumn = ({category, categoryId, id}: Props) => {

    const {onOpen} = useOpenCategory()
    const {onOpen: openTransaction} = useOpenTransaction()

    const handleClick = () => {
        if (categoryId) {
            onOpen(categoryId)
        } else {
            openTransaction(id)
        }

    }

    return (
        <div
            className={cn(
                "flex items-center cursor-pointer hover:underline",
                !category && "text-rose-500",
            )}
            onClick={handleClick}
        >
            {!category && <TriangleAlert className="size-4 mr-2" />}
            {category || "Uncategorized"}
        </div>
    )
}