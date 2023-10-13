import type { FC, ISignal } from "@sigjs/sig";
import { Show } from "@sigjs/sig";

export const TextInput: FC<{
    value: ISignal<string>
} & Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'>
> = ({
    value,
    className,
    list = null,
    ...props }) => {
        return (
            <input
                className={`sig-text-input ${className || ''}`}
                value={(value) as unknown as string}
                list={list}
                onInput={(e) => value.setValue(() => e.target.value)}
                {...props} />
        );
    }

export const TextInputController: FC<{
    value: ISignal<string>,
    id: string,
    label?: string,
    validation?: (value: string) => boolean,
    validationError?: string,
    className?: string
    inputProps?: Omit<JSX.HTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'type' | 'checked' | 'onChange'>
    labelProps?: Omit<JSX.HTMLAttributes<HTMLLabelElement>, 'htmlFor'>,
    errorLabelProps?: Omit<JSX.HTMLAttributes<HTMLLabelElement>, 'htmlFor'>,

} & Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'id'>> = ({
    value,
    id,
    label,
    required = false,
    validation,
    validationError = '',
    type = 'text',
    inputProps = {},
    labelProps = {},
    errorLabelProps = {}
}) => {
        const ref: { current: HTMLInputElement | null } = { current: null };
        return (
            <div className="sig-text-input-controller">
                <label htmlFor={id} className="sig-label" {...labelProps} >{label}</label>
                <TextInput
                    ref={ref}
                    required={required}
                    type={type}
                    id={id}
                    value={value}
                    onInput={(e) => value.setValue(() => (e.target as HTMLInputElement).value)}
                    {...inputProps}
                />
                {
                    validation ?
                        <Show
                            track={value}
                            when={([inputValue]) => (ref.current && !ref.current.checkValidity()) || !validation(inputValue)}
                        >
                            <label className="sig-label-error" {...errorLabelProps}>{validationError}</label>
                        </Show>
                        : null
                }
            </div>
        );
    }