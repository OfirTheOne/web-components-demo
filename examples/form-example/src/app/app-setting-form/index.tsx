import { derivedSignal, signal } from "sig";


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
                                        <div className="text-gray-900">Display &amp; Brightness</div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
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
    const $isOff =  derivedSignal($isOn, (isOn) => !isOn);
    const onToggle = () => {
        $isOn.setValue((prev) => !prev);
    };
  
    return (
        <div
          class:list={[
              `relative inline-block w-10 h-6 rounded-full`,
              {
                  "bg-green-400" : $isOn,
                  "bg-gray-300" : $isOff,
                }
            ]}
          onClick={onToggle}
        >
            <input type="radio" name="toggle" id="toggle" selected={$isOn as unknown as boolean} className="sr-only" />
            <span
                class:list={[
                    `absolute inset-0 w-4 h-4 mt-1 ml-1 rounded-full transition-transform`, 
                    {
                        "translate-x-full bg-white" : $isOn,
                        "bg-gray-400" : $isOff
                    }
                ]} />
        </div>
    );
  };
  