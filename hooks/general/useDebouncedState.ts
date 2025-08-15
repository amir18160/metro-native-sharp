import { useState, useRef, useCallback } from 'react';

export function useDebouncedState<T>(initialValue: T, delay: number) {
    const [value, setValue] = useState<T>(initialValue);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setDebouncedValue = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setValue((prev) =>
                    typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue
                );
            }, delay);
        },
        [delay]
    );

    return [value, setDebouncedValue] as const;
}
