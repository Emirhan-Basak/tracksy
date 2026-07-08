type SelectProps = {
    value: string;
    options: readonly string[];
    placeholderOption: string;
    onChange: (value: string) => void;
}

export const Select = ({ value, options, placeholderOption, onChange }: SelectProps) => {

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="select w-full bg-base-200/70 transition-all duration-500 outline-none border-none rounded-2xl !focus:ring-2 !focus:ring-primary/40"
        >
            <option key="placeholder-option" value="" disabled>{placeholderOption}</option>
            {options.map((option, index) => (
                <option key={`${option}-${index}`} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}