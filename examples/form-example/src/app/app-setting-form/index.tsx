import { derivedSignal, signal } from "@sigjs/sig";
import { ArrowLeftCircleIcon, BatteryAnimation } from "../icons";
import { IPhone14Search } from "./search";
import { IPhone14Slider } from "./slider";
import { IPhone14Toggle } from "./toggle";
import { IconButton } from "./icon-button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _usedClasses = [
    'opacity-0',
    'opacity-10',
    'opacity-20',
    'opacity-30',
    'opacity-40',
    'opacity-50',
    'opacity-60',
    'opacity-70',
    'opacity-80',
    'opacity-90',
    'opacity-100',
];
console.log(_usedClasses)
const buildPhoneHeader = () => (
    <div className="flex flex-row justify-around h-[40px] w-full px-8">
        <span className="text font-bold text-sm mt-2">9:41</span>
        <span className="h-[25px] bg-black w-[200px] rounded-b-3xl"></span>
        <span className="text font-bold text-sm mt-2">
            <BatteryAnimation />
        </span>
    </div>
);

const buildSettingGroup = (rows: JSX.Element[]) => (
    <div className="bg-gray-100 border rounded-md w-100 m-2 pl-4">
        {rows}
    </div>
);

const buildSettingRow = (label: string, body?: JSX.Element) => (
    <div className="flex items-center justify-between py-2 border-b pr-4">
        <div className="text-gray-900">{label}</div>
        {body || <div className="w-6 h-6 bg-gray-300 rounded-full"></div>}
    </div>
);

export default function AppSettingForm() {
    const $cellular = signal(true);
    const $brightness = signal(20);
    const $brightnessClass = derivedSignal($brightness, (brightness) => `opacity-${Math.round(brightness / 10) * 10}`);
    const $search = signal('');
    return (
        <div className="h-screen w-screen bg-slate-100">
            <div className="flex flex-col items-center h-screen py-4">
                <form className="relative flex flex-col items-start bg-slate-200 h-full w-1/4 border-4 border-black outline outline-8 outline-black rounded-[50px]">
                    <div style={{ pointerEvents: 'none'}}
                        class:list={["z-50 absolute h-full w-full border-4 border-black outline outline-8 outline-black rounded-[50px] bg-black", $brightnessClass]}
                    ></div>
                    { buildPhoneHeader() }
                    <div className="flex flex-col gap-4 w-full mt-4 ">
                        <div className="flex items-center justify-between px-6 py-2 h-4 border-b">
                            <IconButton icon={<ArrowLeftCircleIcon />} label="Back" onClick={() => {
                                console.log('clicked back', $brightness.value, $cellular.value, $search.value);
                            }} />
                            <IPhone14Search $value={$search} />
                            <IconButton icon={<ArrowLeftCircleIcon />} label="Back" onClick={() => {
                                console.log('clicked back');
                            }} />
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                            <div className="text-lg font-bold text-gray-900">Settings</div>
                        </div>
                        <div className="grid grid-cols gap-4">
                            {...[
                                buildSettingGroup([
                                    buildSettingRow('Wi-Fi'),
                                    buildSettingRow('Bluetooth')
                                ]),
                                buildSettingGroup([
                                    buildSettingRow('Airplane Mode'),
                                    buildSettingRow('Cellular', <IPhone14Toggle $value={$cellular} />),
                                    buildSettingRow('Personal Hotspot'),
                                ]),
                                buildSettingGroup([
                                    buildSettingRow('Notifications'),
                                    buildSettingRow('Control Center'),
                                ]),
                                buildSettingGroup([
                                    buildSettingRow('Display'),
                                    buildSettingRow('Brightness', <IPhone14Slider $value={$brightness} />),
                                    buildSettingRow('Wallpaper'),
                                ])
                            ]}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
