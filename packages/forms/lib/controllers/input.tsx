import * as Sig from "sig";

export const Input: Sig.FC<
    { value: Sig.Signal<string> } &
    Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'>
> = ({
    value,
    list = null,
    ...props }) => {
        return (
            <input
                value={(value) as unknown as string}
                list={list}
                onInput={(e) => value.setValue(() => e.target.value)}
                {...props} />
        );
    }

export const InputController: Sig.FC<{
    value: Sig.Signal<string>,
    label?: string,
    id: string,
    validation?: (value: string) => boolean,
    validationError?: string
} & Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'id'>> = ({
        value,
        id,
        label,
        required = false,
        validation,
        validationError = '',
        type = 'text',
        ...props }) => {
        const ref: { current: HTMLInputElement | null } = { current: null };
        return (
            <div>
                <label htmlFor={id}>{label}</label>
                <Input
                    ref={ref}
                    required={required}
                    type={type}
                    id={id}
                    value={value}
                    onInput={(e) => {
                        value.setValue(() => (e.target as HTMLInputElement).value)
                    }}
                    {...props}
                />
                {
                    validation ?
                        <Sig.Show
                            track={value}
                            when={([inputValue]) => {
                                return (ref.current && !ref.current.checkValidity()) || !validation(inputValue);
                            }}
                        >
                            <label className="error">{validationError}</label>
                        </Sig.Show>
                        : null
                }
            </div>
        );
    }