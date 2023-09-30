
import { FC, Signal } from "sig";
import { Input } from "@sig/forms";
import { MagnifyingGlassIcon, MicrophoneIcon } from "../icons";

export const IPhone14Search: FC<{ $value: Signal<string> }> = ({ $value }) => {
    return (
        <div className="flex items-center px-4 py-2 border-b">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                    {MagnifyingGlassIcon({}, undefined)}
                </div>
                <Input
                    value={$value}
                    className="block w-full py-2 pl-10 pr-3 leading-5 bg-gray-300 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:bg-gray-300 focus:border-gray-500 focus:placeholder-gray-400/50"
                    type="text"
                    placeholder="Search"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pl-2">
                    {MicrophoneIcon({}, undefined)}
                </div>
            </div>
        </div>
    );
};
