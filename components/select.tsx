"use client"

import { useMemo } from "react"
import { SingleValue } from "react-select"
import CreateableSelect from "react-select/creatable"

type Props = {
    onChange : (value?: string) => void
    onCreate? : (value: string) => void
    options?: { label: string, value: string }[]
    value?: string | null | undefined
    disabled?: boolean
    placehoder?: string
}

export const Select = ({
    onChange,
    onCreate,
    options = [],
    value,
    disabled,
    placehoder
}: Props) => {

    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value)
    }

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value )
    }, [options, value])

    return (
        <CreateableSelect 
            placeholder={placehoder}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    ...base,
                    backgroundColor: "#e2e8f0",
                    ":hover": {
                        borderColor: "#e2e8f0"
                    },
                })
            }}
            value={formattedValue}
            options={options}
            onChange={onSelect}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}