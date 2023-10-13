import type { FC, ISignal} from "@sigjs/sig";
import './checkbox.scss';

export const Checkbox: FC<{
    value: ISignal<boolean>,
    id: string
} & Omit<JSX.HTMLAttributes<HTMLInputElement>,  'value' | 'type' | 'checked' | 'onChange'>> = ({ value, className, ...props }) => {
    return (
        <input className={`sig-checkbox ${className || ''}`}
            type="checkbox"
            checked={value as unknown as boolean}
            onChange={(e) => value.setValue(() => e.target.checked)}
            {...props}
        />
    );
}

export const CheckboxController: FC<{
    value: ISignal<boolean>,
    label: string,
    id: string
    className?: string
    inputProps?: Omit<JSX.HTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'type' | 'checked' | 'onChange'>
    labelProps?: Omit<JSX.HTMLAttributes<HTMLLabelElement>, 'htmlFor'>
}> = ({ value, label, id, className, inputProps = {}, labelProps = {} }) => {
    return (
        <div className={`sig-checkbox-controller ${className || ''}`}>
            <Checkbox
                value={value}
                id={id}
                {...inputProps}
            />
            <label htmlFor={id} {...labelProps}>{label}</label>
        </div>
    );
}