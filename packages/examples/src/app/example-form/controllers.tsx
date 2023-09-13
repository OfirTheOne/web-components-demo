import * as Sig from "sig";

export const Input: Sig.FC<
    { value: Sig.Signal<string> } &
    Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'>
> = ({ value, ...props }) => {
    return (
        <input
            value={(value) as unknown as string}
            list={props.list}
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
                                return (!ref.current || ref.current.checkValidity()) && !validation(inputValue);
                            }}
                        >
                            <label className="error">{validationError}</label>
                        </Sig.Show>
                        : null
                }
            </div>
        );
    }


export const Dropdown: Sig.FC<{
    value: Sig.Signal<string>,
    options: string[],
    key: string
}> = ({ value, options, key, ...props }) => {
    return (

        <div>
            <datalist id={"list_" + key}>
                {options.map((option) => <option value={option} />)}
            </datalist>
            <Input
                value={value}
                onChange={(e) => value.setValue(() => e.target.value)}
                list={"list_" + key}
                {...props}
            />
        </div>
    );
}



export const Checkbox: Sig.FC<{
    value: Sig.Signal<boolean>,
    label: string,
    id: string
}> = ({ value, label, id, ...props }) => {
    return (
        <div style={{ display: 'flex' }}>
            <input
                type="checkbox"
                id={id}
                checked={value as unknown as boolean}
                onChange={(e) => value.setValue(() => e.target.checked)}
                {...props}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
}