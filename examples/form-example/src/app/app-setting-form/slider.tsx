import { FC, derivedSignal, ISignal } from "@sigjs/sig";


export const IPhone14Slider: FC<{ $value: ISignal<number> }> = ({ $value }) => {
    const valuePercent = derivedSignal($value, (value) => `${value}%`);

    const handleChange = (event) => {
        $value.setValue(event.target.value);
    };

    return (
        <div className="relative w-40 h-2">
            <input
                type="range"
                min="0"
                max="100"
                value={$value as unknown as string}
                onChange={handleChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-30"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-full z-10"></div>
            <div
                className="absolute top-0 left-0 bg-green-400 h-full rounded-full z-10"
                style={{ width: valuePercent as unknown as string }}
            ></div>
            <div
                className="absolute top-1 left-0 w-6 h-6 bg-white border-2 border-gray-400 rounded-full  z-40"
                style={{ left: valuePercent as unknown as string, transform: "translate(-50%, -50%)" }}
            ></div>
        </div>

    );
};
