import * as Sig from "sig";

export const Checkbox: Sig.FC<{
    value: Sig.Signal<boolean>,
    id: string
}> = ({ value, ...props }) => {
    return (
        <input
            type="checkbox"
            checked={value as unknown as boolean}
            onChange={(e) => value.setValue(() => e.target.checked)}
            {...props}
        />
    );
}

export const CheckboxController: Sig.FC<{
    value: Sig.Signal<boolean>,
    label: string,
    id: string
}> = ({ value, label, id, ...props }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Checkbox
                value={value}
                id={id}
                {...props}
            />
            <label style={{ whiteSpace: "nowrap" }} htmlFor={id}>{label}</label>
        </div>
    );
}