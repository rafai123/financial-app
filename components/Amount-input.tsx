import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { MinusCircle, PlusCircle } from "lucide-react"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { is } from "drizzle-orm"
import CurrencyInput from "react-currency-input-field"

type Props = {
    value: string
    onChange: (value: string | undefined) => void
    placeholder?: string
    disabled?: boolean
}

export const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {

    const parsedValue = parseFloat(value)
    const isIncome = parsedValue > 0
    const isExpense = parsedValue < 0

    const onReverseValue = () => {
        if (!value) return;
        const newValue = parseFloat(value) * -1
        onChange(newValue.toString())
    }

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={20}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 text-white absolute top-1.5 left-1.5 p-2 flex items-center justify-center rounded-md transition",
                                isIncome && "bg-green-400 hover:bg-green-500",
                                isExpense && "bg-rose-400 hover:bg-red-500"
                            )}
                        >
                            {!parsedValue && <InfoCircledIcon className="size-3 text-white" />}
                            {isIncome && <PlusCircle className="size-3 text-white"  />}
                            {isExpense && <MinusCircle className="size-3 text-white" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput 
                prefix="Rp."
                placeholder={placeholder}
                value={value}
                decimalsLimit={0}
                decimalScale={0}
                onValueChange={onChange}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
            <p className="text-muted-foreground text-xs mt-2">
                {isExpense && "This will count as expense"}
                {isIncome && "This will count as income"}
            </p>
        </div>
    )
}