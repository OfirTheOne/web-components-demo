import { createSignal, derivedSignal, signal } from "sig";
import { Input } from "@sig/forms";

export default function AppSettingForm() {
    return (
        <div className="h-screen w-screen">
            <div className=" bg-slate-100">
                <div className="flex flex-col items-center h-screen py-4">
                    <form className="flex flex-col items-start bg-slate-200 h-full w-1/4 border-4 border-black outline outline-8 outline-black rounded-[50px]">
                        <div className="flex flex-row justify-around h-[40px] w-full px-8">
                            <span className="text font-bold text-sm mt-2">9:41</span>
                            <span class="h-[25px] bg-black w-[200px] rounded-b-3xl "></span>
                            <span className="text font-bold text-sm mt-2">battery</span>

                        </div>
                        <div className="flex flex-col gap-4 w-full mt-4 ">
                            <div className="flex items-center justify-center px-4 py-2 border-b">
                                <IPhone14Search />
                            </div>
                            <div className="flex items-center justify-between px-4 py-2 border-b">
                                <div className="text-lg font-bold text-gray-900">Settings</div>
                            </div>
                            <div className="grid grid-cols gap-4">

                                <div className="bg-gray-100 border rounded-md w-100 m-2 pl-4">
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Wi-Fi</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Bluetooth</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="bg-gray-100 border rounded-md w-100 m-2 pl-4">
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Cellular</div>
                                        <IPhone14Toggle />
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Personal Hotspot</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="bg-gray-100 border rounded-md w-100 m-2 pl-4">
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Notifications</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Control Center</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="bg-gray-100 border rounded-md w-100 m-2 pl-4">
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Display</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Brightness</div>
                                        {/* <div className="w-6 h-6 bg-gray-300 rounded-full"></div> */}
                                        <IPhone14Slider />
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b pr-4">
                                        <div className="text-gray-900">Wallpaper</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


const IPhone14Toggle = () => {
    const $isOn = signal(true);
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



const IPhone14Slider = () => {
    const [value, setValue] = createSignal(50);
    const valuePercent = derivedSignal(value, (value) => `${value}%`);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="relative w-40 h-2">
            <input
                type="range"
                min="0"
                max="100"
                value={value as unknown as string}
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



const IPhone14Search = () => {
    const [value, setValue] = createSignal('')
    return (
        <div className="flex items-center px-4 py-2 border-b">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.873-4.873" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 10.5a5 5 0 11-7.07 0 5 5 0 017.07 0z" />
                    </svg>

                </div>

                <Input
                    value={value}
                    className="block w-full py-2 pl-10 pr-3 leading-5 bg-gray-300 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:bg-gray-300 focus:border-gray-500 focus:placeholder-gray-400/50"
                    type="text"
                    placeholder="Search"
                />
            </div>
        </div>
    );
};

