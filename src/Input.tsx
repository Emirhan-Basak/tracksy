import type { KeyboardEvent } from "react";

type InputProps = {
    placeholder: string;
    type: "text" | "number";
    value: string | number;
    onChange: (value: string) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = ({ placeholder, type, onKeyDown, value, onChange }: InputProps) => {
    return (
        <input
            placeholder={placeholder}
            type={type}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="focus-visible:outline-none no-spinner input input-ghost w-full rounded-2xl bg-base-200/50 transition-all duration-500 focus:border-transparent focus:ring-2 focus:ring-primary/30"
        />
    );
};
