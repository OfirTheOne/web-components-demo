

import { FC, derivedSignal, ISignal } from "@sigjs/sig";

export const IPhone14Toggle: FC<{ $value: ISignal<boolean> }> = ({ $value: $isOn }) => {
    const $isOff = derivedSignal($isOn, (isOn) => !isOn);
    const onToggle = () => {
        $isOn.setValue((prev) => !prev);
    };

    return (
        <div
            class:list={[
                `relative inline-block w-10 h-6 rounded-full`,
                {
                    "bg-green-400": $isOn,
                    "bg-gray-300": $isOff,
                }
            ]}
            onClick={onToggle}
        >
            <input type="radio" name="toggle" id="toggle" selected={$isOn as unknown as boolean} className="sr-only" />
            <span
                class:list={[
                    `absolute inset-0 w-4 h-4 mt-1 ml-1 rounded-full transition-transform`,
                    {
                        "translate-x-full bg-white": $isOn,
                        "bg-gray-400": $isOff
                    }
                ]} />
        </div>
    );
};